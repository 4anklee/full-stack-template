import project from "@repo/config/project.json";

export const app = {
    name: project.name,
    description: project.description,
    repositoryUrl: `https://github.com/${project.repository.owner}/${project.repository.name}`,
};
