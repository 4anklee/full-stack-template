import { Button, Dropdown, Header, Label, Skeleton, buttonVariants } from "@heroui/react";
import { Link, useNavigate } from "@tanstack/react-router";

import { authClient } from "@/lib/auth-client";

export default function UserMenu() {
    const navigate = useNavigate();
    const { data: session, isPending } = authClient.useSession();

    if (isPending) {
        return <Skeleton className="h-9 w-24 rounded-lg" />;
    }

    if (!session) {
        return (
            <Link to="/login" className={buttonVariants({ variant: "outline" })}>
                Sign In
            </Link>
        );
    }

    return (
        <Dropdown>
            <Button variant="ghost" aria-label={`Account menu for ${session.user.name}`}>
                {session.user.name}
            </Button>
            <Dropdown.Popover>
                <Dropdown.Menu aria-label="My Account">
                    <Dropdown.Section>
                        <Header>
                            <p>My Account</p>
                            <p className="text-sm font-normal text-muted">{session.user.email}</p>
                        </Header>
                        <Dropdown.Item
                            id="sign-out"
                            textValue="Sign Out"
                            variant="danger"
                            onAction={() => {
                                authClient.signOut({
                                    fetchOptions: {
                                        onSuccess: () => {
                                            navigate({ to: "/" });
                                        },
                                    },
                                });
                            }}
                        >
                            <Label>Sign Out</Label>
                        </Dropdown.Item>
                    </Dropdown.Section>
                </Dropdown.Menu>
            </Dropdown.Popover>
        </Dropdown>
    );
}
