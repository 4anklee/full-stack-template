import { buttonVariants } from "@heroui/react";
import { createFileRoute, Link } from "@tanstack/react-router";

import { app } from "@/lib/app";

export const Route = createFileRoute("/")({
    component: HomePage,
});

function HomePage() {
    return (
        <main className="mx-auto flex w-full max-w-5xl items-center px-6 py-16">
            <div className="flex max-w-xl flex-col gap-6">
                <div className="flex flex-col gap-3">
                    <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
                        {app.name}
                    </h1>
                    <p className="text-lg text-muted">{app.description}</p>
                </div>
                <div className="flex flex-wrap gap-3">
                    <Link to="/dashboard" className={buttonVariants()}>
                        Open Dashboard
                    </Link>
                    <a
                        href={app.repositoryUrl}
                        className={buttonVariants({ variant: "secondary" })}
                    >
                        View Source
                    </a>
                </div>
            </div>
        </main>
    );
}
