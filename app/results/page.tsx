"use client";

import { usePatient } from "@/components/providers/PatientProvider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RedFlagsAlert } from "@/components/dashboard/RedFlagsAlert";
import { ScoreSummary } from "@/components/dashboard/ScoreSummary";
import { HypothesisView } from "@/components/dashboard/HypothesisView";
import { SectionCard } from "@/components/dashboard/SectionCard";

export default function ResultsPage() {
  const { patientData } = usePatient();

  if (!patientData) {
    return (
      <div className="text-center py-20 bg-muted/30 rounded-xl border border-dashed border-border text-muted-foreground animate-in fade-in-50">
        Veuillez d&apos;abord charger un fichier dans l&apos;onglet Extraction.
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
                sectionKey={sectionKey}
                data={sectionData}
              />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
