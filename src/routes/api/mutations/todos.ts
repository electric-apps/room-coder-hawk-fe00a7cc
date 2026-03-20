import { createFileRoute } from "@tanstack/react-router";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { todos } from "@/db/schema";
import { generateTxId, parseDates } from "@/db/utils";

export const Route = createFileRoute("/api/mutations/todos")({
	server: {
		handlers: {
			POST: async ({ request }) => {
				const body = parseDates(await request.json());
				const txid = await db.transaction(async (tx) => {
					await tx.insert(todos).values({
						id: body.id,
						text: body.text,
						completed: body.completed ?? false,
						created_at: body.created_at,
						updated_at: body.updated_at,
					});
					return generateTxId(tx);
				});
				return Response.json({ txid });
			},
			PUT: async ({ request }) => {
				const body = parseDates(await request.json());
				const txid = await db.transaction(async (tx) => {
					await tx
						.update(todos)
						.set({
							text: body.text,
							completed: body.completed,
							updated_at: body.updated_at ?? new Date(),
						})
						.where(eq(todos.id, body.id));
					return generateTxId(tx);
				});
				return Response.json({ txid });
			},
			DELETE: async ({ request }) => {
				const body = await request.json();
				const txid = await db.transaction(async (tx) => {
					await tx.delete(todos).where(eq(todos.id, body.id));
					return generateTxId(tx);
				});
				return Response.json({ txid });
			},
		},
	},
});
