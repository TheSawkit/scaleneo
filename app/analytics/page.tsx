"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  ReferenceLine,
} from "recharts";
import {
  TrendingDown,
  TrendingUp,
  Plus,
  Calendar,
  FileText,
  Trash2,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

/**
 * CONFIGURATION DES MÉTRIQUES
 * Basé sur l'implémentation legacy SCALENEO v4
 */
const METRICS_CONFIG = {
  nrsMax: {
    label: "Douleur (NRS Max)",
    mcid: 2,
    direction: "down" as const,
    min: 0,
    max: 10,
    color: "#e74c3c",
  },
  odi: {
    label: "Incapacité (ODI)",
    mcid: 10,
    direction: "down" as const,
    min: 0,
    max: 100,
    color: "#3498db",
  },
  csi: {
    label: "Sensibilisation (CSI)",
    mcid: 15,
    direction: "down" as const,
    min: 0,
    max: 100,
    color: "#f39c12",
  },
  pcs: {
    label: "Catastrophisme (PCS)",
    mcid: 6,
    direction: "down" as const,
    min: 0,
    max: 52,
    color: "#9b59b6",
  },
  fabqTravail: {
    label: "Évitement (FABQ-W)",
    mcid: 12,
    direction: "down" as const,
    min: 0,
    max: 100,
    color: "#e67e22",
  },
  hadsAnxiete: {
    label: "Anxiété (HADS-A)",
    mcid: 4,
    direction: "down" as const,
    min: 0,
    max: 21,
    color: "#1abc9c",
  },
  hadsDepression: {
    label: "Dépression (HADS-D)",
    mcid: 4,
    direction: "down" as const,
    min: 0,
    max: 21,
    color: "#16a085",
  },
  fabqActivite: {
    label: "Évitement (FABQ-A)",
    mcid: 12,
    direction: "down" as const,
    min: 0,
    max: 100,
    color: "#d35400",
  },
  wai: {
    label: "Alliance (WAI)",
    mcid: 10,
    direction: "up" as const,
    min: 0,
    max: 100,
    color: "#27ae60",
  },
};

interface Assessment {
  id: string;
  date: string;
  label: string;
  fileName: string;
  metrics: Record<string, number>;
}

/**
 * PARSER RÉGEX (Porté du legacy index.html)
 */
const extractMetricsFromTxt = (content: string): Record<string, number> => {
  const metrics: Record<string, number> = {};
  const patterns = {
    sbt: [/SBT\s*\(.*0-9\)\s*[:=\s]+(\d+)/iu],
    csi: [/CSI Score.*0-100\)\s*[:=\s]+(\d+)/iu],
    odi: [/ODI Score.*0-100\)\s*[:=\s]+(\d+)/iu],
    pcs: [/PCS Score.*0-52\)\s*[:=\s]+(\d+)/iu],
    hadsAnxiete: [/HADS Score Anxiété.*0-21\)\s*[:=\s]+(\d+)/iu],
    hadsDepression: [/HADS Score Dépression.*0-21\)\s*[:=\s]+(\d+)/iu],
    fabqTravail: [/FABQ Score Travail.*0-100\)\s*[:=\s]+(\d+)/iu],
    fabqActivite: [/FABQ Score Activité.*0-100\)\s*[:=\s]+(\d+)/iu],
    nrsRepos: [/NRS Douleur au Repos\s*[:=\s]+(\d+)/iu],
    nrsActivite: [/NRS Douleur[^R]*l'Activité\s*[:=\s]+(\d+)/iu],
    nrsMax: [/NRS Douleur Maximum\s*[:=\s]+(\d+)/iu],
    wai: [/WAI Score.*0-100\)\s*[:=\s]+(\d+\.?\d*)/iu],
  };

  for (const [key, patternArray] of Object.entries(patterns)) {
    for (const pattern of patternArray) {
      const match = content.match(pattern);
      if (match && match[1]) {
        metrics[key] = parseFloat(match[1]);
        break;
      }
    }
  }
  return metrics;
};

