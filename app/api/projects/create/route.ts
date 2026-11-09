import { AdminCheck } from "@/app/lib/auth/auth"
import { sql } from "@/app/lib/db"
import { revalidateTag } from "next/cache"
import { NextRequest, NextResponse } from "next/server"
import z from "zod"

// this file creates the project

const projectSchema = z.object({
     clientId: z.number().nonoptional(),
     projectName: z.string().min(1).max(255).nonempty(),
     deadline: z.string().optional().nullable(),
     type: z.string().nonempty(),
     price: z.number().nonoptional(),
     infos: z
          .array(
               z.object({
                    id: z.number().nonoptional(),
                    cle: z.string().optional(),
                    valeur: z.string().optional(),
               }),
          )
          .optional(),
})

export async function POST(request: NextRequest) {
     if (!AdminCheck(request)) return NextResponse.json({ error: "Forbidden" }, { status: 403 })

     const result = projectSchema.safeParse(await request.json())

     if (!result.success) {
          const messages = result.error.issues.map((issue) => issue.message).join(" ")
          return NextResponse.json({ error: messages }, { status: 400 })
     }

     // format the date string to Date again
     const deadline = result.data.deadline ? new Date(result.data.deadline) : null
     if (deadline && Number.isNaN(deadline.getTime())) {
          return NextResponse.json({ error: "Invalid deadline" }, { status: 400 })
     }

     const { clientId, projectName, type, price, infos } = result.data
     const newPrice = price * 100
     const projectInfo = infos ? JSON.stringify(infos) : null

     const client = await sql`SELECT client_nom FROM client WHERE client_id = ${clientId}`
     if (!client[0]) return NextResponse.json({ error: "No client found" }, { status: 400 })

     const insert =
          await sql`INSERT INTO projet (client_id, proj_nom, proj_type, proj_deadline, proj_prix, proj_info) VALUES (${clientId}, ${projectName}, ${type}, ${deadline}, ${newPrice}, ${projectInfo}) RETURNING proj_id`
     if (!insert[0]) return NextResponse.json({ error: "Server Error" }, { status: 500 })

     const proj_id = insert[0].proj_id
     revalidateTag("projets", "days")
     revalidateTag(`project-n${proj_id}`, "days")
     return NextResponse.json({ success: true, proj_id })
}
