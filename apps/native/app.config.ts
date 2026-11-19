import type { ConfigContext, ExpoConfig } from "expo/config";

import project from "@repo/config/project.json";

export default function appConfig({ config }: ConfigContext): ExpoConfig {
    return {
        ...config,
        name: project.name,
        slug: project.slug,
        scheme: project.mobile.scheme,
        ios: {
            ...config.ios,
            bundleIdentifier: project.mobile.iosBundleIdentifier,
        },
        android: {
            ...config.android,
            package: project.mobile.androidPackage,
        },
    };
}
