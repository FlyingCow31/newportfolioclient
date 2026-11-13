import { AdminCheck } from "@/app/lib/auth/auth"
import { sql } from "@/app/lib/db"
import { revalidateTag } from "next/cache"
import { NextRequest, NextResponse } from "next/server"

export async function DELETE(request: NextRequest) {
     if (!AdminCheck(request)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

     const data = await request.json()
     const { clause_id } = data.data
     if (!clause_id) return NextResponse.json({ error: "No data to delete" }, { status: 400 })

     const result = await sql`DELETE FROM clause WHERE clause_id = ${clause_id} RETURNING clause_id`
     if (result.length === 0) {
          return NextResponse.json({ error: "Clause not found or was not deleted." }, { status: 404 })
     }

     revalidateTag("clauses", { expire: 0 })

     return NextResponse.json({ success: true })
}
