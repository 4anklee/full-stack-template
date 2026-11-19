import { Card, Chip } from "@heroui/react";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

import { orpc } from "@/utils/orpc";

export const Route = createFileRoute("/")({
    component: HomeComponent,
});

const TITLE_TEXT = `
 ██████╗ ███████╗████████╗████████╗███████╗██████╗
 ██╔══██╗██╔════╝╚══██╔══╝╚══██╔══╝██╔════╝██╔══██╗
 ██████╔╝█████╗     ██║      ██║   █████╗  ██████╔╝
 ██╔══██╗██╔══╝     ██║      ██║   ██╔══╝  ██╔══██╗
 ██████╔╝███████╗   ██║      ██║   ███████╗██║  ██║
 ╚═════╝ ╚══════╝   ╚═╝      ╚═╝   ╚══════╝╚═╝  ╚═╝

 ████████╗    ███████╗████████╗ █████╗  ██████╗██╗  ██╗
 ╚══██╔══╝    ██╔════╝╚══██╔══╝██╔══██╗██╔════╝██║ ██╔╝
    ██║       ███████╗   ██║   ███████║██║     █████╔╝
    ██║       ╚════██║   ██║   ██╔══██║██║     ██╔═██╗
    ██║       ███████║   ██║   ██║  ██║╚██████╗██║  ██╗
    ╚═╝       ╚══════╝   ╚═╝   ╚═╝  ╚═╝ ╚═════╝╚═╝  ╚═╝
 `;

function HomeComponent() {
    const healthCheck = useQuery(orpc.healthCheck.queryOptions());

    return (
        <div className="container mx-auto max-w-3xl px-4 py-2">
            <pre className="overflow-x-auto font-mono text-sm">{TITLE_TEXT}</pre>
            <Card>
                <Card.Header>
                    <Card.Title>API Status</Card.Title>
                </Card.Header>
                <Card.Content>
                    <Chip
                        color={
                            healthCheck.isPending
                                ? "default"
                                : healthCheck.data
                                  ? "success"
                                  : "danger"
                        }
                        variant="soft"
                        role="status"
                    >
                        {healthCheck.isPending
                            ? "Checking..."
                            : healthCheck.data
                              ? "Connected"
                              : "Disconnected"}
                    </Chip>
                </Card.Content>
            </Card>
        </div>
    );
}
