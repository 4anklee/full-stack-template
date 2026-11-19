import { Card, buttonVariants } from "@heroui/react";
import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/success")({
    component: SuccessPage,
});

function SuccessPage() {
    return (
        <main className="mx-auto flex w-full max-w-xl items-center px-6 py-10">
            <Card className="w-full">
                <Card.Header>
                    <Card.Title>Payment Successful</Card.Title>
                    <Card.Description>
                        Return to your dashboard to manage your account and subscription.
                    </Card.Description>
                </Card.Header>
                <Card.Footer>
                    <Link to="/dashboard" className={buttonVariants()}>
                        Open Dashboard
                    </Link>
                </Card.Footer>
            </Card>
        </main>
    );
}
