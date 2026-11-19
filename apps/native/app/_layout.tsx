import "@/global.css";
import { QueryClientProvider } from "@tanstack/react-query";
import Constants from "expo-constants";
import { Stack } from "expo-router";
import { HeroUINativeProvider, useThemeColor } from "heroui-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { KeyboardProvider } from "react-native-keyboard-controller";

import { ThemeToggle } from "@/components/theme-toggle";
import { queryClient } from "@/utils/orpc";

export const unstable_settings = {
    anchor: "index",
};

function StackLayout() {
    const backgroundColor = useThemeColor("background");
    const foregroundColor = useThemeColor("foreground");

    return (
        <Stack
            screenOptions={{
                headerStyle: { backgroundColor },
                headerTintColor: foregroundColor,
                contentStyle: { backgroundColor },
                headerRight: () => <ThemeToggle />,
            }}
        >
            <Stack.Screen name="index" options={{ title: Constants.expoConfig?.name ?? "Home" }} />
        </Stack>
    );
}

export default function Layout() {
    return (
        <QueryClientProvider client={queryClient}>
            <GestureHandlerRootView style={{ flex: 1 }}>
                <KeyboardProvider>
                    <HeroUINativeProvider>
                        <StackLayout />
                    </HeroUINativeProvider>
                </KeyboardProvider>
            </GestureHandlerRootView>
        </QueryClientProvider>
    );
}
