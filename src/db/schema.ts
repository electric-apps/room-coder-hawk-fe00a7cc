import { boolean, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const todos = pgTable("todos", {
	id: uuid().primaryKey().defaultRandom(),
	text: text().notNull(),
	completed: boolean().notNull().default(false),
	created_at: timestamp({ withTimezone: true }).notNull().defaultNow(),
	updated_at: timestamp({ withTimezone: true }).notNull().defaultNow(),
});
