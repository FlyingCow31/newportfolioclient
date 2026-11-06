import jwt from "jsonwebtoken"
import { redirect } from "next/navigation"
import { cookies } from "next/headers"
import { connection, NextRequest } from "next/server"
if (!process.env.JWT_SECRET && process.env.NODE_ENV === "production") {
     throw new Error("JWT_SECRET is not defined in production")
}

// check if admin
export function AdminCheck(request: NextRequest): boolean {
     const token = request.cookies.get("token")?.value
     if (!token) return false

     try {
          const decoded = jwt.verify(token, process.env.JWT_SECRET!) as unknown as { role: string }
          return decoded.role === "admin"
     } catch {
          return false
     }
}

// auth the user and returns its basic infos
export async function AuthUser() {
     await connection()
     const token = (await cookies()).get("token")?.value
     if (!token) return null

     try {
          return jwt.verify(token, process.env.JWT_SECRET!) as unknown as {
               id: number
               role: string
               client_id: number
          }
     } catch {
          return null
     }
}

export async function CheckRedirect() {
     const user = await AuthUser()

     if (!user) {
          redirect("/login")
     }
     if (user.role !== "admin") {
          redirect("/client")
     }
     return user
}
