import Link from "next/link"

const links = [
     { href: "/", label: "Accueil" },
     { href: "/projets", label: "Projets", count: 4 },
     { href: "/clients", label: "Clients" },
     { href: "/todo", label: "Todo", count: 5 },
     { href: "/finances", label: "Finances" },
     { href: "/administration", label: "Administration" },
     { href: "/monitoring", label: "Monitoring", count: 1, alert: true },
]

// TODO: update count with project & todo & monitoring n°
export default function NavList({ pathname }: { pathname?: string }) {
     return (
          <nav
               aria-label="Navigation principale"
               className="-mx-1 flex gap-1 overflow-x-auto px-1 pb-1 lg:mx-0 lg:flex-col lg:overflow-visible lg:px-0 lg:pb-0"
          >
               {links.map((link) => {
                    const active =
                         pathname !== undefined &&
                         (link.href === "/" ? pathname === "/" : pathname.startsWith(link.href))
                    return (
                         <Link
                              key={link.href}
                              href={link.href}
                              aria-current={active ? "page" : undefined}
                              className="nav-link shrink-0"
                         >
                              {link.label}
                              {link.count !== undefined && (
                                   <span className={link.alert ? "count count-alert" : "count"}>{link.count}</span>
                              )}
                         </Link>
                    )
               })}
          </nav>
     )
}
