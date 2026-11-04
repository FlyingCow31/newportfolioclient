import { cacheLife, cacheTag } from "next/cache"
import { sql } from "./db"
import { Avancee, Client, Depense, Invoice, Projet, Todo } from "./types"

// * Get all ([])
// For the two of them, it returns arrays because we need all of them, so they're gonna be in a .map anyway
export async function getProjects(): Promise<Projet[]> {
     "use cache"
     cacheLife("days")
     cacheTag("projects")

     return (await sql`SELECT * FROM projet ORDER BY proj_deadline ASC`) as Projet[]
}

export async function getClients(): Promise<Client[]> {
     "use cache"
     cacheLife("days")
     cacheTag("clients")

     return (await sql`SELECT * FROM client ORDER BY client_created_at ASC`) as Client[]
}

export async function getAvancees(): Promise<Avancee[]> {
     "use cache"
     cacheLife("hours")
     cacheTag("avancees")

     return (await sql`SELECT * FROM avancee ORDER BY proj_id ASC`) as Avancee[]
}

export async function getTodos(): Promise<Todo[]> {
     "use cache"
     cacheLife("days")
     cacheTag("todos")

     return (await sql`SELECT * FROM todo ORDER BY proj_id ASC`) as Todo[]
}

export async function getInvoices(): Promise<Invoice[]> {
     "use cache"
     cacheLife("max")
     cacheTag("invoices")
     return (await sql`SELECT * FROM facture ORDER BY facture_date ASC`) as Invoice[]
}

export async function getDepenses(): Promise<Depense[]> {
     "use cache"
     cacheLife("max")
     cacheTag("invoices")
     return (await sql`SELECT * FROM depense ORDER BY depense_date DESC`) as Depense[]
}

// * Get only one
// but for this one, we need only one project (because it's in a /page/[id] format) so I need to return only the first element (SQL returns array)
export async function getProject(proj_id: number): Promise<Projet | undefined> {
     "use cache"
     cacheLife("days")
     cacheTag(`project-n${proj_id}`)

     const projects = (await sql`SELECT * FROM projet WHERE proj_id = ${proj_id}`) as Projet[]

     return projects[0]
}
export async function getAvancee(proj_id: number): Promise<Avancee[]> {
     "use cache"
     cacheLife("days")
     cacheTag(`projet-n${proj_id}`)
     const avancees = await sql`SELECT * FROM avancee WHERE proj_id = ${proj_id}`

     return avancees as Avancee[]
}
export async function getClient(client_id: number): Promise<Client> {
     "use cache"
     cacheLife("days")
     cacheTag(`client-n${client_id}`)

     const client = (await sql`SELECT * FROM client WHERE client_id = ${client_id}`) as Client[]

     return client[0] as Client
}
