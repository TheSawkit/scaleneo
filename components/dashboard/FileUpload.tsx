"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload, Check, AlertCircle, FileText } from "lucide-react";
import { PatientParser } from "@/utils/parser";
import { PatientData } from "@/types/patient";
import { cn } from "@/lib/utils";

interface FileUploadProps {
  onDataParsed: ( arg0: PatientData, rawContent: string) => void;
}

export function FileUpload({ onDataParsed }: FileUploadProps) {
  const [dragActive, setDragActive] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [fileType, setFileType] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

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
    // Reset states
    setError(null);
    setIsProcessing(true);

    // Validate file extension
    const fileNameLower = file.name.toLowerCase();
    const isJson = fileNameLower.endsWith(".json") || file.type === "application/json";
    const isTxt = fileNameLower.endsWith(".txt") || file.type === "text/plain";

    if (!isJson && !isTxt) {
      setError("⚠️ Format non supporté. Veuillez télécharger un fichier .json ou .txt");
      setIsProcessing(false);
      return;
    }

    setFileName(file.name);
    setFileType(isJson ? "JSON" : "TXT");

    const reader = new FileReader();
    
    reader.onerror = () => {
      setError("❌ Erreur de lecture du fichier. Vérifiez que le fichier n'est pas corrompu.");
      setIsProcessing(false);
    };

    reader.onload = (e) => {
      const content = e.target?.result as string;
      
      try {
        // 1. Validate content exists
        if (!content || content.trim().length === 0) {
          throw new Error("Le fichier est vide.");
        }

        // 2. Detect and reject RTF format (common mistake)
        if (content.trim().startsWith("{\\rtf")) {
          throw new Error(
            "❌ Format RTF détecté. Veuillez enregistrer au format 'Texte brut' (.txt) sans mise en forme.\n\n" +
            "💡 Astuce: Dans votre éditeur de texte, utilisez 'Enregistrer sous' → Format: 'Texte brut (.txt)'"
          );
        }

        // 3. Parse based on file type
        let parsedData: PatientData;

        if (isJson) {
          // Direct JSON parsing (si le fichier est déjà au bon format)
          try {
            parsedData = JSON.parse(content) as PatientData;
          } catch (jsonErr) {
            throw new Error("Format JSON invalide. Vérifiez la syntaxe du fichier.");
          }
        } else {
          // TXT parsing via le nouveau parser
          parsedData = PatientParser.parse(content);
        }

        // 4. Basic validation: Check if at least Section 1 has data
        if (!parsedData.section1 || Object.keys(parsedData.section1).length === 0) {
          throw new Error(
            "⚠️ Aucune donnée extraite de la Section 1 (Identité Patient).\n\n" +
            "Vérifiez que le fichier respecte le format du template SCALENEO."
          );
        }

        // 5. Success - Pass data to parent component
        setIsProcessing(false);
        onDataParsed(parsedData, content);

      } catch (err: unknown) {
        // Error handling with detailed messages
        const errorMessage =
          err instanceof Error
            ? err.message
            : "Erreur inconnue lors du parsing. Contactez le support technique.";
        
        setError(errorMessage);
        setIsProcessing(false);
        
        // Log for debugging (remove in production if needed)
        console.error("❌ Erreur de parsing:", err);
      }
    };

    reader.readAsText(file, "UTF-8"); // Force UTF-8 encoding
  };

  return (
    <Card className="relative h-full">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          📥 Chargement Fichier
          <span className="text-xs font-normal text-muted-foreground">
            (.txt ou .json)
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div
          className={cn(
            "border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer",
            dragActive
              ? "border-primary bg-primary/5"
              : "border-border hover:border-primary/50 hover:bg-muted/50",
            isProcessing && "pointer-events-none opacity-60"
          )}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => document.getElementById("file-upload")?.click()}
        >
          <div className="flex flex-col items-center justify-center gap-4">
            {isProcessing ? (
              <div className="p-4 bg-primary/10 rounded-full text-primary">
                <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
              </div>
            ) : fileName ? (
              <div className="p-4 bg-primary/10 rounded-full text-primary animate-in zoom-in">
                <Check className="w-8 h-8" />
              </div>
            ) : (
              <div className="p-4 bg-muted rounded-full text-muted-foreground">
                <Upload className="w-8 h-8" />
              </div>
            )}

            <div className="space-y-2">
              {isProcessing ? (
                <>
                  <p className="text-sm font-semibold text-foreground">
                    Parsing en cours...
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Extraction des données du fichier {fileType}
                  </p>
                </>
              ) : fileName ? (
                <>
                  <div className="flex items-center justify-center gap-2">
                    <FileText className="w-4 h-4 text-primary" />
                    <p className="text-sm font-medium text-foreground">
                      {fileName}
                    </p>
                  </div>
                  {fileType && (
                    <p className="text-xs text-muted-foreground">
                      Format: {fileType}
                    </p>
                  )}
                </>
              ) : (
                <>
                  <p className="text-sm font-semibold text-foreground">
                    Glissez-déposez ou cliquez ici
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Formats supportés: .txt, .json
                  </p>
                </>
              )}
            </div>

            <Input
              id="file-upload"
              type="file"
              className="hidden"
              accept=".txt,.json,text/plain,application/json"
              onChange={handleChange}
              disabled={isProcessing}
            />

            <Button
              variant={fileName ? "outline" : "default"}
              size="sm"
              className="mt-2"
              disabled={isProcessing}
            >
              {fileName ? "Changer de fichier" : "Sélectionner un fichier"}
            </Button>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mt-4 p-3 bg-destructive/10 text-destructive rounded-md text-sm flex items-start gap-2 animate-in slide-in-from-top-2">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <div className="flex-1 whitespace-pre-line">{error}</div>
          </div>
        )}

        {/* Success Display */}
        {fileName && !error && !isProcessing && (
          <div className="mt-4 p-3 bg-primary/10 text-primary rounded-md text-sm flex items-center gap-2 animate-in slide-in-from-top-2">
            <Check className="w-4 h-4 shrink-0" />
            <span>
              ✅ Fichier {fileType} chargé avec succès. Données extraites et prêtes à l&apos;emploi.
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}