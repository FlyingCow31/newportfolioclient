// This is the route that's used for the user to reset their password.

import { sql } from "@/app/lib/db"
import { redis } from "@/app/lib/redis"
import bcrypt from "bcryptjs"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import z from "zod"

const editSchema = z.object({
     username: z.string().min(1).max(100).nonempty(),
     oldPassword: z.string().min(1).max(100).nonempty(),
     password: z
          .string()
          .min(10)
          .max(255)
          .regex(/^(?=.*\d)(?=.*[^A-Za-z0-9]).+$/)
          .nonempty(),
     confirm: z
          .string()
          .min(10)
          .max(255)
          .regex(/^(?=.*\d)(?=.*[^A-Za-z0-9]).+$/)
          .nonempty(),
})

export async function POST(request: Request) {
     const result = editSchema.safeParse(await request.json())

     if (!result.success) {
          return NextResponse.json({ error: "Wrong Credentials" }, { status: 400 })
     }

     const { username, password, oldPassword, confirm } = result.data

     console.log(password)
     console.log("old password:", oldPassword)
     console.log("confirm", confirm)
     console.log("email:", username)

     const ip = request.headers.get("x-forwarded-for") ?? "unknown"
     const key = `login_attempts:${ip}`
     const attempts = (await redis.get<number>(key)) ?? 0

     if (attempts >= 5) {
          return NextResponse.json({ error: "Rate limited, try again in 15 minutes" }, { status: 429 })
     }

     if (password !== confirm) {
          await redis.set(key, attempts + 1, { ex: 60 * 15 })
          return NextResponse.json({ error: "Wrong Credentials" }, { status: 401 })
     }

     const users = await sql`SELECT * FROM utilisateur WHERE user_mail = ${username}`
     const user = users[0]

     const hash = user?.user_password ?? "$2b$10$WSNV9Om5ouu7yuF9gjfgB.TiXz3SAGi2Z.iBhPOpQ7npmZIvx1EcK"

     const passwordCheck = await bcrypt.compare(oldPassword, hash)

     if (!user || !passwordCheck) {
          await redis.set(key, attempts + 1, { ex: 60 * 15 })
          return NextResponse.json({ error: "Wrong Credentials" }, { status: 401 })
     }

     const newHash = await bcrypt.hash(password, 10)
     console.log(newHash)

     try {
          await sql`UPDATE utilisateur SET user_password = ${newHash} WHERE user_id = ${user.user_id}`
     } catch (err) {
          console.error(err)
          return NextResponse.json({ error: "Erreur avec la communication serveur." }, { status: 500 })
     }

     await redis.del(key)
     const response = NextResponse.json({ success: true, loggedOut: true })
     response.cookies.delete("token")
     return response
}
