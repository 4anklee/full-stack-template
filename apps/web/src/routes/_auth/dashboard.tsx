import { Button, Card } from "@heroui/react";
import { createFileRoute } from "@tanstack/react-router";

import { authClient } from "@/lib/auth-client";

export const Route = createFileRoute("/_auth/dashboard")({
    component: DashboardPage,
});

function DashboardPage() {
    const { session, hasProSubscription } = Route.useRouteContext();
    const user = session.data?.user;

    return (
        <main className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-6 py-10">
            <h1 className="text-3xl font-semibold tracking-tight">Dashboard</h1>
            <Card>
                <Card.Header>
                    <Card.Title>Your Account</Card.Title>
                </Card.Header>
                <Card.Content>
                    <dl className="grid gap-4 sm:grid-cols-2">
                        <div>
                            <dt className="text-sm text-muted">Name</dt>
                            <dd>{user?.name}</dd>
                        </div>
                        <div>
                            <dt className="text-sm text-muted">Email</dt>
                            <dd className="break-all">{user?.email}</dd>
                        </div>
                    </dl>
                </Card.Content>
            </Card>
            <Card>
                <Card.Header>
                    <Card.Title>Subscription</Card.Title>
                    <Card.Description>
                        You’re on the {hasProSubscription ? "Pro" : "Free"} plan.
                    </Card.Description>
                </Card.Header>
                <Card.Footer>
                    {hasProSubscription ? (
                        <Button
                            variant="secondary"
                            onPress={async () => {
                                await authClient.customer.portal();
                            }}
                        >
                            Manage Subscription
                        </Button>
                    ) : (
                        <Button
                            onPress={async () => {
                                await authClient.checkout({ slug: "pro" });
                            }}
                        >
                            Upgrade to Pro
                        </Button>
                    )}
                </Card.Footer>
            </Card>
        </main>
    );
}
