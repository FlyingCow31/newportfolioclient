import { AdminCheck } from "@/app/lib/auth/auth"
import { GeneratePassword } from "@/app/lib/auth/generatePassword"
import { sql } from "@/app/lib/db"
import ResetMail from "@/app/lib/mails/reset"
import { Client } from "@/app/lib/types"
import bcrypt from "bcryptjs"
import { revalidateTag, updateTag } from "next/cache"
import { NextRequest, NextResponse } from "next/server"
import z from "zod"

// create client -> return client_id -> pass it to user -> create user with random generated password -> send mail
// This gets called when creating a user OR a project. In the case of the /project page, you must first run this so it returns the client_id to link the project, before actually creating the project.
const clientSchema = z.object({
     client_nom: z.string().min(1).max(50).nonempty(),
     client_pren: z.string().min(1).max(50).nonempty(),
     client_add: z.string().min(1).max(255).optional(),
     client_notes: z.string().min(1).max(255).optional(),
     client_siret: z.preprocess(
          (value) => (value === "" || value === null ? undefined : String(value)),
          z
               .string()
               .regex(/^[1-9]\d{13}$/, "Le SIRET doit contenir 14 chiffres.")
               .transform(Number)
               .optional(),
     ),
     client_tel: z.preprocess(
          (value) => (value === "" || value === null ? undefined : value),
          z.coerce.number().optional(),
     ),
     client_bus: z.string().min(1).max(50).optional(),
     client_contact_mail: z.string().min(1).max(100).nonempty(),
})

function getErrorMessage(error: unknown): string {
     return error instanceof Error ? error.message : "Une erreur est survenue."
}

export async function POST(request: NextRequest) {
     const isAdmin = AdminCheck(request)
     if (!isAdmin) return NextResponse.json({ error: "Forbidden" }, { status: 403 })

     const result = clientSchema.safeParse(await request.json())
     if (!result.success) {
          const messages = result.error.issues.map((issue) => issue.message).join(" ")
          return NextResponse.json({ error: messages }, { status: 400 })
     }
     const {
          client_nom,
          client_pren,
          client_add,
          client_notes,
          client_siret,
          client_tel,
          client_bus,
          client_contact_mail,
     } = result.data

     const phone = client_tel ?? null
     const add = client_add ?? null
     const siret = client_siret ?? null
     const notes = client_notes ?? null
     const business = client_bus ?? null

     try {
          const clients =
               (await sql`SELECT * FROM client WHERE client_contact_mail = ${client_contact_mail}`) as Client[]
          const client = clients[0] as Client
          if (client) {
               const user = await sql`SELECT * FROM utilisateur WHERE client_id = ${client.client_id}`

               if (user[0]) {
                    return NextResponse.json({ status: 200 })
               }

               // * If no user, proceed to creating it
               const user_password = GeneratePassword()
               const hashed = await bcrypt.hash(user_password, 10)

               const client_id = client.client_id
               const mail = client_contact_mail
               const [createdUser] =
                    await sql`INSERT INTO utilisateur (user_mail, client_id, user_password, user_role) VALUES (${mail}, ${client_id}, ${hashed}, ${"client"} ) RETURNING client_id, user_mail`

               if (!createdUser) return NextResponse.json({ status: 500 })

               await ResetMail({
                    prenom: client.client_pren,
                    email: createdUser.user_mail,
                    password: user_password,
               })

               return NextResponse.json({ status: 201, client_id })
          }

          // due to the DB restrictions, if there's no client, there's no user

          try {
               const user_password = GeneratePassword()
               const hashed = await bcrypt.hash(user_password, 10)

               const [created] = await sql`
                    WITH new_client AS (
                         INSERT INTO client (
                              client_nom,
                              client_pren,
                              client_add,
                              client_notes,
                              client_siret,
                              client_tel,
                              client_bus,
                              client_contact_mail
                         )
                         VALUES (
                              ${client_nom},
                              ${client_pren},
                              ${add},
                              ${notes},
                              ${siret},
                              ${phone},
                              ${business},
                              ${client_contact_mail}
                         )
                         RETURNING client_id, client_pren
                    ),
                    new_user AS (
                         INSERT INTO utilisateur (
                              user_mail,
                              client_id,
                              user_password,
                              user_role
                         )
                         SELECT
                              ${client_contact_mail},
                              client_id,
                              ${hashed},
                              ${"client"}
                         FROM new_client
                         RETURNING user_id, user_mail, client_id, user_role
                    )
                    SELECT new_user.*, new_client.client_pren
                    FROM new_user
                    JOIN new_client ON new_client.client_id = new_user.client_id
                    `

               if (!created) return NextResponse.json({ error: "Client/User was not created" }, { status: 500 })
               const client_id = created.client_id

               await ResetMail({
                    prenom: created.client_pren,
                    email: created.user_mail,
                    password: user_password,
               })

               revalidateTag("clients", "days")
               return NextResponse.json({ success: true, client_id })
          } catch (err) {
               return NextResponse.json({ error: getErrorMessage(err) }, { status: 500 })
          }
     } catch (err) {
          return NextResponse.json({ error: getErrorMessage(err) }, { status: 500 })
     }
}
