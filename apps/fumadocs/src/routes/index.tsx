import { createFileRoute, Link } from "@tanstack/react-router";
import { HomeLayout } from "fumadocs-ui/layouts/home";

import { baseOptions } from "@/lib/layout.shared";
import { appName } from "@/lib/shared";

export const Route = createFileRoute("/")({
    component: Home,
});

function Home() {
    return (
        <HomeLayout {...baseOptions()}>
            <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 py-16 text-center">
                <h1 className="text-3xl font-semibold tracking-tight">{appName}</h1>
                <p className="max-w-md text-fd-muted-foreground">
                    Set up your project, understand the structure, and make it your own.
                </p>
                <Link
                    to="/docs/$"
                    params={{
                        _splat: "",
                    }}
                    className="mx-auto rounded-lg bg-fd-primary px-3 py-2 text-sm font-medium text-fd-primary-foreground"
                >
                    Get Started
                </Link>
            </div>
        </HomeLayout>
    );
}
