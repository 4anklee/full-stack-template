import { createAuth } from "@full-stack-template/auth";
import { createDb } from "@full-stack-template/db";

import { ENV } from "./env.server";

export const db = createDb(ENV);
export const auth = createAuth(ENV, db);
