import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PatientData } from "@/types/patient";
import { detectRedFlags } from "@/utils/calculations";
import { AlertTriangle, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface RedFlagsAlertProps {
  data: PatientData;
}

/**
 * RedFlagsAlert Component
 *
 * Detects and displays clinical red flags (warning signs) from patient data.
 *
 * Shows:
 * - Green confirmation card if no red flags detected
 * - Red alert card with categorized flags if any are found
 * - Flags are color-coded by severity: CRITICAL (red), HIGH (orange), MODERATE (yellow)
 *
 * @param data - Complete patient data object to analyze
 */
export function RedFlagsAlert({ data }: RedFlagsAlertProps) {
  const flags = detectRedFlags(data);
  const flagCount = Object.keys(flags).length;

  if (flagCount === 0) {
    return (
      <Card className="mb-5 border-green-500 bg-green-50/50">
        <CardContent className="pt-6 flex items-center gap-3">
          <CheckCircle className="w-6 h-6 text-green-600" />
          <div>
            <h3 className="text-green-800 font-bold text-base">
              Pas de drapeau rouge détecté
            </h3>
            <p className="text-green-700 text-xs mt-1">
              Aucun critère d&apos;alerte identifié dans ce bilan.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mb-5 border-2 border-destructive bg-destructive/10">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-3">
          <AlertTriangle className="w-6 h-6 text-destructive" />
          <CardTitle className="text-destructive text-base">
            {flagCount} DRAPEAU(X) ROUGE(S) DÉTECTÉ(S)
          </CardTitle>
        </div>
      </CardHeader>

      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {Object.entries(flags).map(([key, flag]) => (
            <div
              key={key}
              className={cn(
                "p-3 rounded border-l-4",
                flag.category === "CRITICAL"
                  ? "border-destructive bg-destructive/20 text-destructive-background"
                  : flag.category === "HIGH"
                    ? "border-orange-500 bg-orange-50 text-orange-900"
                    : "border-yellow-500 bg-yellow-50 text-yellow-900",
              )}
            >
              <div className="font-semibold text-xs">{flag.label}</div>
              <div className="text-[10px] italic mt-1 opacity-90">
                {flag.recommendation}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
