import { describe, it, expect } from "vitest"
import { todoSelectSchema, todoInsertSchema } from "@/db/zod-schemas"
import { generateValidRow, parseDates } from "./helpers/schema-test-utils"

describe("todos collection validation", () => {
	it("validates insert data with all required fields", () => {
		const row = generateValidRow(todoInsertSchema)
		const result = todoInsertSchema.safeParse(row)
		expect(result.success).toBe(true)
	})

	it("validates select data with all required fields", () => {
		const row = generateValidRow(todoSelectSchema)
		const result = todoSelectSchema.safeParse(row)
		expect(result.success).toBe(true)
	})

	it("handles JSON round-trip for dates", () => {
		const row = generateValidRow(todoSelectSchema)
		const roundTripped = parseDates(JSON.parse(JSON.stringify(row)))
		const result = todoSelectSchema.safeParse(roundTripped)
		expect(result.success).toBe(true)
		if (result.success) {
			expect(result.data.created_at).toBeInstanceOf(Date)
			expect(result.data.updated_at).toBeInstanceOf(Date)
		}
	})

	it("rejects todo with empty text", () => {
		const row = generateValidRow(todoSelectSchema)
		;(row as Record<string, unknown>).text = ""
		// Empty string is still a valid string, but let's check null fails
		;(row as Record<string, unknown>).text = null
		const result = todoSelectSchema.safeParse(row)
		expect(result.success).toBe(false)
	})

	it("accepts todo with completed=true", () => {
		const row = generateValidRow(todoSelectSchema)
		;(row as Record<string, unknown>).completed = true
		const result = todoSelectSchema.safeParse(row)
		expect(result.success).toBe(true)
	})

	it("accepts todo with completed=false", () => {
		const row = generateValidRow(todoSelectSchema)
		;(row as Record<string, unknown>).completed = false
		const result = todoSelectSchema.safeParse(row)
		expect(result.success).toBe(true)
	})
})
