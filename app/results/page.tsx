"use client";

import { usePatient } from "@/components/providers/PatientProvider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RedFlagsAlert } from "@/components/dashboard/RedFlagsAlert";
import { ScoreSummary } from "@/components/dashboard/ScoreSummary";
import { HypothesisView } from "@/components/dashboard/HypothesisView";
import { FIELD_LABELS, SECTION_LABELS } from "@/utils/labels";
import { Badge } from "@/components/ui/badge";

export default function ResultsPage() {
  const { patientData } = usePatient();

  if (!patientData) {
    return (
      <div className="text-center py-20 bg-muted/30 rounded-xl border border-dashed border-border text-muted-foreground animate-in fade-in-50">
        Veuillez d'abord charger un fichier dans l'onglet Extraction.
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in-50 slide-in-from-bottom-2">
      <RedFlagsAlert data={patientData} />
      <ScoreSummary data={patientData} />
      <HypothesisView data={patientData} />

      <Card>
        <CardHeader>
          <CardTitle>📋 Données Détaillées</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(patientData).map(([sectionKey, sectionData]) => (
              <SectionCard
                key={sectionKey}
                title={sectionKey}
                data={sectionData}
              />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function SectionCard({ title, data }: { title: string; data: any }) {
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
              className="text-foreground text-right font-medium wrap-break-word text-wrap flex-1 ml-4"
              title={value}
            >
              {value}
            </span>
          );

          if (k === "imc" && value && value.includes("(")) {
            const match = value.match(/^([\d\.,]+)\s*\((.+)\)/);
            if (match) {
              content = (
                <div className="flex items-center gap-2 justify-end flex-1 ml-4">
                  <span className="font-bold">{match[1]}</span>
                  <Badge variant="neutral" className="text-[10px] h-5">
                    {match[2]}
                  </Badge>
                </div>
              );
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
