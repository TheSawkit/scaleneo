import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PatientData } from "@/types/patient";
import { interpretScore } from "@/utils/calculations";
import { SCORE_DEFINITIONS } from "@/utils/definitions";
import { cn } from "@/lib/utils";

interface ScoreSummaryProps {
  data: PatientData;
}

interface ComputedScore {
  key: string;
  label: string;
  value: string | number;
  interp: ReturnType<typeof interpretScore>;
}

export function ScoreSummary({ data }: ScoreSummaryProps) {
  const potentialScores = [
    { key: "sbt", value: data.section7.scoreSBT },
    { key: "csi", value: data.section7.scoreCSI },
    { key: "odi", value: data.section7.scoreODI },
    { key: "pcs", value: data.section7.scorePCS },
    { key: "hadsAnxiete", value: data.section7.scoreAnxiete },
    { key: "hadsDepression", value: data.section7.scoreDepression },
    { key: "fabqTravail", value: data.section7.scoreFabqTravail },
    { key: "fabqActivite", value: data.section7.scoreFabqActivite },
    { key: "wai", value: data.section7.scoreWAI },
  ];

  const computedScores = potentialScores
    .map(({ key, value }) => {
      // Si la valeur est vide/null, on ignore ce score
      if (value === undefined || value === null || value === "") return null;

      const def = SCORE_DEFINITIONS[key as keyof typeof SCORE_DEFINITIONS];
      if (!def) return null;

      // Nettoyage des parenthèses pour le résumé (ex: "4/9 (Risque faible)" -> "4/9")
      const cleanValue = typeof value === "string"
        ? value.replace(/\s*\(.*\)\s*$/, "").trim()
        : value;

      const interp = interpretScore(
        key as keyof typeof SCORE_DEFINITIONS,
        cleanValue
      );

      return { key, label: def.label, value: cleanValue, interp };
    })
    .filter(Boolean) as ComputedScore[];

  if (computedScores.length === 0) return null;

  return (
    <Card className="mb-5 border-2 border-accent bg-accent/20">
      <CardHeader>
        <CardTitle className="text-base text-foreground">
          📊 Résumé des Scores Cliniques
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {computedScores.map((score) => (
            <div
              key={score.key}
              className={cn(
                "bg-card p-3 rounded border-l-4 shadow-sm border border-border",
                score.interp?.color === "red"
                  ? "border-l-destructive"
                  : score.interp?.color === "yellow"
                    ? "border-l-yellow-500"
                    : "border-l-green-500",
              )}
            >
              <div className="text-[10px] font-bold text-muted-foreground uppercase mb-1">
                {score.label}
              </div>
              <div className="text-xl font-bold text-foreground leading-none mb-2">
                {score.value}
              </div>
              <div
                className={cn(
                  "text-[10px] italic font-medium leading-tight",
                  score.interp?.color === "red"
                    ? "text-destructive"
                    : score.interp?.color === "yellow"
                      ? "text-yellow-600"
                      : "text-green-600",
                )}
              >
                {score.interp?.label}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}