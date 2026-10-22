import { NextResponse } from "next/server"
import z from "zod"
import jwt from "jsonwebtoken"
import { sql } from "@/app/lib/db"
import { redis } from "@/app/lib/redis"
import bcrypt from "bcryptjs"

const loginSchema = z.object({
     username: z.string().min(1).max(100).nonempty(),
     password: z.string().min(1).max(255).nonempty(),
})

export async function POST(request: Request) {
     // Zod checks if the request fullfills or not
     const result = loginSchema.safeParse(await request.json())

     if (!result.success) {
          return NextResponse.json({ error: "Wrong Credentials" }, { status: 400 })
     }

     const { username, password } = result.data

     const ip = request.headers.get("x-forwarded-for") ?? "unknown"
     const key = `login_attempts:${ip}`
     /* const attempts = (await redis.get<number>(key)) ?? 0 */

     /* if (attempts >= 5) {
          return NextResponse.json({ error: "Rate limited, try again in 15 minutes" }, { status: 429 })
     } */

     const users = await sql`SELECT * FROM utilisateur WHERE user_mail = ${username}`
     const user = users[0]
     // Use of fake hash to prevent scanning to know if a user exists or not (cybersecurity thing)
     const hash = user?.user_password ?? "$2b$10$WSNV9Om5ouu7yuF9gjfgB.TiXz3SAGi2Z.iBhPOpQ7npmZIvx1EcK"

     const passwordCheck = await bcrypt.compare(password, hash)
     console.log("login debug:", {
          username,
          found: !!user,
          hashStart: user?.user_password?.slice(0, 7),
          passwordCheck,
     })
     if (!user || !passwordCheck) {
          // Increase the rate limiting by one
          /* await redis.set(key, attempts + 1, { ex: 60 * 15 }) */
          return NextResponse.json({ error: "Wrong Credentials" }, { status: 401 })
     }

     // Everything's good from there

     const role = user.user_role
     console.log(role)
     const client_id = user.client_id
     const token = jwt.sign({ id: user.id, username, role, client_id }, process.env.JWT_SECRET!, { expiresIn: "24h" })

     const response = NextResponse.json({ success: true, role })
     response.cookies.set("token", token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          maxAge: 60 * 60 * 24,
     })

     /* await redis.del(key) */
     return response
}
