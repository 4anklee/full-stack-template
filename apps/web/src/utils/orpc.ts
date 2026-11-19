import { toast } from "@heroui/react";
import { createORPCClient } from "@orpc/client";
import { RPCLink } from "@orpc/client/fetch";
import { createTanstackQueryUtils } from "@orpc/tanstack-query";
import { QueryCache, QueryClient } from "@tanstack/react-query";

import type { AppRouterClient } from "@full-stack-template/api/routers/index";

import { ENV } from "../env";

export function createQueryClient() {
    return new QueryClient({
        queryCache: new QueryCache({
            onError: (error, query) => {
                toast.danger(`Error: ${error.message}`, {
                    actionProps: {
                        children: "Retry",
                        onPress: () => {
                            query.invalidate();
                        },
                    },
                });
            },
        }),
        defaultOptions: { queries: { staleTime: 60 * 1000 } },
    });
}

function getServerUrl(url: string) {
    const processEnv = typeof process === "undefined" ? undefined : process.env;
    if (typeof window === "undefined" && processEnv?.SERVER_URL) {
        return processEnv.SERVER_URL.endsWith("/")
            ? processEnv.SERVER_URL.slice(0, -1)
            : processEnv.SERVER_URL;
    }

    return url.endsWith("/") ? url.slice(0, -1) : url;
}

const link = new RPCLink({
    url: `${getServerUrl(ENV.VITE_SERVER_URL)}/rpc`,
    fetch(url, options) {
        return fetch(url, {
            ...options,
            credentials: "include",
        });
    },
});

export const client: AppRouterClient = createORPCClient(link);

export const orpc = createTanstackQueryUtils(client);
