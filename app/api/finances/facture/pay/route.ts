import { AdminCheck } from "@/app/lib/auth/auth"
import { sql } from "@/app/lib/db"
import { revalidateTag } from "next/cache"
import { NextRequest } from "next/server"
import { NextResponse } from "next/server"
import z from "zod"

const invoicePaymentSchema = z.object({
     facture_id: z.number().int().positive(),
     facture_paid_at: z.string().date(),
})

export async function PATCH(request: NextRequest) {
     if (!AdminCheck(request)) return NextResponse.json({ error: "Forbidden" }, { status: 403 })

     const result = invoicePaymentSchema.safeParse(await request.json())
     if (!result.success) {
          const messages = result.error.issues.map((issue) => issue.message).join(" ")
          return NextResponse.json({ error: messages }, { status: 400 })
     }

     const { facture_id, facture_paid_at } = result.data
     const paidAt = new Date(facture_paid_at)
     const [updatedInvoice] =
          await sql`UPDATE facture SET facture_paid_at = ${paidAt} WHERE facture_id = ${facture_id} RETURNING facture_id`

     if (!updatedInvoice) return NextResponse.json({ error: "Invoice not found" }, { status: 404 })

     revalidateTag("invoices", { expire: 0 })

     return NextResponse.json({ success: true })
}
