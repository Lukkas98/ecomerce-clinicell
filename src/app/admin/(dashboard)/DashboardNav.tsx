"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Route } from "next";

function Icon({ name }: { name: "grid" | "plus" | "tag" | "card" }) {
  const common = {
    width: 21,
    height: 21,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
  };

  if (name === "plus") {
    return (
      <svg {...common}>
        <path d="M12 5v14M5 12h14" />
      </svg>
    );
  }
  if (name === "tag") {
    return (
      <svg {...common}>
        <path d="m20 13-7 7-9-9V4h7l9 9Z" />
        <circle cx="7.5" cy="7.5" r="1" />
      </svg>
    );
  }
  if (name === "card") {
    return (
      <svg {...common}>
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="M3 10h18M7 15h3" />
      </svg>
    );
  }
  return (
    <svg {...common}>
      <rect x="4" y="4" width="6" height="6" rx="1" />
      <rect x="14" y="4" width="6" height="6" rx="1" />
      <rect x="4" y="14" width="6" height="6" rx="1" />
      <rect x="14" y="14" width="6" height="6" rx="1" />
    </svg>
  );
}

const links: Array<{
  href: string;
  label: string;
  icon: "grid" | "plus" | "tag" | "card";
  create?: boolean;
}> = [
  { href: "/admin/products", label: "Productos", icon: "grid" as const },
  { href: "/admin/categories", label: "Categorías", icon: "tag" as const },
  { href: "/admin/payments", label: "Pagos", icon: "card" as const },
  {
    href: "/admin/create",
    label: "Crear",
    icon: "plus" as const,
    create: true,
  },
];

export default function DashboardNav() {
  const pathname = usePathname();

  return (
    <nav className="dashboard-nav" aria-label="Navegación principal">
      {links.map((link) => {
        const active = pathname.startsWith(link.href);
        return (
          <Link
            className={`dashboard-nav-link ${active ? "active" : ""}${link.create ? "create" : ""}`}
            href={link.href as Route}
            key={link.href}
          >
            <Icon name={link.icon} />
            <span>{link.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
