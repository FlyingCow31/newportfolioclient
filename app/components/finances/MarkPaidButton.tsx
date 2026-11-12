"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export default function MarkPaidButton({ factureId }: { factureId: number }) {
     const router = useRouter()
     const [pending, setPending] = useState(false)

     async function markPaid() {
          setPending(true)
          const res = await fetch(`/api/finances/facture/pay`, {
               method: "PATCH",
               headers: { "Content-Type": "application/json" },
               body: JSON.stringify({
                    facture_id: factureId,
                    facture_paid_at: new Date().toISOString().slice(0, 10),
               }),
          })
          setPending(false)
          if (res.ok) router.refresh()
     }

     return (
          <button
               type="button"
               onClick={markPaid}
               disabled={pending}
               className="btn btn-sm min-h-9 flex-none bg-colsol px-2.5 text-caption shadow-none disabled:opacity-50"
          >
               {pending ? "…" : "Marquer payée"}
          </button>
     )
}
