import { AdminCheck } from "@/app/lib/auth/auth"
import { sql } from "@/app/lib/db"
import { revalidateTag } from "next/cache"
import { NextRequest, NextResponse } from "next/server"
import z from "zod"

const modifySchema = z.object({
     avancee_id: z.number().int().positive(),
     statut: z.enum(["termine", "en_cours", "attente_client", "planifie"]),
     titre: z.string().trim().min(1, "Le titre est obligatoire.").max(110, "Le titre est trop long."),
     message: z.string().trim().max(5000, "Le message est trop long."),
     date: z.iso.date("Date invalide."),
})

export async function PATCH(request: NextRequest) {
     if (!AdminCheck(request)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

     const body = await request.json().catch(() => null)
     const result = modifySchema.safeParse(body)

     if (!result.success) {
          const messages = result.error.issues.map((issue) => issue.message).join(" ")
          return NextResponse.json({ error: messages }, { status: 400 })
     }

     const { avancee_id, statut, titre, message, date } = result.data

     const updated = await sql`
          UPDATE avancee
          SET avancee_statut = ${statut},
              avancee_titre = ${titre},
              avancee_message = ${message || null},
              avancee_date = ${date}
          WHERE avancee_id = ${avancee_id}
          RETURNING proj_id`

     if (updated.length === 0) return NextResponse.json({ error: "Avancée introuvable." }, { status: 404 })

     const { proj_id } = updated[0]
     revalidateTag(`avancee-n${proj_id}`, { expire: 0 })
     revalidateTag(`project-n${proj_id}`, { expire: 0 })
     revalidateTag("projets", { expire: 0 })

     return NextResponse.json({ success: true })
}
