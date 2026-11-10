import { AdminCheck } from "@/app/lib/auth/auth"
import { sql } from "@/app/lib/db"
import { revalidateTag } from "next/cache"
import { NextRequest, NextResponse } from "next/server"
import z from "zod"

// this file creates the avancée within the project

const projectSchema = z.object({
     proj_id: z.string().nonoptional(),
     etape: z.string().min(1).max(255).nonempty(),
     statut: z.string().nonempty(),
     deadline: z.string().nonempty().nullable(),
     titre: z.string().nonempty(),
     message: z.string().optional(),
     visible: z.boolean().nullable(),
})

export async function POST(request: NextRequest) {
     if (!AdminCheck(request)) return NextResponse.json({ error: "Forbidden" }, { status: 403 })
     const formData = await request.formData()
     const result = projectSchema.safeParse({
          proj_id: formData.get("proj_id"),
          etape: formData.get("etape"),
          statut: formData.get("statut"),
          deadline: formData.get("deadline") || null,
          titre: formData.get("titre"),
          message: formData.get("message") || null,
          visible: formData.get("visible") === "true",
     })

     if (!result.success) {
          const messages = result.error.issues.map((issue) => issue.message).join(" ")
          return NextResponse.json({ error: messages }, { status: 400 })
     }

     // format the date string to Date again
     const deadline = result.data.deadline ? new Date(result.data.deadline) : null
     if (deadline && Number.isNaN(deadline.getTime())) {
          return NextResponse.json({ error: "Invalid deadline" }, { status: 400 })
     }

     const { proj_id, etape, statut, titre, message, visible } = result.data
     const newProj_id = Number(proj_id)

     const projet = await sql`SELECT proj_id FROM projet WHERE proj_id = ${newProj_id}`
     if (!projet[0]) return NextResponse.json({ error: "No project found" }, { status: 400 })

     // TODO: add the document ID when document logic is done.
     const insert =
          await sql`INSERT INTO avancee (proj_id, avancee_etape, avancee_statut, avancee_titre, avancee_message, avancee_date ) VALUES (${newProj_id}, ${etape}, ${statut}, ${titre}, ${message}, ${deadline}) RETURNING avancee_id`
     if (!insert[0]) return NextResponse.json({ error: "Server Error" }, { status: 500 })

     const av_id = insert[0].avancee_id
     revalidateTag("avancees", "hours")
     revalidateTag(`project-n${newProj_id}`, "days")
     revalidateTag("projets", "days")
     return NextResponse.json({ success: true, av_id })
}