export default function AnalyticsPage() {
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [newDate, setNewDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [newLabel, setNewLabel] = useState("");
  useEffect(() => {
  }, []);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !newDate) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const extractedMetrics = extractMetricsFromTxt(content);

      const newAssessment: Assessment = {
        id: Math.random().toString(36).substr(2, 9),
        date: newDate,
        label: newLabel || `Suivi ${assessments.length + 1}`,
        fileName: file.name,
        metrics: extractedMetrics,
      };

      setAssessments((prev) =>
        [...prev, newAssessment].sort(
          (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
        ),
      );
      const today = new Date().toISOString().split('T')[0];
      setNewDate(today);
      setNewLabel("");
      e.target.value = "";
    };
    reader.readAsText(file);
  };

  const removeAssessment = (id: string) => {
    setAssessments((prev) => prev.filter((a) => a.id !== id));
  };

  const chartData = useMemo(() => {
    return assessments.map((a) => ({
      name: a.label,
      date: a.date,
      ...a.metrics,
    }));
  }, [assessments]);

  const baseline = assessments[0];
  const latest = assessments[assessments.length - 1];

  if (typeof window === "undefined") return null;

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto p-4 md:p-6 lg:p-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b pb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-linear-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">
            Analyses Longitudinales
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Suivez la progression clinique et mesurez l&apos;impact thérapeutique
            (MCID).
          </p>
        </div>
        <div className="flex gap-2">
          {assessments.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setAssessments([])}
              className="text-destructive hover:bg-destructive/10"
            >
              <Trash2 className="w-4 h-4 mr-1" /> Tout effacer
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* SIDEBAR: GESTION DES BILANS */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="border-teal-100 shadow-sm overflow-hidden">
            <CardHeader className="bg-teal-50/50 pb-3">
              <CardTitle className="text-sm font-semibold flex items-center">
                <Plus className="w-4 h-4 mr-2 text-teal-600" /> Ajouter un Bilan
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="date">Date de l&apos;examen</Label>
                <Input
                  type="date"
                  id="date"
                  value={newDate}
                  onChange={(e) => setNewDate(e.target.value)}
                  className="bg-muted/30"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="label">Label (ex: S4, Fin cure)</Label>
                <Input
                  type="text"
                  id="label"
                  placeholder="Bilan Suivi..."
                  value={newLabel}
                  onChange={(e) => setNewLabel(e.target.value)}
                  className="bg-muted/30"
                />
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="file"
                  className={`flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-6 cursor-pointer transition-colors ${newDate
                    ? "border-teal-200 bg-teal-50/30 hover:bg-teal-50/60"
                    : "border-muted bg-muted/20 cursor-not-allowed opacity-50"
                    }`}
                >
                  <FileText className="w-6 h-6 text-muted-foreground mb-2" />
                  <span className="text-xs font-medium text-center">
                    Cliquer pour importer le TXT
                  </span>
                  <Input
                    type="file"
                    id="file"
                    accept=".txt"
                    onChange={handleFileUpload}
                    disabled={!newDate}
                    className="hidden"
                  />
                </Label>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm border-muted">
            <CardHeader className="pb-3 border-b">
              <CardTitle className="text-sm font-semibold flex items-center">
                <Calendar className="w-4 h-4 mr-2 text-primary" /> Timeline des
                Bilans
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="max-h-[400px] overflow-y-auto">
                {assessments.length === 0 ? (
                  <div className="p-8 text-center text-xs text-muted-foreground italic">
                    Aucun bilan chargé
                  </div>
                ) : (
                  assessments.map((a, idx) => (
                    <div
                      key={a.id}
                      className={`flex items-start justify-between p-3 border-b hover:bg-muted/30 transition-colors ${idx === 0 ? "bg-teal-50/20" : ""
                        }`}
                    >
                      <div className="flex items-start gap-2">
                        <div
                          className={`mt-1 p-1 rounded-full ${idx === 0
                            ? "bg-teal-100 text-teal-600"
                            : "bg-muted text-muted-foreground"
                            }`}
                        >
                          <CheckCircle2 className="w-3 h-3" />
                        </div>
                        <div>
                          <div className="text-xs font-bold leading-none mb-1">
                            {a.label}
                          </div>
                          <div className="text-[10px] text-muted-foreground">
                            {new Date(a.date).toLocaleDateString("fr-FR")}
                          </div>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="w-6 h-6 text-muted-foreground hover:text-destructive"
                        onClick={() => removeAssessment(a.id)}
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* DASHBOARD & CHARTS */}
        <div className="lg:col-span-3 space-y-6">
          {assessments.length === 0 ? (
            <Card className="border-dashed border-2 bg-muted/10">
              <CardContent className="flex flex-col items-center justify-center h-[500px] text-center p-8">
                <div className="p-4 bg-teal-50 rounded-full mb-4">
                  <TrendingUp className="w-10 h-10 text-teal-600" />
                </div>
                <h2 className="text-xl font-semibold text-teal-900">
                  Prêt pour l&apos;analyse
                </h2>
                <p className="text-sm text-muted-foreground max-w-[400px] mt-2">
                  Importez un premier bilan (Bilan Initial) puis des bilans de
                  suivi pour visualiser les courbes de progression et les MCID.
                </p>
              </CardContent>
            </Card>
          ) : (
            <>
              {/* METRIC CARDS GRID */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {Object.entries(METRICS_CONFIG).map(([key, config]) => {
                  const bVal = baseline?.metrics?.[key];
                  const lVal = latest?.metrics?.[key];

                  if (bVal === undefined || lVal === undefined) return null;

                  const diff = lVal - bVal;
                  const isImprovement =
                    config.direction === "down" ? diff < 0 : diff > 0;
                  const isSignificant = Math.abs(diff) >= config.mcid;

                  return (
                    <Card key={key} className="shadow-sm overflow-hidden">
                      <div
                        className={`h-1 w-full ${isSignificant ? "bg-teal-500" : "bg-muted"}`}
                        style={{
                          backgroundColor: isSignificant
                            ? isImprovement
                              ? "#10b981"
                              : "#ef4444"
                            : "#e5e7eb",
                        }}
                      />
                      <CardContent className="pt-4 px-4 pb-4">
                        <div className="flex justify-between items-start mb-2">
                          <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">
                            {config.label}
                          </span>
                          {isSignificant && (
                            <Badge
                              className={
                                isImprovement
                                  ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-none px-1.5 py-0 text-[9px]"
                                  : "bg-rose-100 text-rose-700 hover:bg-rose-100 border-none px-1.5 py-0 text-[9px]"
                              }
                            >
                              MCID √
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-baseline gap-2">
                          <div className="text-2xl font-bold">
                            {lVal.toFixed(1)}
                          </div>
                          <div
                            className={`flex items-center text-xs font-semibold ${isImprovement ? "text-emerald-600" : "text-rose-600"
                              }`}
                          >
                            {isImprovement ? (
                              <TrendingDown className="w-3 h-3 mr-0.5" />
                            ) : (
                              <TrendingUp className="w-3 h-3 mr-0.5" />
                            )}
                            {Math.abs(diff).toFixed(1)}
                          </div>
                        </div>
                        <div className="mt-3 pt-3 border-t flex justify-between items-center">
                          <div className="text-[10px] text-muted-foreground">
                            Baseline:{" "}
                            <span className="font-medium text-foreground">
                              {bVal}
                            </span>
                          </div>
                          <div className="text-[10px] text-muted-foreground">
                            Cible:{" "}
                            <span className="font-medium text-foreground">
                              ±{config.mcid}
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              {/* CHARTS GRID */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {Object.entries(METRICS_CONFIG).map(([key, config]) => {
                  const hasData = assessments.some(
                    (a) => a.metrics[key] !== undefined,
                  );
                  if (!hasData) return null;

                  const bVal = baseline?.metrics?.[key];
                  const mcidTarget =
                    config.direction === "down"
                      ? bVal - config.mcid
                      : bVal + config.mcid;

                  return (
                    <Card key={key} className="shadow-sm border-muted">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-bold flex items-center justify-between">
                          <span>📈 Trend: {config.label}</span>
                          <span className="text-[10px] font-normal text-muted-foreground">
                            Range: {config.min}-{config.max}
                          </span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <div className="h-[250px] w-full mt-4">
                          <ResponsiveContainer width="100%" height="100%">
                            <LineChart
                              data={chartData}
                              margin={{ top: 5, right: 30, left: -20, bottom: 5 }}
                            >
                              <CartesianGrid
                                strokeDasharray="3 3"
                                vertical={false}
                                stroke="#f0f0f0"
                              />
                              <XAxis
                                dataKey="name"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fontSize: 10, fill: "#666" }}
                              />
                              <YAxis
                                domain={[config.min, config.max]}
                                axisLine={false}
                                tickLine={false}
                                tick={{ fontSize: 10, fill: "#666" }}
                              />
                              <Tooltip
                                contentStyle={{
                                  borderRadius: "8px",
                                  border: "1px solid #e2e8f0",
                                  boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                                }}
                                labelStyle={{ fontWeight: "bold", fontSize: "12px" }}
                              />
                              <Legend iconType="circle" wrapperStyle={{ fontSize: "10px" }} />
                              <ReferenceLine
                                y={bVal}
                                label={{
                                  value: "Baseline",
                                  position: "insideLeft",
                                  fontSize: 8,
                                  fill: "#94a3b8",
                                }}
                                stroke="#94a3b8"
                                strokeDasharray="3 3"
                              />
                              <ReferenceLine
                                y={mcidTarget}
                                label={{
                                  value: "MCID Target",
                                  position: "insideRight",
                                  fontSize: 8,
                                  fill: "#10b981",
                                }}
                                stroke="#10b981"
                                strokeDasharray="5 5"
                              />
                              <Line
                                type="monotone"
                                dataKey={key}
                                name={config.label}
                                stroke={config.color}
                                strokeWidth={3}
                                dot={{
                                  r: 4,
                                  fill: config.color,
                                  strokeWidth: 2,
                                  stroke: "#fff",
                                }}
                                activeDot={{ r: 6, strokeWidth: 0 }}
                                animationDuration={1000}
                              />
                            </LineChart>
                          </ResponsiveContainer>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              {/* COMPARISON TABLE */}
              <Card className="shadow-sm border-muted overflow-hidden">
                <CardHeader className="bg-muted/30 pb-3">
                  <CardTitle className="text-sm font-bold">
                    📋 Tableau Récapitulatif & Validation MCID
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                      <thead className="text-xs uppercase bg-muted/50 text-muted-foreground">
                        <tr>
                          <th className="px-6 py-3 font-semibold">Métrique</th>
                          <th className="px-6 py-3 font-semibold">Baseline</th>
                          <th className="px-6 py-3 font-semibold text-foreground">
                            Actuel
                          </th>
                          <th className="px-6 py-3 font-semibold">Changement</th>
                          <th className="px-6 py-3 font-semibold">Cible MCID</th>
                          <th className="px-6 py-3 font-semibold">Statut</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y">
                        {Object.entries(METRICS_CONFIG).map(([key, config]) => {
                          const bVal = baseline?.metrics?.[key];
                          const lVal = latest?.metrics?.[key];

                          if (bVal === undefined || lVal === undefined) return null;

                          const diff = lVal - bVal;
                          const isImprovement =
                            config.direction === "down" ? diff < 0 : diff > 0;
                          const isSignificant = Math.abs(diff) >= config.mcid;

                          return (
                            <tr key={key} className="hover:bg-muted/20">
                              <td className="px-6 py-4 font-medium">
                                {config.label}
                              </td>
                              <td className="px-6 py-4 text-muted-foreground">
                                {bVal.toFixed(1)}
                              </td>
                              <td className="px-6 py-4 font-bold">
                                {lVal.toFixed(1)}
                              </td>
                              <td
                                className={`px-6 py-4 font-semibold ${isImprovement
                                  ? "text-emerald-600"
                                  : "text-rose-600"
                                  }`}
                              >
                                {diff > 0 ? "+" : ""}
                                {diff.toFixed(1)}
                              </td>
                              <td className="px-6 py-4 text-muted-foreground italic">
                                ± {config.mcid}
                              </td>
                              <td className="px-6 py-4">
                                {isSignificant ? (
                                  <Badge className="bg-teal-500 hover:bg-teal-600 rounded-sm px-2 py-0.5 text-[10px]">
                                    MCID ATTEINT
                                  </Badge>
                                ) : (
                                  <span className="text-xs text-muted-foreground flex items-center">
                                    <AlertCircle className="w-3 h-3 mr-1" /> En
                                    progression
                                  </span>
                                )}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
