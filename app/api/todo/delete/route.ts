import { AdminCheck } from "@/app/lib/auth/auth"
import { sql } from "@/app/lib/db"
import { revalidateTag } from "next/cache"
import { NextRequest, NextResponse } from "next/server"

export async function DELETE(request: NextRequest) {
     if (!AdminCheck(request)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

     const data = await request.json()
     const { todo_id } = data.data
     if (!todo_id) return NextResponse.json({ error: "No data to delete" }, { status: 400 })

     const result = await sql`DELETE FROM todo WHERE todo_id = ${todo_id} RETURNING todo_id`
     if (result.length === 0) {
          return NextResponse.json({ error: "Project not found or was not deleted." }, { status: 404 })
     }
     revalidateTag("todos", { expire: 0 })

     return NextResponse.json({ success: true })
}
