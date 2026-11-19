import json
import shutil
import subprocess
import tempfile
import unittest
from pathlib import Path

import yaml
from copier import run_copy, run_update
from copier.errors import UserMessageError

ROOT = Path(__file__).resolve().parents[1]


def git(path, *args):
    return subprocess.check_output(
        [
            "git",
            "-c",
            "user.name=Template test",
            "-c",
            "user.email=template@example.com",
            "-c",
            "core.hooksPath=/dev/null",
            *args,
        ],
        cwd=path,
        text=True,
        stderr=subprocess.DEVNULL,
    ).strip()


class TemplateTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.snapshot = tempfile.TemporaryDirectory(prefix="copier-template-")
        cls.source = Path(cls.snapshot.name).resolve()
        files = (
            subprocess.check_output(
                ["git", "ls-files", "--cached", "--others", "--exclude-standard", "-z"],
                cwd=ROOT,
            )
            .decode()
            .split("\0")
        )
        for name in set(files) - {""}:
            original = ROOT / name
            destination = cls.source / name
            destination.parent.mkdir(parents=True, exist_ok=True)
            if original.is_symlink():
                destination.symlink_to(original.readlink())
            elif original.is_file():
                shutil.copy2(original, destination)
        git(cls.source, "init", "--quiet", "--initial-branch=main")
        git(cls.source, "add", ".")
        git(cls.source, "commit", "--quiet", "-m", "Initial template")
        git(cls.source, "tag", "v0.1.0")

    @classmethod
    def tearDownClass(cls):
        cls.snapshot.cleanup()

    def setUp(self):
        self.workspace = tempfile.TemporaryDirectory(prefix="copier-project-")
        self.addCleanup(self.workspace.cleanup)
        self.destination = Path(self.workspace.name).resolve() / "project"

    def render(self, **answers):
        run_copy(
            "git+" + self.source.as_uri(),
            self.destination,
            data={"repository_owner": "acme", "repository_name": "my-app", **answers},
            defaults=True,
            skip_tasks=True,
            vcs_ref="HEAD",
            quiet=True,
        )
        return json.loads(
            (self.destination / "packages/config/project.json").read_text()
        )

    def test_renders_identity_and_docs_without_setup_files(self):
        project = self.render(project_name="My Application", app_id="com.acme.myapp")
        self.assertEqual(project["name"], "My Application")
        self.assertEqual(project["slug"], "my-app")
        self.assertEqual(
            project["repository"], {"owner": "acme", "name": "my-app", "branch": "main"}
        )
        self.assertEqual(project["mobile"]["iosBundleIdentifier"], "com.acme.myapp")
        self.assertEqual(project["mobile"]["androidPackage"], "com.acme.myapp")
        package = json.loads((self.destination / "package.json").read_text())
        self.assertEqual(package["name"], "my-app")
        self.assertNotIn("test:template", package["scripts"])
        self.assertIn("@repo/config", package["devDependencies"])
        self.assertTrue(
            (self.destination / "docker-compose.yml")
            .read_text()
            .startswith("name: my-app\n")
        )
        for path in [
            "README.md",
            "apps/fumadocs/README.md",
            "apps/fumadocs/content/docs/index.mdx",
            "apps/fumadocs/content/docs/development.mdx",
        ]:
            content = (self.destination / path).read_text()
            self.assertNotIn("template:start", content)
            self.assertNotIn("template:end", content)
            self.assertNotIn("bun run init", content)
            self.assertNotIn("Full Stack Template", content)
        self.assertTrue(
            (self.destination / "README.md")
            .read_text()
            .startswith("# My Application\n")
        )
        self.assertIn(
            "https://github.com/acme/my-app.git",
            (self.destination / "apps/fumadocs/content/docs/index.mdx").read_text(),
        )
        for path in [
            "copier.yml",
            ".copier",
            ".github/workflows/initialize.yml",
            ".github/workflows/template.yml",
            "scripts/init.ts",
            "scripts/init.test.ts",
        ]:
            self.assertFalse((self.destination / path).exists(), path)
        self.assertEqual(
            (self.destination / ".github/workflows/ci.yml").read_text(),
            (self.source / ".github/workflows/ci.yml").read_text(),
        )
        self.assertFalse(list(self.destination.rglob("*.jinja")))
        answers = yaml.safe_load((self.destination / ".copier-answers.yml").read_text())
        self.assertEqual(answers["_src_path"], "git+" + self.source.as_uri())
        self.assertEqual(
            git(self.source, "rev-parse", answers["_commit"]),
            git(self.source, "rev-parse", "HEAD"),
        )
        self.assertEqual(answers["app_id"], "com.acme.myapp")

    def test_normalizes_numeric_owners_and_punctuation(self):
        project = self.render(
            repository_owner="4anklee",
            repository_name="123_My.App",
            repository_branch="trunk",
        )
        self.assertEqual(project["slug"], "app-123-my-app")
        self.assertEqual(project["name"], "App 123 My App")
        self.assertEqual(
            project["mobile"]["androidPackage"], "com.github.app4anklee.app123myapp"
        )
        self.assertEqual(project["repository"]["branch"], "trunk")

    def test_serializes_quotes_and_shell_text_literally(self):
        description = 'A "project" with $(touch injected) and `commands`'
        project = self.render(
            project_name='A "Quoted" App', project_description=description
        )
        self.assertEqual(project["description"], description)
        self.assertEqual(project["name"], 'A "Quoted" App')
        self.assertFalse((self.destination / "injected").exists())

    def test_rejects_invalid_identifiers_and_schemes(self):
        for answers in [
            {"app_id": "com.acme.bad-id"},
            {"app_id": "com.acme.bad_id"},
            {"native_scheme": "https"},
            {"project_slug": "Invalid Slug"},
            {"repository_owner": "invalid_owner"},
        ]:
            with (
                self.subTest(answers=answers),
                self.assertRaises((UserMessageError, ValueError)),
            ):
                self.render(**answers)

    def test_updates_preserve_application_edits_and_change_answers(self):
        source = Path(self.workspace.name).resolve() / "template"
        git(
            Path(self.workspace.name), "clone", "--quiet", str(self.source), str(source)
        )
        self.source = source
        self.render()
        git(self.destination, "init", "--quiet", "--initial-branch=main")
        git(self.destination, "add", ".")
        git(self.destination, "commit", "--quiet", "-m", "Generated project")
        custom = self.destination / "application-notes.md"
        custom.write_text("My application changes\n")
        git(self.destination, "add", ".")
        git(self.destination, "commit", "--quiet", "-m", "Application customization")
        (source / "upstream-notes.md").write_text("A new template feature\n")
        git(source, "add", ".")
        git(source, "commit", "--quiet", "-m", "Template improvement")
        git(source, "tag", "v0.2.0")
        run_update(
            self.destination,
            data={"project_name": "Renamed Application"},
            defaults=True,
            skip_tasks=True,
            unsafe=True,
            overwrite=True,
            quiet=True,
        )
        project = json.loads(
            (self.destination / "packages/config/project.json").read_text()
        )
        self.assertEqual(project["name"], "Renamed Application")
        self.assertEqual(custom.read_text(), "My application changes\n")
        self.assertEqual(
            (self.destination / "upstream-notes.md").read_text(),
            "A new template feature\n",
        )
        answers = yaml.safe_load((self.destination / ".copier-answers.yml").read_text())
        self.assertEqual(answers["_commit"], "v0.2.0")
        self.assertEqual(answers["project_name"], "Renamed Application")


if __name__ == "__main__":
    unittest.main()
