"use client";

import React from "react";
import Link from "next/link";
import { ROUTES } from "@/constants/routes";

interface Props {
  isActive: (path: string) => string;
}

const NavbarMenu: React.FC<Props> = ({ isActive }) => {
  const menuItems = [
    { href: ROUTES.MENU, label: "Menú" },
    { href: ROUTES.RESERVAS, label: "Reservas" },
    { href: ROUTES.NOSOTROS, label: "Nosotros" },
  ];

  return (
    <nav className="hidden md:flex items-center gap-8">
      {menuItems.map((item) => (
        <Link key={item.href} href={item.href} className={isActive(item.href)}>
          {item.label}
        </Link>
      ))}
    </nav>
  );
};

export default NavbarMenu;
