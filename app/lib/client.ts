import { AuthUser } from "./auth"
import { sql } from "./db"

export async function GetClient() {
     const user = await AuthUser()
     if (!user) return null

     const clients = await sql`SELECT client_nom, client_pren FROM client WHERE client_id = ${user.client_id}`
     const project = await sql`SELECT * FROM projet WHERE client_id = ${user.client_id}`

     const client = clients[0]
     const projet = project[0]

     return { client: client ?? null, projet: projet ?? null }
}
