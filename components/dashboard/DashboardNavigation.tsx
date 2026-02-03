"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { StableBold } from "@/components/ui/StableBold";

/**
 * DashboardNavigation Component
 *
 * Main navigation tabs for the SCALENEO dashboard.
 * Displays 4 tabs: Extraction, Results, Analytics, Export.
 *
 * Features:
 * - Active tab highlighting based on current route
 * - Responsive grid layout
 * - Hover states for inactive tabs
 */
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
      <div className="grid w-full max-w-2xl grid-cols-2 sm:grid-cols-4 h-auto p-1 bg-muted border shadow-sm rounded-lg">
        {tabs.map((tab) => {
          const isActive = pathname === tab.href;
          return (
            <Link
              key={tab.id}
              href={tab.href}
              className={cn(
                "group inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-3 text-sm font-medium border border-transparent ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
                isActive
                  ? "bg-background/80 backdrop-blur-md border-foreground/10 text-foreground shadow-md"
                  : "hover:bg-background/50 hover:backdrop-blur-md hover:border-foreground/10 hover:text-foreground hover:shadow-md text-muted-foreground",
              )}
            >
              <StableBold
                text={tab.name}
                hoverClassName={cn(
                  isActive ? "font-bold" : "group-hover:font-bold group-hover:text-foreground"
                )}
              />
            </Link>
          );
        })}
      </div>
    </div>
  );
}
