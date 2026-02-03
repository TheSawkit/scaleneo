/**
 * ExportButton Component
 *
 * Displays a button for exporting patient data in a specific format.
 * Used in the export page to provide CSV, XLSX, and JSON export options.
 */

import { Button } from "@/components/ui/button";
import { LucideIcon } from "lucide-react";

interface ExportButtonProps {
    format: "csv" | "xlsx" | "json";
    icon: LucideIcon;
    title: string;
    description: string;
    onClick: () => void;
    disabled?: boolean;
}

/**
 * Renders an export button with icon, title, and description
 */
export function ExportButton({
    icon: Icon,
    title,
    description,
    onClick,
    disabled = false,
}: ExportButtonProps) {
    return (
        <Button
            type="button"
            onClick={onClick}
            variant="outline"
            className="h-auto flex flex-col items-center gap-3 py-6"
            disabled={disabled}
        >
            <Icon className="h-8 w-8" />
            <div className="flex flex-col items-center">
                <span className="font-semibold">{title}</span>
                <span className="text-xs text-muted-foreground">{description}</span>
            </div>
        </Button>
    );
}
