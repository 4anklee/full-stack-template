import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

import AuthForm from "@/components/auth-form";

export const Route = createFileRoute("/login")({
    component: RouteComponent,
});

function RouteComponent() {
    const [mode, setMode] = useState<"sign-in" | "sign-up">("sign-up");

    return (
        <AuthForm
            key={mode}
            mode={mode}
            onSwitchMode={() => setMode(mode === "sign-in" ? "sign-up" : "sign-in")}
        />
    );
}
