import { AdminCheck } from "@/app/lib/auth/auth"
import { sql } from "@/app/lib/db"
import { revalidateTag } from "next/cache"
import { NextRequest, NextResponse } from "next/server"
import z from "zod"

const invoiceSchema = z.object({
     proj_id: z.string().min(1),
     facture_num: z.string().min(1).max(20),
     facture_mont: z.string().regex(/^\d+$/),
     facture_temps: z.string().regex(/^\d*$/).optional(),
     facture_date: z.string(),
     facture_pay_deadline: z.string(),
     facture_lien: z.string().max(1000).url().or(z.literal("")).optional(),
})

export async function POST(request: NextRequest) {
     if (!AdminCheck(request)) return NextResponse.json({ error: "Forbiden" }, { status: 403 })

     const result = invoiceSchema.safeParse(await request.json())
     if (!result.success) {
          const messages = result.error.issues.map((issue) => issue.message).join(" ")
          return NextResponse.json({ error: messages }, { status: 400 })
     }

     const { proj_id, facture_num, facture_mont, facture_temps, facture_date, facture_pay_deadline, facture_lien } =
          result.data
     const newProj_id = Number(proj_id)
     const newDate = new Date(facture_date)
     const newDeadline = new Date(facture_pay_deadline)
     const newLink = facture_lien ?? null
     const newMont = Number(facture_mont) * 100

     let newTemps = Number(facture_temps) ?? null
     if (facture_temps) {
          newTemps = Number(facture_temps) * 60
     }

     const insert =
          await sql`INSERT INTO facture (proj_id, facture_num, facture_mont, facture_lien, facture_date, facture_pay_deadline, facture_temps ) VALUES (${newProj_id}, ${facture_num}, ${newMont}, ${newLink}, ${newDate}, ${newDeadline}, ${newTemps}) RETURNING facture_id`

     if (!insert[0].facture_id) return NextResponse.json({ error: "Server Error" }, { status: 500 })

     revalidateTag("invoices", { expire: 0 })

     return NextResponse.json({ success: true })
}
