import { AdminCheck } from "@/app/lib/auth/auth"
import { sql } from "@/app/lib/db"
import { revalidateTag } from "next/cache"
import { NextRequest, NextResponse } from "next/server"
import z from "zod"

const todoSchema = z.object({
     proj_id: z.string().optional(),
     todo_title: z.string().min(1).max(255).nonempty(),
     todo_done: z.boolean().nonoptional(),
     todo_due: z.string().optional(),
})

export async function POST(request: NextRequest) {
     if (!AdminCheck(request)) return NextResponse.json({ error: "Forbidden" }, { status: 403 })

     const result = todoSchema.safeParse(await request.json())
     if (!result.success) {
          const messages = result.error.issues.map((issue) => issue.message).join(" ")
          return NextResponse.json({ error: messages }, { status: 400 })
     }
     const { proj_id, todo_title, todo_done, todo_due } = result.data
     const newProj_id = proj_id ? Number(proj_id) : null
     const newDate = todo_due ? new Date(todo_due) : null

     const insert =
          await sql`INSERT INTO todo (proj_id, todo_title, todo_done, todo_due) VALUES (${newProj_id}, ${todo_title},${todo_done}, ${newDate}) RETURNING todo_id`

     const todo_id = insert[0].todo_id
     if (!todo_id) return NextResponse.json({ error: "Error with DB deletion" }, { status: 500 })
     revalidateTag("todos", { expire: 0 })

     return NextResponse.json({ success: true, todo_id })
}
