import * as Linking from "expo-linking";
import * as WebBrowser from "expo-web-browser";
import { Button, Card, Spinner, useToast } from "heroui-native";
import { useState } from "react";
import { View } from "react-native";

import { AuthForm } from "@/components/auth-form";
import { Container } from "@/components/container";
import { authClient } from "@/lib/auth-client";
import { queryClient } from "@/utils/orpc";

import { ENV } from "../src/env";

export default function Home() {
    const { data: session, isPending: isSessionPending } = authClient.useSession();
    const [mode, setMode] = useState<"sign-in" | "sign-up">("sign-in");
    const { toast } = useToast();

    const openPolarLink = async (url: string, returnUrl: string) => {
        await WebBrowser.openAuthSessionAsync(url, returnUrl);
    };

    const getPolarReturnUrl = (returnUrl: string) => {
        const url = new URL("/polar/success", ENV.EXPO_PUBLIC_SERVER_URL);
        url.searchParams.set("returnUrl", returnUrl);
        return url.toString();
    };

    const handlePolarCheckout = async () => {
        const returnUrl = Linking.createURL("/");
        const polarReturnUrl = getPolarReturnUrl(returnUrl);
        const { data, error } = await authClient.checkout({
            slug: "pro",
            redirect: false,
            success_url: polarReturnUrl,
            return_url: polarReturnUrl,
        });

        if (error || !data?.url) {
            toast.show({
                variant: "danger",
                label: "Checkout unavailable",
                description: error?.message ?? "Unable to create a checkout session.",
            });
            return;
        }

        await openPolarLink(data.url, returnUrl);
    };

    const handlePolarPortal = async () => {
        const returnUrl = Linking.createURL("/");
        const { data, error } = await authClient.customer.portal({ redirect: false });

        if (error || !data?.url) {
            toast.show({
                variant: "danger",
                label: "Portal unavailable",
                description: error?.message ?? "Unable to open the customer portal.",
            });
            return;
        }

        await openPolarLink(data.url, returnUrl);
    };

    return (
        <Container className="p-6">
            <View className="gap-6">
                {session?.user ? (
                    <Card variant="secondary">
                        <Card.Body>
                            <Card.Title>Welcome, {session.user.name}</Card.Title>
                            <Card.Description>{session.user.email}</Card.Description>
                        </Card.Body>
                        <Card.Footer className="flex-col items-stretch gap-3">
                            <Button onPress={handlePolarCheckout}>
                                <Button.Label>Upgrade to Pro</Button.Label>
                            </Button>
                            <Button variant="outline" onPress={handlePolarPortal}>
                                <Button.Label>Manage Subscription</Button.Label>
                            </Button>
                            <Button
                                variant="danger-soft"
                                onPress={async () => {
                                    const result = await authClient.signOut();
                                    if (result.error) {
                                        toast.show({
                                            variant: "danger",
                                            label: result.error.message || "Failed to sign out",
                                        });
                                        return;
                                    }
                                    await queryClient.invalidateQueries();
                                }}
                            >
                                <Button.Label>Sign Out</Button.Label>
                            </Button>
                        </Card.Footer>
                    </Card>
                ) : null}

                {isSessionPending ? (
                    <View className="items-center py-6">
                        <Spinner accessibilityLabel="Loading account" />
                    </View>
                ) : !session?.user ? (
                    <View className="gap-4">
                        <AuthForm key={mode} mode={mode} />
                        <Button
                            variant="ghost"
                            onPress={() => setMode(mode === "sign-in" ? "sign-up" : "sign-in")}
                        >
                            <Button.Label>
                                {mode === "sign-in"
                                    ? "Need an account? Sign Up"
                                    : "Already have an account? Sign In"}
                            </Button.Label>
                        </Button>
                    </View>
                ) : null}
            </View>
        </Container>
    );
}
