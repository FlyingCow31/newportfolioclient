import { cacheLife, cacheTag } from "next/cache"
import { sql } from "./db"
import { Avancee } from "./types"

// For the two of them, it returns arrays because we need all of them, so they're gonna be in a .map anyway
export async function getProjects() {
     "use cache"
     cacheLife("days")
     cacheTag("projects")

     return await sql`SELECT * FROM projet ORDER BY proj_deadline ASC`
}

export async function getClients() {
     "use cache"
     cacheLife("days")
     cacheTag("clients")

     return await sql`SELECT * FROM client ORDER BY client_created_at ASC`
}

export async function getAvancees() {
     "use cache"
     cacheLife("hours")
     cacheTag("avancees")

     return (await sql`SELECT * FROM avancee ORDER BY proj_id ASC`) as Avancee[]
}

// but for this one, we need only one project (because it's in a /page/[id] format) so I need to return only the first element (SQL returns array)
export async function getProject(proj_id: number) {
     "use cache"
     cacheLife("days")
     cacheTag(`project` + `Project n${proj_id}`)

     const projects = await sql`SELECT * FROM projet WHERE proj_id = ${proj_id}`

     return projects[0]
}
