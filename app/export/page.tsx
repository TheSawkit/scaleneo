"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { usePatient } from "@/components/providers/PatientProvider";
import { Download, FileSpreadsheet, FileText } from "lucide-react";
import { useState } from "react";

export default function ExportPage() {
  const { patientData } = usePatient();
  const [isExporting, setIsExporting] = useState(false);

  const flattenPatientData = () => {
    if (!patientData) return null;

    const flatten = (obj: Record<string, unknown>, prefix = ''): Record<string, unknown> => {
      const result: Record<string, unknown> = {};

      for (const key in obj) {
        if (!Object.prototype.hasOwnProperty.call(obj, key)) continue;

        const value = obj[key];
        const newKey = prefix ? `${prefix}.${key}` : key;

        if (value && typeof value === 'object' && !Array.isArray(value)) {
          Object.assign(result, flatten(value as Record<string, unknown>, newKey));
        } else if (Array.isArray(value)) {
          result[newKey] = (value as unknown[]).join(', ');
        } else {
          result[newKey] = value;
        }
      }

      return result;
    };

    return flatten(patientData as unknown as Record<string, unknown>);
  };

  const handleExport = async (format: "csv" | "xlsx" | "json") => {
    if (!patientData) {
      alert("Aucune donnée à exporter");
      return;
    }

    setIsExporting(true);

    try {
      const data = flattenPatientData();

      // 1. Utilisation de fetch au lieu de form.submit()
      const response = await fetch("/api/export", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ data, format }),
      });

      if (!response.ok) {
        throw new Error("Erreur lors de la génération du fichier");
      }

      // 2. Récupération du Blob (le fichier binaire)
      const blob = await response.blob();

      // 3. Création d'une URL pour ce Blob
      const url = window.URL.createObjectURL(blob);

      // 4. Tentative de récupération du nom de fichier depuis le header Content-Disposition
      // (Optionnel, sinon on génère un nom par défaut ici)
      const contentDisposition = response.headers.get("Content-Disposition");
      let filename = `export_patient_${new Date().toISOString().split('T')[0]}.${format}`;

      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="?([^"]+)"?/);
        if (filenameMatch && filenameMatch.length === 2) {
          filename = filenameMatch[1];
        }
      }

      // 5. Création et clic sur un lien invisible
      const a = document.createElement("a");
      a.href = url;
      a.download = filename; // C'est ici que l'extension est forcée
      document.body.appendChild(a);
      a.click();

      // 6. Nettoyage
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

    } catch (error) {
      console.error("Erreur export:", error);
      alert(`Erreur lors de l'export ${format.toUpperCase()}`);
    } finally {
      setIsExporting(false);
    }
  };

  const hasData = !!patientData;

  return (
    <Card>
      <CardHeader>
        <CardTitle>💾 Export & Édition</CardTitle>
      </CardHeader>
      <CardContent>
        {!hasData ? (
          <div className="text-center py-20 text-muted-foreground italic">
            Aucune donnée disponible. Veuillez d&apos;abord extraire des données depuis la page d&apos;extraction.
          </div>
        ) : (
          <div className="space-y-6">
            <div className="text-sm text-muted-foreground">
              Exportez les données du patient dans le format de votre choix.
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button
                type="button"
                onClick={() => handleExport("csv")}
                variant="outline"
                className="h-auto flex flex-col items-center gap-3 py-6"
                disabled={isExporting}
              >
                <FileText className="h-8 w-8" />
                <div className="flex flex-col items-center">
                  <span className="font-semibold">Export CSV</span>
                  <span className="text-xs text-muted-foreground">
                    Format texte compatible Excel
                  </span>
                </div>
              </Button>

              <Button
                type="button"
                onClick={() => handleExport("xlsx")}
                variant="outline"
                className="h-auto flex flex-col items-center gap-3 py-6"
                disabled={isExporting}
              >
                <FileSpreadsheet className="h-8 w-8" />
                <div className="flex flex-col items-center">
                  <span className="font-semibold">Export XLSX</span>
                  <span className="text-xs text-muted-foreground">
                    Fichier Excel complet
                  </span>
                </div>
              </Button>

              <Button
                type="button"
                onClick={() => handleExport("json")}
                variant="outline"
                className="h-auto flex flex-col items-center gap-3 py-6"
                disabled={isExporting}
              >
                <Download className="h-8 w-8" />
                <div className="flex flex-col items-center">
                  <span className="font-semibold">Export JSON</span>
                  <span className="text-xs text-muted-foreground">
                    Format données brutes
                  </span>
                </div>
              </Button>
            </div>

            {isExporting && (
              <div className="text-center text-sm text-muted-foreground">
                Export en cours...
              </div>
            )}

            <div className="mt-8">
              <h3 className="text-sm font-semibold mb-3">Aperçu des données</h3>
              <div className="bg-muted p-4 rounded-md max-h-96 overflow-auto">
                <pre className="text-xs">
                  {JSON.stringify(patientData, null, 2)}
                </pre>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}