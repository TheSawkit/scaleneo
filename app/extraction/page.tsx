"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileUpload } from "@/components/dashboard/FileUpload";
import { usePatient } from "@/components/providers/PatientProvider";
import { PatientData } from "@/types/patient";
import { useRouter } from "next/navigation";

export default function ExtractionPage() {
  const { patientData, setPatientData, setRawContent } = usePatient();
  const router = useRouter();

  const handleDataParsed = (data: PatientData, content: string) => {
    setPatientData(data);
    setRawContent(content);
    if (data) {
      setTimeout(() => router.push("/results"), 500);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <FileUpload onDataParsed={handleDataParsed} />
      <Card className="h-full">
        <CardHeader>
          <CardTitle className="text-lg">⚙️ Traitement</CardTitle>
        </CardHeader>
        <CardContent>
          {patientData ? (
            <div className="space-y-4">
              <div className="p-4 bg-muted text-foreground rounded-lg text-sm flex items-center gap-2 border border-border">
                ✅ Analyse complétée avec succès
              </div>

              <div className="text-sm text-muted-foreground space-y-2">
                <div className="flex justify-between py-2 border-b border-border">
                  <span>Variables extraites</span>
                  <span className="font-bold text-foreground">
                    {getAllKeysCount(patientData)}
                  </span>
                </div>

                <div className="flex justify-between py-2 border-b border-border">
                  <span>Scores identifiés</span>
                  <span className="font-bold text-foreground">
                    {getScoresCount(patientData)}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-48 flex items-center justify-center text-muted-foreground text-sm italic bg-muted/50 rounded-lg border-2 border-dashed border-border">
              En attente de fichier...
            </div>
          )}
        </CardContent>
      </Card>

      {patientData && (
        <div className="col-span-1 md:col-span-2 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm uppercase text-muted-foreground">
                Aperçu JSON
              </CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="text-[10px] bg-muted text-muted-foreground p-4 rounded-lg h-60 overflow-auto font-mono border border-border">
                {JSON.stringify(patientData, null, 2)}
              </pre>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

function isFilledScoreValue(v: unknown): boolean {
  if (v === null || v === undefined) return false;
  if (typeof v === "number") return Number.isFinite(v);
  if (typeof v === "string") return v.trim().length > 0;
  return false;
}

function getScoresCount(data: PatientData): number {
  const scoreCandidates: unknown[] = [
    data.section4?.nrsRepos,
    data.section4?.nrsActivite,
    data.section4?.nrsMax,

    data.section7?.scoreSBT,
    data.section7?.scoreCSI,
    data.section7?.scoreODI,
    data.section7?.scorePCS,
    data.section7?.scoreAnxiete,
    data.section7?.scoreDepression,
    data.section7?.scoreFabqTravail,
    data.section7?.scoreFabqActivite,
    data.section7?.scoreWAI,

    data.section15?.pgic,
    data.section15?.satisfaction,
  ];

  return scoreCandidates.filter(isFilledScoreValue).length;
}

function getAllKeysCount(obj: PatientData): number {
  let count = 0;

  for (const key in obj) {
    const section = obj[key as keyof PatientData];

    if (
      typeof section === "object" &&
      section !== null &&
      !Array.isArray(section)
    ) {
      count += Object.keys(section).length;
    }
  }

  return count;
}