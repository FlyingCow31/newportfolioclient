import { AdminCheck } from "@/app/lib/auth/auth"
import { sql } from "@/app/lib/db"
import { revalidateTag } from "next/cache"
import { NextRequest, NextResponse } from "next/server"

export async function DELETE(request: NextRequest) {
     if (!AdminCheck(request)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

     const data = await request.json()
     const { avancee_id } = data.data

     if (!avancee_id) return NextResponse.json({ error: "No data to delete" }, { status: 400 })

     const result = await sql`DELETE FROM avancee WHERE avancee_id = ${avancee_id} RETURNING avancee_id, proj_id`
     if (result.length === 0) {
          return NextResponse.json({ error: "Avancee not found or was not deleted." }, { status: 404 })
     }
     const { proj_id } = result[0]
     revalidateTag("avancees", { expire: 0 })
     revalidateTag(`avancee-n${proj_id}`, { expire: 0 })

     return NextResponse.json({ success: true })
}
