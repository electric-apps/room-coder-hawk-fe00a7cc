import { createFileRoute } from "@tanstack/react-router";
import { eq } from "drizzle-orm";
import { z } from "zod/v4";
import { db } from "@/db";
import { todos } from "@/db/schema";
import { generateTxId, parseDates } from "@/db/utils";

const insertBodySchema = z.object({
	id: z.string().uuid(),
	text: z.string().min(1),
	completed: z.boolean().optional(),
	created_at: z.union([z.date(), z.string()]).optional(),
	updated_at: z.union([z.date(), z.string()]).optional(),
});

const updateBodySchema = z.object({
	id: z.string().uuid(),
	text: z.string().min(1).optional(),
	completed: z.boolean().optional(),
	updated_at: z.union([z.date(), z.string()]).optional(),
});

const deleteBodySchema = z.object({
	id: z.string().uuid(),
});

export const Route = createFileRoute("/api/mutations/todos")({
	server: {
		handlers: {
			POST: async ({ request }) => {
				const raw = parseDates(await request.json());
				const parsed = insertBodySchema.safeParse(raw);
				if (!parsed.success) {
					return Response.json({ error: "Invalid request body" }, { status: 400 });
				}
				const body = parsed.data;
				const txid = await db.transaction(async (tx) => {
					await tx.insert(todos).values({
						id: body.id,
						text: body.text,
						completed: body.completed ?? false,
						created_at: body.created_at ? new Date(body.created_at) : new Date(),
						updated_at: body.updated_at ? new Date(body.updated_at) : new Date(),
					});
					return generateTxId(tx);
				});
				return Response.json({ txid });
			},
			PUT: async ({ request }) => {
				const raw = parseDates(await request.json());
				const parsed = updateBodySchema.safeParse(raw);
				if (!parsed.success) {
					return Response.json({ error: "Invalid request body" }, { status: 400 });
				}
				const body = parsed.data;
				const txid = await db.transaction(async (tx) => {
					await tx
						.update(todos)
						.set({
							text: body.text,
							completed: body.completed,
							updated_at: body.updated_at ? new Date(body.updated_at) : new Date(),
						})
						.where(eq(todos.id, body.id));
					return generateTxId(tx);
				});
				return Response.json({ txid });
			},
			DELETE: async ({ request }) => {
				const raw = await request.json();
				const parsed = deleteBodySchema.safeParse(raw);
				if (!parsed.success) {
					return Response.json({ error: "Invalid request body" }, { status: 400 });
				}
				const txid = await db.transaction(async (tx) => {
					await tx.delete(todos).where(eq(todos.id, parsed.data.id));
					return generateTxId(tx);
				});
				return Response.json({ txid });
			},
		},
	},
});
