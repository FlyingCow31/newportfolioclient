import { Suspense } from "react"
import Link from "next/link"
import NavLinks from "../components/NavLinks"
import NavList from "../components/NavList"

export default function PanelLayout({ children }: { children: React.ReactNode }) {
     return (
          <div className="mx-auto flex max-w-340 flex-col gap-6 px-4 py-5 sm:px-6 lg:flex-row lg:items-start lg:gap-7 lg:py-7">
               <aside className="flex flex-col gap-2 border-3 border-ink bg-white p-3 shadow-brutal lg:sticky lg:top-7 lg:w-55 lg:shrink-0 lg:gap-1 lg:p-4">
                    <div className="flex items-center justify-between px-3 lg:pb-3">
                         <Link href="/" className="font-display text-h3 text-ink no-underline">
                              PANEL.
                         </Link>
                         <button type="button" className="muted text-sm font-medium lg:hidden">
                              Se déconnecter
                         </button>
                    </div>
                    <Suspense fallback={<NavList />}>
                         <NavLinks />
                    </Suspense>
                    <hr className="my-3 hidden border-0 border-t-2 border-ink lg:block" />
                    <button type="button" className="nav-link muted hidden font-medium lg:flex">
                         Se déconnecter
                    </button>
               </aside>
               <main className="flex min-w-0 flex-1 flex-col gap-6 lg:gap-7">{children}</main>
          </div>
     )
}
