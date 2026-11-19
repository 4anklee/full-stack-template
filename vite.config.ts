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
            typeAware: false,
            typeCheck: false,
        },
        settings: {
            react: {
                version: "19.3.1",
            },
            tailwindcss: {
                callees: ["clsx", "cva", "cn"],
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
                        functions: ["cn", "clsx", "cva", "tv"],
                    },
                },
            },
            {
                files: ["apps/fumadocs/**"],
                options: {
                    sortTailwindcss: {
                        stylesheet: "./apps/fumadocs/src/styles/app.css",
                        functions: ["cn", "clsx", "cva", "tv"],
                    },
                },
            },
            {
                files: ["apps/native/**"],
                options: {
                    sortTailwindcss: {
                        stylesheet: "./apps/native/global.css",
                        functions: ["cn", "clsx", "cva", "tv"],
                    },
                },
            },
        ],
    },
    staged: {
        "*.{js,jsx,mjs,cjs,ts,tsx,mts,cts,vue,svelte}": ["vp fmt --write", "vp lint --fix"],
        "*.{json,jsonc,css,md,mdx,yaml,yml,html}": "vp fmt --write",
    },
});
