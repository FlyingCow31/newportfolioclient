import { AdminCheck } from "@/app/lib/auth/auth"
import { sql } from "@/app/lib/db"
import { revalidateTag } from "next/cache"
import { NextRequest, NextResponse } from "next/server"
import z from "zod"

const todoUpdatesSchema = z.object({
     updates: z
          .array(
               z.object({
                    todo_id: z.number().int().positive(),
                    todo_done: z.boolean(),
               }),
          )
          .min(1)
          .refine((updates) => new Set(updates.map((update) => update.todo_id)).size === updates.length, {
               message: "Todo IDs must be unique",
          }),
})

export async function PATCH(request: NextRequest) {
     if (!AdminCheck(request)) return NextResponse.json({ error: "Forbidden" }, { status: 403 })

     const result = todoUpdatesSchema.safeParse(await request.json())
     if (!result.success) {
          const messages = result.error.issues.map((issue) => issue.message).join(" ")
          return NextResponse.json({ error: messages }, { status: 400 })
     }

     const [summary] = await sql`
          WITH input AS (
               SELECT *
               FROM jsonb_to_recordset(${JSON.stringify(result.data.updates)}::jsonb)
                    AS item(todo_id integer, todo_done boolean)
          ),
          missing AS (
               SELECT input.todo_id
               FROM input
               LEFT JOIN todo ON todo.todo_id = input.todo_id
               WHERE todo.todo_id IS NULL
          ),
          updated AS (
               UPDATE todo
               SET todo_done = input.todo_done
               FROM input
               WHERE todo.todo_id = input.todo_id
                 AND NOT EXISTS (SELECT 1 FROM missing)
               RETURNING todo.todo_id
          )
          SELECT
               (SELECT COUNT(*)::int FROM missing) AS missing_count,
               (SELECT COUNT(*)::int FROM updated) AS updated_count
     `

     if (summary.missing_count > 0) {
          return NextResponse.json({ error: "One or more todos were not found" }, { status: 404 })
     }

     revalidateTag("todos", { expire: 0 })

     return NextResponse.json({ success: true, updated: summary.updated_count })
}
