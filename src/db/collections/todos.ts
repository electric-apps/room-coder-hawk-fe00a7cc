import { createCollection } from "@tanstack/db";
import { electricCollectionOptions } from "@tanstack/electric-db-collection";
import { type Todo, todoSelectSchema } from "@/db/zod-schemas";

const origin =
	typeof window !== "undefined"
		? window.location.origin
		: "http://localhost:8080";

export const todosCollection = createCollection(
	electricCollectionOptions({
		id: "todos",
		schema: todoSelectSchema,
		getKey: (todo: Todo) => todo.id,
		shapeOptions: {
			url: `${origin}/api/todos`,
		},
		onInsert: async ({ transaction }) => {
			const todo = transaction.mutations[0].modified;
			const res = await fetch("/api/mutations/todos", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(todo),
			});
			const data = await res.json();
			return { txid: data.txid };
		},
		onUpdate: async ({ transaction }) => {
			const todo = transaction.mutations[0].modified;
			const res = await fetch("/api/mutations/todos", {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(todo),
			});
			const data = await res.json();
			return { txid: data.txid };
		},
		onDelete: async ({ transaction }) => {
			const id = transaction.mutations[0].original.id;
			const res = await fetch("/api/mutations/todos", {
				method: "DELETE",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ id }),
			});
			const data = await res.json();
			return { txid: data.txid };
		},
	}),
);
