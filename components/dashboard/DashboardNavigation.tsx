"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export function DashboardNavigation() {
  const pathname = usePathname();

  const tabs = [
    { name: "📋 Extraction", href: "/extraction", id: "extraction" },
    { name: "📊 Résultats", href: "/results", id: "results" },
    { name: "📈 Analytics", href: "/analytics", id: "analytics" },
    { name: "💾 Export", href: "/export", id: "export" },
  ];

  return (
    <div className="flex justify-center w-full">
      <div className="grid w-full max-w-2xl grid-cols-4 h-auto p-1 bg-muted border shadow-sm rounded-lg">
        {tabs.map((tab) => {
          const isActive = pathname === tab.href;
          return (
            <Link
              key={tab.id}
              href={tab.href}
              className={cn(
                "inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-3 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
                isActive
                  ? "bg-background text-foreground shadow-sm"
                  : "hover:bg-background/50 hover:text-foreground text-muted-foreground",
              )}
            >
              {tab.name}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
