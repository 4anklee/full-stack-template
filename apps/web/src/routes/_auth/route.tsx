import { Outlet, createFileRoute, redirect } from "@tanstack/react-router";

import { authClient } from "@/lib/auth-client";

export const Route = createFileRoute("/_auth")({
    ssr: false,
    component: AuthLayout,
    beforeLoad: async () => {
        const session = await authClient.getSession();
        if (!session.data) {
            throw redirect({
                to: "/login",
            });
        }
        const { data: customerState } = await authClient.customer.state();
        const hasProSubscription = (customerState?.active_subscriptions.length ?? 0) > 0;
        return { session, hasProSubscription };
    },
});

function AuthLayout() {
    return <Outlet />;
}
