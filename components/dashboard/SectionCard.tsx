import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FIELD_LABELS, SECTION_LABELS } from "@/utils/labels";
import { CheckCircle2, XCircle } from "lucide-react";

interface SectionCardProps {
  sectionKey: string; // ex: "section1", "section2"
  data: Record<string, string | number | boolean | null | undefined>;
}

// Mapping pour retrouver la clé sémantique (ex: 'admin') depuis la clé de section (ex: 'section1')
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

export function SectionCard({ sectionKey, data }: SectionCardProps) {
  // 1. Vérification de sécurité
  if (!data || Object.keys(data).length === 0) return null;

  // 2. Récupération des labels corrects
  const semanticKey = SECTION_KEY_MAPPING[sectionKey];
  const sectionTitle = semanticKey ? SECTION_LABELS[semanticKey] : sectionKey.toUpperCase();
  // CORRECTION: FIELD_LABELS utilise les clés de section (section1, section2...), pas les clés sémantiques
  const fieldLabels = FIELD_LABELS[sectionKey] || {};

  // 3. Filtrage des clés à afficher (celles définies dans les labels + les extras non vides)
  const orderedKeys = Object.keys(fieldLabels);
  const dataKeys = Object.keys(data);
  const presentKeys = orderedKeys.filter((k) => dataKeys.includes(k));

  // On ajoute les clés qui sont dans les données mais pas dans les labels (au cas où)
  const extraKeys = dataKeys.filter((k) => !orderedKeys.includes(k));
  const displayKeys = [...presentKeys, ...extraKeys];

  return (
    <Card className="mb-4 border border-border shadow-sm">
      <CardHeader className="bg-muted/30 py-3 px-4 border-b border-border">
        <CardTitle className="text-sm font-bold text-primary uppercase tracking-wide">
          {sectionTitle}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 space-y-3">
        {displayKeys.map((key) => {
          const rawValue = data[key];

          // SKIP: Si c'est une clé qui finit par "Nrs" et qu'elle a un parent, on l'ignore ici
          // (Elle sera affichée avec le parent)
          if (key.endsWith("Nrs") && displayKeys.includes(key.replace("Nrs", ""))) {
            return null;
          }

          // if (rawValue === null || rawValue === undefined || rawValue === "") return null;

          const label = fieldLabels[key] || key;

          // CHECK NRS SIBLING
          const nrsKey = `${key}Nrs`;
          let nrsValue = null;
          if (dataKeys.includes(nrsKey)) {
            nrsValue = data[nrsKey];
          }

          let displayValue = rawValue;

          // NETTOYAGE SPECIFIQUE POUR SECTION 6 (ET AUTRES AVEC NRS INCLUS)
          // On retire le pattern "| (NRS 0-10): X" ou "(NRS 0-10): X" si un badge NRS est affiché
          if (nrsValue !== null && typeof rawValue === 'string') {
            // Regex pour retirer "| (NRS 0-10): ..." ou juste "(NRS 0-10): ..."
            // On est assez large pour capter les variantes
            displayValue = rawValue.replace(/\|?\s*\(NRS\s*0-10\)\s*:\s*\d+/gi, "").trim();
            // Nettoyage final des pipe trainants éventuels
            displayValue = displayValue.replace(/\|\s*$/, "").trim();
          }

          return (
            <div key={key} className="flex justify-between items-start text-sm group">
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
 * Fonction helper pour rendre la valeur selon son type et sa clé
 */
function renderValue(key: string, value: string | number | boolean | null | undefined) {
  // --- CAS 0: NULL / VIDE / N/A ---
  if (value === null ||
    value === undefined ||
    value === "" ||
    (typeof value === 'string' && (value.toLowerCase().includes("à remplir") || value.trim().toUpperCase() === "N/A"))) {
    return <span className="text-muted-foreground/50 italic text-xs">N/A</span>;
  }

  // --- CAS 1: BOOLEANS (Cases à cocher) ---
  const isTrueString = typeof value === "string" && (value.toLowerCase() === "oui" || value.toLowerCase() === "yes");
  const isFalseString = typeof value === "string" && (value.toLowerCase() === "non" || value.toLowerCase() === "no");

  // Cas spécifique pour le binaire 1/0 (souvent en Section 5)
  const isBinaryOne = value === 1 || value === "1";
  const isBinaryZero = value === 0 || value === "0";

  // Detection pattern "Oui | Texte" ou "Non | Texte" (Section 9)
  const compositeMatch = typeof value === "string" ? value.match(/^(Oui|Non)\s*\|\s*(.*)$/i) : null;

  if (typeof value === "boolean" || isTrueString || isFalseString || compositeMatch || isBinaryOne || isBinaryZero) {
    const isTrue = value === true || isTrueString || isBinaryOne || (compositeMatch && compositeMatch[1].toLowerCase() === "oui");

    // Si composite, on extrait le texte à afficher à côté du badge
    const extraText = compositeMatch ? compositeMatch[2] : null;

    // Si c'est TRUE -> Badge vert
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
    // Si c'est FALSE -> Badge Gris ou Texte discret (mais pour Section 9 on veut Badge rouge/gris ?)
    // User: "mettre le badge oui ou non" -> implique visibilité
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

  // --- CAS Units for Weight and Height ---
  if (key === "poids" && !isNaN(numValue) && !strValue.toLowerCase().includes("kg")) {
    return <span className="font-medium">{numValue} kg</span>;
  }
  if (key === "taille" && !isNaN(numValue) && !strValue.toLowerCase().includes("cm")) {
    return <span className="font-medium">{numValue} cm</span>;
  }
  if (key === "age" && !isNaN(numValue) && !strValue.toLowerCase().includes("ans")) {
    return <span className="font-medium">{numValue} ans</span>;
  }

  // --- CAS 2: IMC (Calcul de couleur) ---
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

  // --- CAS 3: NRS (Échelles de douleur 0-10) ---
  // Détecte les clés contenant 'nrs' (ex: nrsRepos, flexionAvantNrs)
  if ((key.toLowerCase().includes("nrs") || key.endsWith("Nrs")) && !isNaN(numValue)) {
    let variant: "green" | "yellow" | "red" = "green";

    // Si c'est un score numérique pur 0-10
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

  // --- CAS 4: Texte Standard ---
  return <span className="whitespace-pre-line wrap-break-word">{strValue}</span>;
}
