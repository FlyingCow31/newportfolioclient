"use client";

import { usePathname } from "next/navigation";
import NavList from "./NavList";

export default function NavLinks() {
  const pathname = usePathname();
  return <NavList pathname={pathname} />;
}
