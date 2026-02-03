import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FIELD_LABELS, SECTION_LABELS } from "@/utils/labels";
import { CheckCircle2, XCircle } from "lucide-react";

interface SectionCardProps {
  sectionKey: string;
  data: Record<string, string | number | boolean | null | undefined>;
}

/**
 * Mapping from section keys (section1, section2...) to semantic keys (admin, anthropo...)
 * Used to retrieve correct labels from FIELD_LABELS and SECTION_LABELS
 */
const SECTION_KEY_MAPPING: Record<string, keyof typeof FIELD_LABELS> = {
  section1: "admin",
  section2: "anthropo",
  section3: "pathologie",
  section4: "symptomes",
  section5: "mecanismes",
  section6: "tests",
  section7: "scores",
  section8: "redFlags",
  section9: "mecanismesResume",
  section10: "gestion",
  section11: "perspectives",
  section12: "pronostic",
  section13: "activites",
  section14: "facteurs",
  section15: "satisfaction",
  section16: "observations",
  section17: "hypothese",
  section18: "qualite",
};

/**
 * SectionCard Component
 *
 * Displays a patient data section with labeled fields and formatted values.
 *
 * Features:
 * - Smart field ordering based on predefined labels
 * - NRS (pain scale) badge display alongside parent fields
 * - Boolean values displayed as YES/NO badges
 * - IMC (BMI) with colored status indicators
 * - Automatic unit appending for weight, height, age
 * - Composite value handling (e.g., "Oui | details text")
 *
 * @param sectionKey - Section identifier (e.g., "section1", "section2")
 * @param data - Key-value pairs of patient data for this section
 */
