import { Separator } from "@heroui/react";
import { Link } from "@tanstack/react-router";

import { app } from "@/lib/app";

import UserMenu from "./user-menu";

export default function Header() {
    return (
        <header>
            <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-4 px-6 py-3">
                <Link to="/" className="font-semibold">
                    {app.name}
                </Link>
                <nav aria-label="Main navigation" className="flex items-center gap-4">
                    <Link to="/dashboard" className="text-sm">
                        Dashboard
                    </Link>
                    <UserMenu />
                </nav>
            </div>
            <Separator />
        </header>
    );
}
