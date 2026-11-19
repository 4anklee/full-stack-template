import { createGetUrl } from "fumadocs-core/source";

import project from "@repo/config/project.json";

export const appName = project.name;
export const docsRoute = "/docs";
export const docsImageRoute = "/og/docs";

export const gitConfig = {
    user: project.repository.owner,
    repo: project.repository.name,
    branch: project.repository.branch,
};

const getImageUrl = createGetUrl(docsImageRoute);

export function getPageImageUrl(page: { slugs: string[]; locale?: string }) {
    const segments = [...page.slugs, "image.webp"];

    return { segments, url: getImageUrl(segments, page.locale) };
}
