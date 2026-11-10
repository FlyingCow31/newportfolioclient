import { AdminCheck } from "@/app/lib/auth/auth"
import { sql } from "@/app/lib/db"
import { revalidateTag } from "next/cache"
import { NextRequest, NextResponse } from "next/server"

export async function PATCH(request: NextRequest) {
     if (!AdminCheck(request)) return NextResponse.json({ error: "Forbidden" }, { status: 403 })

     const data = await request.json()

     const { proj_id, date } = data.data
     const newProj_id = Number(proj_id)
     const newDate = new Date(date)

     const edit =
          await sql`UPDATE projet SET proj_done_at = ${newDate} WHERE proj_id = ${newProj_id} RETURNING proj_done_at`

     if (!edit[0].proj_done_at) return NextResponse.json({ error: "Server problem" }, { status: 400 })

     revalidateTag("projets", "days")
     revalidateTag(`project-n${newProj_id}`, "days")
     return NextResponse.json({ success: true })
}
