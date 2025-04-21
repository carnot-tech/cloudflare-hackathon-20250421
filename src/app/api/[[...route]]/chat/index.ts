import { openai } from "@ai-sdk/openai";
import {
	createDataStreamResponse,
	streamText,
	experimental_createMCPClient as createMCPClient,
	tool,
	smoothStream,
} from "ai";
import { Experimental_StdioMCPTransport as StdioMCPTransport } from "ai/mcp-stdio";
import { OpenAPIHono, z } from "@hono/zod-openapi";

const playwrightMcpClient = createMCPClient({
	transport: {
		type: "sse",
		url: process.env.PLAYWRIGHT_MCP_URL as string,
	},
});

const exaAiMcpClient = createMCPClient({
	transport: new StdioMCPTransport({
		command: "npx",
		args: ["exa-mcp-server"],
		env: {
			EXA_API_KEY: process.env.EXA_API_KEY as string,
		},
	}),
});


const app = new OpenAPIHono().post("/", async (c) => {
	const { messages } = await c.req.json();
	if (!messages) {
		return c.json({ error: "No messages provided" }, 400);
	}

	const playwrightClient = await playwrightMcpClient;
	const playwrightTools = await playwrightClient.tools();
	const exaClient = await exaAiMcpClient;
	const exaTools = await exaClient.tools();

	return createDataStreamResponse({
		execute: (dataStream) => {
			const result = streamText({
				model: openai("gpt-4.1"),
				system: `
				You are a professional test automation expert specializing in Playwright.
				Your primary responsibilities:
				1. Execute automated tests using Playwright Tools according to user instructions
				2. Report test results concisely
				3. Give brief technical explanations

				For non-Playwright questions, keep responses short and professional.
				All responses must be in English.

				Important:
				- Keep all responses under 500 characters for voice output
				- Use Playwright tools efficiently
				- Give short, clear feedback
				- Focus on key technical points only
				- Avoid lengthy explanations
				- If you need to use the internet, use the browser tool. This tool makes you to access the internet.
				`,
				messages,
				tools: {
					...playwrightTools,
					...exaTools,
					sendSmsByTwilio,
				},
				maxSteps: 5,
				toolChoice: "auto",
				experimental_transform: smoothStream({
					chunking: "word",
					delayInMs: 15,
				}),
			});

			result.mergeIntoDataStream(dataStream, {
				sendReasoning: true,
			});
		},
		onError: (error) => {
			// Error messages are masked by default for security reasons.
			// If you want to expose the error message to the client, you can do so here:
			return error instanceof Error ? error.message : String(error);
		},
	});
});


const sendSmsByTwilio = tool({
	description: "Send an SMS message using Twilio",
	parameters: z.object({
		message: z.string(),
	}),
	execute: async ({ message }) => {
		const accountSid = process.env.TWILIO_ACCOUNT_SID;
		const authToken = process.env.TWILIO_AUTH_TOKEN;
		const toNumber = "+18777804236";
		const fromNumber = "+18554820504";

		if (!accountSid || !authToken) {
			throw new Error("Twilio credentials not properly configured");
		}

		const response = await fetch(
			`https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`,
			{
				method: "POST",
				headers: {
					"Content-Type": "application/x-www-form-urlencoded",
					Authorization: `Basic ${Buffer.from(`${accountSid}:${authToken}`).toString("base64")}`,
				},
				body: new URLSearchParams({
					To: toNumber,
					From: fromNumber,
					Body: message,
				}),
			},
		);

		if (!response.ok) {
			throw new Error(`Failed to send SMS: ${response.statusText}`);
		}

		const result = await response.json();
		return {
			sid: result.sid,
			status: result.status,
		};
	},
});

export default app;