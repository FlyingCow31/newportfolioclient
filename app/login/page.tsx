"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"

export default function Page() {
     const [username, setUsername] = useState("")
     const [password, setPassword] = useState("")
     const [error, setError] = useState("")
     const router = useRouter()

     const handleSubmit = async (e: React.SubmitEvent) => {
          e.preventDefault()
          const response = await fetch("/api/auth/login", {
               method: "POST",
               headers: { "Content-Type": "application/json" },
               body: JSON.stringify({ username, password }),
          })

          if (response.ok) {
               const data = await response.json()
               console.log(data.role || "Rien")
               // redirection when validating first thing
               if (data.role === "admin") {
                    router.push("/")
               } else {
                    router.push("/client")
               }

               console.log("Logged In!")
          } else {
               const data = await response.json()
               console.error(data.error)
               setError("Mauvais Identifiant ou mot de passe.")
          }
     }

     return (
          <div className={"bg-bg min-h-screen flex items-center justify-center "}>
               <div className={"bg-white md:w-fit h-fit p-6 shadow-big border-3 w-[95%]"}>
                    <form onSubmit={handleSubmit}>
                         <h1 className={"font-title text-xl font-black mb-3"}>Connexion au suivi de commande</h1>
                         <label className={"text-lg font-semibold"}>Identifiants</label> <br />
                         <input
                              type={"text"}
                              className={`border-2 ${error ? "border-red-500" : ""} w-full p-1 shadow-[2px_2px_0px_0px]`}
                              value={username}
                              onChange={(e) => setUsername(e.target.value)}
                              required
                         />
                         <p className={"opacity-40 italic text-sm mt-1 mb-6"}>
                              Vos identifiants vous ont étés envoyés par mail à la signature du devis.
                         </p>
                         <label className={"text-lg font-semibold"}>Mot de passe</label>
                         <input
                              type={"password"}
                              className={`border-2 ${error ? "border-red-500" : ""} w-full p-1 shadow-[2px_2px_0px_0px]`}
                              value={password}
                              onChange={(e) => {
                                   setPassword(e.target.value)
                                   setError("")
                              }}
                              required
                         />
                         <p className={"opacity-40 italic text-sm mt-1"}>
                              Votre mot de passe a été envoyé dans le même mail.
                         </p>
                         <button
                              type={"submit"}
                              className={"bg-main border-3 border-black shadow-small text-white px-3 py-1 mt-3"}
                         >
                              Se connecter
                         </button>
                         <p className={"text-red-500 text-sm italic mt-3"}>{error}</p>
                    </form>
                    <div className={"border-l-3 border-sec mt-6 pl-3"}>
                         <h2 className={"teext-lg font-semibold"}>&#34;Je n&#39;ai pas reçu mes identifiants&#34;</h2>
                         <p>
                              Si vous n&#39;avez pas reçu vos identifiants, contactez{" "}
                              <a href={"mailto:contact@gaeltournier.dev"}>
                                   <span className={"underline decoration-2 decoration-sec underline-offset-3"}>
                                        contact@gaeltournier.dev
                                   </span>
                              </a>
                              .
                         </p>
                    </div>
               </div>
          </div>
     )
}
