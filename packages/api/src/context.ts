import type { Session } from "@full-stack-template/auth";
import type { Database } from "@full-stack-template/db";

export type Context = {
    session: Session | null;
    db: Database;
};
