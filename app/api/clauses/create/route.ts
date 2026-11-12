import { AdminCheck } from "@/app/lib/auth/auth"
import { sql } from "@/app/lib/db"
import { revalidateTag } from "next/cache"
import { NextRequest, NextResponse } from "next/server"
import z from "zod"

const clauseSchema = z.object({
     clause_key: z.string().min(1).max(110),
     clause_text: z.string().min(1).max(1024),
})

export async function POST(request: NextRequest) {
     if (!AdminCheck(request)) return NextResponse.json({ error: "Forbidden" }, { status: 403 })

     const result = clauseSchema.safeParse(await request.json())
     if (!result.success) {
          const messages = result.error.issues.map((issue) => issue.message).join(" ")
          return NextResponse.json({ error: messages }, { status: 400 })
     }

     const { clause_key, clause_text } = result.data

     const insert =
          await sql`INSERT INTO clause (clause_key, clause_text) VALUES (${clause_key}, ${clause_text}) RETURNING clause_id`
     if (!insert[0].clause_id) return NextResponse.json({ error: "Server Error" }, { status: 500 })

     revalidateTag("clauses", { expire: 0 })

     return NextResponse.json({ success: true })
}
