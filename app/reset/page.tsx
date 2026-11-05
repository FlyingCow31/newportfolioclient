"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"

export default function Page() {
     const [username, setUsername] = useState("")
     const [oldPassword, setOldPassword] = useState("")
     const [confirm, setConfirme] = useState("")
     const [password, setPassword] = useState("")

     const [error, setError] = useState("")

     const [char, setChar] = useState(false)
     const [num, setNum] = useState(false)
     const [special, setSpecial] = useState(false)
     const [same, setSame] = useState(false)

     const router = useRouter()

     function checkPassword(password: string) {
          if (password.length > 10 && /[A-Za-z]/.test(password)) {
               setChar(true)
          } else setChar(false)
          if (/[0-9]/.test(password)) {
               setNum(true)
          } else setNum(false)
          if (/[!@#$%^&*(),.?":{}|<>[\]\\/'`~;+=_-]/.test(password)) {
               setSpecial(true)
          } else setSpecial(false)

          if (password.trim() !== confirm.trim()) {
               setSame(false)
          } else setSame(true)

          if (!char || !num || !special) return false
          else return true
     }

     function checkSame(confirmation: string) {
          if (password.trim() === confirmation.trim()) {
               setSame(true)
               return true
          } else return false
     }
     const handleSubmit = async (e: React.SubmitEvent) => {
          e.preventDefault()

          console.log(password || "rien")
          console.log(confirm || "rien")
          console.log("same?", same)

          if (checkPassword(password) && checkSame(confirm)) {
               const trimPassword = password.trim()
               const trimConfirm = confirm.trim()
               console.log(password || "rien")
               console.log(confirm || "rien")
               const response = await fetch("/api/auth/user/modify", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ username, oldPassword, password: trimPassword, confirm: trimConfirm }),
               })

               if (response.ok) {
                    router.push("/login")
               } else {
                    const data = await response.json()
                    console.error(data.error)
                    setError(data.error[0])
               }
          } else {
               setError("Votre nouveau mot de passe ne respecte pas les conditions.")
          }
     }

     return (
          <div className={"bg-bg min-h-screen flex items-center justify-center "}>
               <div className={"bg-white md:w-fit h-fit p-6 shadow-big border-3 w-[95%]"}>
                    <form onSubmit={handleSubmit}>
                         <h1 className={"font-title text-xl font-black mb-3"}>Création d'un nouveau mot de passe</h1>
                         <label className={"text-lg font-semibold"}>Email</label> <br />
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
                              value={oldPassword}
                              onChange={(e) => {
                                   setOldPassword(e.target.value)
                                   setError("")
                              }}
                              required
                         />
                         <p className={"opacity-40 italic text-sm mt-1 mb-6"}>
                              Votre mot de passe a été envoyé dans le même mail.
                         </p>
                         <label className={"text-lg font-semibold"}>Nouveau mot de passe</label>
                         <input
                              type={"password"}
                              className={`border-2 ${error ? "border-red-500" : ""} w-full p-1 shadow-[2px_2px_0px_0px]`}
                              value={password}
                              onChange={(e) => {
                                   setPassword(e.target.value)
                                   checkPassword(e.target.value)
                              }}
                              required
                         />
                         <div className="my-3">
                              <p className={`${char ? "bg-green-300" : "bg-red-300"} px-2 py-1 rounded-lg`}>
                                   {char ? "Contient" : "Doit contenir"} au moins 10 charactères.
                              </p>
                              <p className={`${num ? "bg-green-300" : "bg-red-300"} px-2 py-1 rounded-lg my-1`}>
                                   {num ? "Contient" : "Doit contenir"} au moins 1 chiffre.
                              </p>
                              <p className={`${special ? "bg-green-300" : "bg-red-300"} px-2 py-1 rounded-lg`}>
                                   {special ? "Contient" : "Doit contenir"} au moins 1 symbole.
                              </p>
                         </div>
                         <label className={"text-lg font-semibold"}>Confirmez le mot de passe</label>
                         <input
                              type={"password"}
                              className={`border-2 ${error ? "border-red-500" : ""} w-full p-1 shadow-[2px_2px_0px_0px]`}
                              value={confirm}
                              onChange={(e) => {
                                   setConfirme(e.target.value)
                                   checkSame(e.target.value)
                              }}
                              required
                         />
                         <p className={`${same ? "bg-green-300" : "bg-red-300"} px-2 py-1 rounded-lg`}>
                              {same
                                   ? "Les mots de passe sont identiques!"
                                   : "Les mots de passe doivent être identiques."}
                              .
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
                         <h2 className={"teext-lg font-semibold"}>&#34;Je n'arrive pas à me connecter&#34;</h2>
                         <p>
                              Si vous avez un problème, contactez
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
