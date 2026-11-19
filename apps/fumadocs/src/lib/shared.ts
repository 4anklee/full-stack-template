import { createGetUrl } from "fumadocs-core/source";

export const appName = "Full Stack Template";
export const docsRoute = "/docs";
export const docsImageRoute = "/og/docs";

export const gitConfig = {
    user: "4anklee",
    repo: "full-stack-template",
    branch: "main",
};

const getImageUrl = createGetUrl(docsImageRoute);

export function getPageImageUrl(page: { slugs: string[]; locale?: string }) {
    const segments = [...page.slugs, "image.webp"];

    return { segments, url: getImageUrl(segments, page.locale) };
}
