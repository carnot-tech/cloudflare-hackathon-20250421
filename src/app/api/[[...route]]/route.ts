import { handle } from "hono/vercel";
import { cors } from "hono/cors";
import { OpenAPIHono } from "@hono/zod-openapi";

import chat from "./chat";

const app = new OpenAPIHono()
	.basePath("/api")
	.use("*", cors())
	.route("/chat", chat);

export const GET = handle(app);
export const POST = handle(app);
export const PUT = handle(app);
export const DELETE = handle(app);

export type AppType = typeof app;
