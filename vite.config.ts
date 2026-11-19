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
        sortPackageJson: true,
    },
    staged: {
        "*.{js,ts,jsx,tsx,vue,svelte,json,jsonc,css,md}": "vp check --fix",
    },
});
