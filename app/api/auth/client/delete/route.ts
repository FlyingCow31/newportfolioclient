import { AdminCheck } from "@/app/lib/auth/auth"
import { sql } from "@/app/lib/db"
import { updateTag } from "next/cache"
import { NextRequest, NextResponse } from "next/server"

export async function DELETE(request: NextRequest) {
     if (!AdminCheck(request)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

     const data = await request.json()
     const { client_id } = data.data

     if (!client_id) return NextResponse.json({ error: "No data to delete" }, { status: 400 })
     console.log(client_id)
     const result = await sql`DELETE FROM client WHERE client_id = ${client_id} RETURNING client_id`
     if (result.length === 0) {
          return NextResponse.json({ error: "Client not found or was not deleted." }, { status: 404 })
     }
     updateTag("clients")

     return NextResponse.json({ success: true })
}
