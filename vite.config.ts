import { defineConfig } from "vite-plus";

export default defineConfig({
    lint: {
        plugins: ["unicorn", "typescript", "oxc", "react", "import"],
        env: {
            builtin: true,
        },
        ignorePatterns: [
            "node_modules/**",
            "**/node_modules/**",
            ".agents/skills/**",
            ".claude/skills/**",
            "apps/web/dist/**",
            "apps/web/.vinxi/**",
            "apps/web/.tanstack/**",
            "apps/web/src/routeTree.gen.ts",
            "apps/fumadocs/src/routeTree.gen.ts",
            "apps/native/.expo/**",
            "apps/native/dist/**",
            "apps/native/web-build/**",
            "apps/native/ios/**",
            "apps/native/android/**",
            "apps/server/dist/**",
            "packages/db/dist/**",
            "packages/api/dist/**",
            "packages/auth/dist/**",
        ],
        options: {
            typeAware: true,
            typeCheck: true,
        },
        settings: {
            react: {
                version: "19.3.1",
            },
            tailwindcss: {
                callees: ["cn"],
            },
        },
    },
    fmt: {
        tabWidth: 4,
        useTabs: false,
        ignorePatterns: [
            "node_modules/**",
            "**/node_modules/**",
            "apps/web/dist/**",
            "apps/web/.vinxi/**",
            "apps/web/.tanstack/**",
            "apps/web/src/routeTree.gen.ts",
            "apps/fumadocs/src/routeTree.gen.ts",
            "apps/native/.expo/**",
            "apps/native/dist/**",
            "apps/native/web-build/**",
            "apps/native/ios/**",
            "apps/native/android/**",
            "apps/server/dist/**",
            "packages/db/dist/**",
            "packages/api/dist/**",
            "packages/auth/dist/**",
        ],
        singleQuote: false,
        semi: true,
        sortImports: {
            internalPattern: ["@/", "~/", "#", "@full-stack-template/"],
        },
        sortPackageJson: true,
        overrides: [
            {
                files: ["apps/web/**"],
                options: {
                    sortTailwindcss: {
                        stylesheet: "./apps/web/src/index.css",
                        functions: ["cn"],
                    },
                },
            },
            {
                files: ["apps/fumadocs/**"],
                options: {
                    sortTailwindcss: {
                        stylesheet: "./apps/fumadocs/src/styles/app.css",
                        functions: ["cn"],
                    },
                },
            },
            {
                files: ["apps/native/**"],
                options: {
                    sortTailwindcss: {
                        stylesheet: "./apps/native/global.css",
                        functions: ["cn"],
                    },
                },
            },
        ],
    },
    staged: {
        "*.{js,jsx,mjs,cjs,ts,tsx,mts,cts,vue,svelte}": [
            "vp fmt --write",
            "vp lint --fix --no-error-on-unmatched-pattern",
        ],
        "*.{json,jsonc,css,md,mdx,yaml,yml,html}": "vp fmt --write",
    },
});
