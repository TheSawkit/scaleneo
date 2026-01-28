import { Badge } from "@/components/ui/badge";
import { FIELD_LABELS, SECTION_LABELS } from "@/utils/labels";

interface SectionCardProps {
  title: string;
  data: Record<string, string | number | null>;
}

export function SectionCard({ title, data }: SectionCardProps) {
  if (!data || Object.keys(data).length === 0) return null;

  const labels = FIELD_LABELS[title] || {};
  const sectionTitle = SECTION_LABELS[title] || title.toUpperCase();

  const orderedKeys = Object.keys(labels);
  const dataKeys = Object.keys(data);

  const presentKeys = orderedKeys.filter((k) => dataKeys.includes(k));
  const extraKeys = dataKeys.filter((k) => !orderedKeys.includes(k));

  const displayKeys = [...presentKeys, ...extraKeys];

  return (
    <div className="bg-card p-4 rounded-lg border border-border hover:border-primary/50 transition-colors shadow-sm">
      <h4 className="font-bold text-xs text-primary uppercase mb-3 pb-2 border-b border-border">
        {sectionTitle}
      </h4>
      <div className="space-y-2">
        {displayKeys.map((k) => {
          const value = data[k] as string;
          let content = (
            <span
              className="text-foreground text-right font-medium wrap-break-word text-wrap flex-1 ml-4 whitespace-pre-line"
              title={value}
            >
              {value}
            </span>
          );

          const hasParentheses = value && value.includes("(") && value.includes(")");
          if (hasParentheses) {
            const match = value.match(/(.*?)\s*\((.+)\)$/);
            if (match) {
              const label = match[1];
              const status = match[2];
              const isIMC = k === "imc";
              const isNRS = /^NRS\s+\d+(\.\d+)?\/10$/.test(status);

              if (isIMC || isNRS) {
                let variant: "green" | "yellow" | "red" | "neutral" = "neutral";

                const nrsMatch = status.match(/NRS\s+(\d+)/);
                if (nrsMatch) {
                  const n = parseInt(nrsMatch[1]);
                  if (n <= 3) variant = "green";
                  else if (n <= 6) variant = "yellow";
                  else variant = "red";
                } else if (["Normal", "Faible", "Nulle", "Douleur nulle", "Douleur faible"].includes(status)) {
                  variant = "green";
                } else if (["Surpoids", "Insuffisance", "Modérée", "Douleur modérée"].includes(status)) {
                  variant = "yellow";
                } else if (["Obésité", "Sévère", "Douleur sévère"].includes(status)) {
                  variant = "red";
                }

                content = (
                  <div className="flex items-center gap-2 justify-end flex-1 ml-4">
                    <span className="text-right">{label}</span>
                    <Badge variant={variant} className="text-[10px] h-5 w-14 text-nowrap justify-center">
                      {status}
                    </Badge>
                  </div>
                );
              }
            }
          }

          return (
            <div
              key={k}
              className="flex justify-between text-[11px] items-baseline"
            >
              <span className="text-muted-foreground font-medium mr-2 max-w-[50%]">
                {labels[k] || k}:
              </span>
              {content}
            </div>
          );
        })}
      </div>
    </div>
  );
}
