import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { Button } from "heroui-native";
import { Platform } from "react-native";
import Animated, { FadeOut, ZoomIn } from "react-native-reanimated";
import { Uniwind, useUniwind, withUniwind } from "uniwind";

const StyledIonicons = withUniwind(Ionicons);

export function ThemeToggle() {
    const { theme } = useUniwind();
    const isLight = theme === "light";

    return (
        <Button
            variant="ghost"
            size="sm"
            isIconOnly
            accessibilityLabel={`Switch to ${isLight ? "dark" : "light"} theme`}
            onPress={() => {
                if (Platform.OS === "ios") {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                }
                Uniwind.setTheme(isLight ? "dark" : "light");
            }}
        >
            {isLight ? (
                <Animated.View key="moon" entering={ZoomIn} exiting={FadeOut}>
                    <StyledIonicons name="moon" size={20} className="text-foreground" />
                </Animated.View>
            ) : (
                <Animated.View key="sun" entering={ZoomIn} exiting={FadeOut}>
                    <StyledIonicons name="sunny" size={20} className="text-foreground" />
                </Animated.View>
            )}
        </Button>
    );
}
