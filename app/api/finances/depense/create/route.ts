import { AdminCheck } from "@/app/lib/auth/auth"
import { sql } from "@/app/lib/db"
import { revalidateTag } from "next/cache"
import { NextRequest, NextResponse } from "next/server"
import z from "zod"

const expenseSchema = z.object({
     depense_label: z.string().min(1).max(255),
     depense_categorie: z.enum(["Outils", "Matériel", "Client refacturé", "Formation", "Autre"]),
     depense_mont: z.string().regex(/^\d+$/),
     depense_date: z.string().date(),
     proj_id: z.string().optional(),
})

export async function POST(request: NextRequest) {
     if (!AdminCheck(request)) return NextResponse.json({ error: "Forbidden" }, { status: 403 })

     const result = expenseSchema.safeParse(await request.json())
     if (!result.success) {
          const messages = result.error.issues.map((issue) => issue.message).join(" ")
          return NextResponse.json({ error: messages }, { status: 400 })
     }

     const { depense_label, depense_categorie, depense_date, depense_mont, proj_id } = result.data
     const newProj_id = Number(proj_id)
     const mont = Number(depense_mont) * 100
     const date = new Date(depense_date)

     const insert =
          await sql`INSERT INTO depense (proj_id, depense_label, depense_categorie, depense_mont, depense_date) VALUES (${newProj_id}, ${depense_label}, ${depense_categorie}, ${mont}, ${date}) RETURNING depense_id`
     if (!insert[0].depense_id) return NextResponse.json({ error: "Server error" }, { status: 500 })

     revalidateTag("invoices", { expire: 0 })

     return NextResponse.json({ success: true })
}
