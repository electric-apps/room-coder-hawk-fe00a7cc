import { describe, it, expect } from "vitest"
import { todoSelectSchema, todoInsertSchema } from "@/db/zod-schemas"
import { todos } from "@/db/schema"
import { generateValidRow, generateRowWithout } from "./helpers/schema-test-utils"

describe("todos schema", () => {
	it("validates a valid todo row", () => {
		const row = generateValidRow(todoSelectSchema)
		const result = todoSelectSchema.safeParse(row)
		expect(result.success).toBe(true)
	})

	it("rejects a todo missing id", () => {
		const row = generateRowWithout(todoSelectSchema, "id")
		const result = todoSelectSchema.safeParse(row)
		expect(result.success).toBe(false)
	})

	it("rejects a todo missing text", () => {
		const row = generateRowWithout(todoSelectSchema, "text")
		const result = todoSelectSchema.safeParse(row)
		expect(result.success).toBe(false)
	})

	it("rejects a todo missing completed", () => {
		const row = generateRowWithout(todoSelectSchema, "completed")
		const result = todoSelectSchema.safeParse(row)
		expect(result.success).toBe(false)
	})

	it("validates insert schema with valid data", () => {
		const row = generateValidRow(todoInsertSchema)
		const result = todoInsertSchema.safeParse(row)
		expect(result.success).toBe(true)
	})

	it("parses date strings into Date objects", () => {
		const row = generateValidRow(todoSelectSchema)
		;(row as Record<string, unknown>).created_at = new Date().toISOString()
		;(row as Record<string, unknown>).updated_at = new Date().toISOString()
		const result = todoSelectSchema.safeParse(row)
		expect(result.success).toBe(true)
		if (result.success) {
			expect(result.data.created_at).toBeInstanceOf(Date)
			expect(result.data.updated_at).toBeInstanceOf(Date)
		}
	})
})
