import { cn } from "@/lib/utils";

interface StableBoldProps {
    text: string;
    className?: string;
    hoverClassName?: string;
}

/**
 * StableBold Component
 * Helper to prevent layout shift when text becomes bold on hover.
 */
export function StableBold({
    text,
    className,
    hoverClassName
}: StableBoldProps) {
    return (
        <div className={cn("inline-grid grid-cols-1 grid-rows-1", className)}>
            <span className="invisible col-start-1 row-start-1 font-extrabold" aria-hidden="true">
                {text}
            </span>
            <span className={cn("col-start-1 row-start-1 transition-all", hoverClassName)}>
                {text}
            </span>
        </div>
    );
}
