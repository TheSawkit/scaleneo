"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload, Check, AlertCircle } from "lucide-react";
import { parsePatientFile } from "@/utils/parser";
import { PatientData } from "@/types/patient";
import { cn } from "@/lib/utils";

interface FileUploadProps {
  onDataParsed: (data: PatientData, rawContent: string) => void;
}

export function FileUpload({ onDataParsed }: FileUploadProps) {
  const [dragActive, setDragActive] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file: File) => {
    const isJsonMime = file.type === "application/json";
    const isJsonExt = file.name.toLowerCase().endsWith(".json");

    if (!isJsonMime && !isJsonExt) {
      setError("Veuillez télécharger un fichier .json");
      return;
    }
    setError(null);
    setFileName(file.name);

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      try {
        if (content.trim().startsWith("{\\rtf")) {
          throw new Error(
            "Format RTF détecté. Veuillez enregistrer au format 'Texte brut' (.json) sans mise en forme.",
          );
        }

        const data = parsePatientFile(content);
        // Basic validation
        if (!data.admin || Object.keys(data.admin).length === 0) {
          throw new Error("Format JSON invalide ou structure manquante.");
        }
        onDataParsed(data, content);
      } catch (err: unknown) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : "Erreur de lecture du fichier. Vérifiez le format.";
        setError(errorMessage);
        console.error(err);
      }
    };
    reader.readAsText(file);
  };

  return (
    <Card className="relative h-full">
      <CardHeader>
        <CardTitle className="text-lg">📥 Chargement Fichier</CardTitle>
      </CardHeader>
      <CardContent>
        <div
          className={cn(
            "border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer",
            dragActive
              ? "border-primary bg-primary/5"
              : "border-border hover:border-primary/50 hover:bg-muted/50",
          )}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => document.getElementById("file-upload")?.click()}
        >
          <div className="flex flex-col items-center justify-center gap-4">
            {fileName ? (
              <div className="p-4 bg-primary/10 rounded-full text-primary animate-in zoom-in">
                <Check className="w-8 h-8" />
              </div>
            ) : (
              <div className="p-4 bg-muted rounded-full text-muted-foreground">
                <Upload className="w-8 h-8" />
              </div>
            )}

            <div className="space-y-2">
              {fileName ? (
                <p className="text-sm font-medium text-foreground">
                  {fileName}
                </p>
              ) : (
                <>
                  <p className="text-sm font-semibold text-foreground">
                    Glissez-déposez ou cliquez ici
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Format supporté: .json
                  </p>
                </>
              )}
            </div>

            <Input
              id="file-upload"
              type="file"
              className="hidden"
              accept=".json"
              onChange={handleChange}
            />

            <Button
              variant={fileName ? "outline" : "default"}
              size="sm"
              className="mt-2"
            >
              {fileName ? "Changer de fichier" : "Sélectionner un fichier"}
            </Button>
          </div>
        </div>

        {error && (
          <div className="mt-4 p-3 bg-destructive/10 text-destructive rounded-md text-sm flex items-center gap-2 animate-in slide-in-from-top-2">
            <AlertCircle className="w-4 h-4" />
            {error}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