export function SectionCard({ sectionKey, data }: SectionCardProps) {
  if (!data || Object.keys(data).length === 0) return null;

  const semanticKey = SECTION_KEY_MAPPING[sectionKey];
  const sectionTitle = semanticKey ? SECTION_LABELS[semanticKey] : sectionKey.toUpperCase();
  const fieldLabels = FIELD_LABELS[sectionKey] || {};

  const orderedKeys = Object.keys(fieldLabels);
  const dataKeys = Object.keys(data);
  const presentKeys = orderedKeys.filter((k) => dataKeys.includes(k));

  const extraKeys = dataKeys.filter((k) => !orderedKeys.includes(k));
  const displayKeys = [...presentKeys, ...extraKeys];

  return (
    <Card className="mb-4 border border-border shadow-sm hover:border-primary">
      <CardHeader className="bg-muted/30 py-3 px-4 border-b border-border">
        <CardTitle className="text-sm font-bold text-primary uppercase tracking-wide">
          {sectionTitle}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 space-y-3">
        {displayKeys.map((key) => {
          const rawValue = data[key];

          if (key.endsWith("Nrs") && displayKeys.includes(key.replace("Nrs", ""))) {
            return null;
          }

          const label = fieldLabels[key] || key;

          const nrsKey = `${key}Nrs`;
          let nrsValue = null;
          if (dataKeys.includes(nrsKey)) {
            nrsValue = data[nrsKey];
          }

          let displayValue = rawValue;

          if (nrsValue !== null && typeof rawValue === 'string') {
            displayValue = rawValue.replace(/\|?\s*\(NRS\s*0-10\)\s*:\s*\d+/gi, "").trim();
            displayValue = displayValue.replace(/\|\s*$/, "").trim();
          }

          return (
            <div key={key} className="flex justify-between items-start text-sm group hover:border-primary hover:border-b-2 hover:border-t-2"> {/* TODO: Enlever le hover */}
              <span className="text-muted-foreground font-medium mr-4 min-w-[40%]">
                {label}
              </span>
              <div className="text-right font-medium text-foreground flex-1 flex justify-end items-center gap-2 flex-wrap">
                {renderValue(key, displayValue)}

                {nrsValue !== null && nrsValue !== undefined && (
                  <div className="ml-1">
                    {renderValue(nrsKey, nrsValue)}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}

/**
 * Renders a formatted value based on its type and field key
 *
 * Handles special rendering for:
 * - Booleans and "Oui/Non" strings → YES/NO badges
 * - NRS pain scales → colored badges (green < 4, yellow 4-6, red >= 7)
 * - IMC (BMI) → value with status badge
 * - Weight, height, age → appends units (kg, cm, ans)
 * - Composite values (e.g., "Oui | text") → badge + text
 *
 * @param key - Field identifier
 * @param value - Field value to render
 * @returns Formatted JSX element
 */
function renderValue(key: string, value: string | number | boolean | null | undefined) {
  if (value === null ||
    value === undefined ||
    value === "" ||
    (typeof value === 'string' && (value.toLowerCase().includes("à remplir") || value.trim().toUpperCase() === "N/A"))) {
    return <span className="text-muted-foreground/50 italic text-xs">N/A</span>;
  }

  const isTrueString = typeof value === "string" && (value.toLowerCase() === "oui" || value.toLowerCase() === "yes");
  const isFalseString = typeof value === "string" && (value.toLowerCase() === "non" || value.toLowerCase() === "no");

  const isBinaryOne = value === 1 || value === "1";
  const isBinaryZero = value === 0 || value === "0";

  const compositeMatch = typeof value === "string" ? value.match(/^(Oui|Non)\s*\|\s*(.*)$/i) : null;

  if (typeof value === "boolean" || isTrueString || isFalseString || compositeMatch || isBinaryOne || isBinaryZero) {
    const isTrue = value === true || isTrueString || isBinaryOne || (compositeMatch && compositeMatch[1].toLowerCase() === "oui");

    const extraText = compositeMatch ? compositeMatch[2] : null;

    if (isTrue) {
      return (
        <div className="flex flex-col gap-1 items-end">
          <Badge variant="green" className="gap-1 pr-2">
            <CheckCircle2 className="w-3 h-3" />
            OUI
          </Badge>
          {extraText && <span className="text-sm whitespace-pre-line wrap-break-word">{extraText}</span>}
        </div>
      );
    }
    if (compositeMatch) {
      return (
        <div className="flex flex-col gap-1 items-end">
          <Badge variant="red" className="gap-1 pr-2">
            <XCircle className="w-3 h-3" />
            NON
          </Badge>
          {extraText && <span className="text-sm whitespace-pre-line wrap-break-word">{extraText}</span>}
        </div>
      );
    }

    return (
      <span className="flex flex-col gap-1 items-end">
        <Badge variant="red" className="gap-1 pr-2">
          <XCircle className="w-3 h-3" />
          NON
        </Badge>
      </span>
    );
  }

  const strValue = String(value);
  const numValue = typeof value === "number" ? value : parseFloat(strValue);

  if (key === "poids" && !isNaN(numValue) && !strValue.toLowerCase().includes("kg")) {
    return <span className="font-medium">{numValue} kg</span>;
  }
  if (key === "taille" && !isNaN(numValue) && !strValue.toLowerCase().includes("cm")) {
    return <span className="font-medium">{numValue} cm</span>;
  }
  if (key === "age" && !isNaN(numValue) && !strValue.toLowerCase().includes("ans")) {
    return <span className="font-medium">{numValue} ans</span>;
  }

  if (key === "imc" && !isNaN(numValue)) {
    let variant: "green" | "yellow" | "red" | "neutral" = "green";
    let statusText = "NORMAL";

    if (numValue < 18.5) {
      variant = "yellow";
      statusText = "MAIGREUR";
    } else if (numValue >= 25 && numValue < 30) {
      variant = "yellow";
      statusText = "SURPOIDS";
    } else if (numValue >= 30) {
      variant = "red";
      statusText = "OBÉSITÉ";
    }

    return (
      <div className="flex items-center gap-2">
        <span>{numValue.toFixed(1)}</span>
        <Badge variant={variant} className="pointer-events-none">
          {statusText}
        </Badge>
      </div>
    );
  }

  if ((key.toLowerCase().includes("nrs") || key.endsWith("Nrs")) && !isNaN(numValue)) {
    let variant: "green" | "yellow" | "red" = "green";

    if (numValue >= 0 && numValue <= 10) {
      if (numValue >= 4 && numValue < 7) {
        variant = "yellow";
      } else if (numValue >= 7) {
        variant = "red";
      }

      return (
        <Badge variant={variant} className="font-bold min-w-8 justify-center">
          NRS {numValue}/10
        </Badge>
      );
    }
  }

  return <span className="whitespace-pre-line wrap-break-word">{strValue}</span>;
}
