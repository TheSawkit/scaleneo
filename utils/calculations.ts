import { PatientData, ScoresSection } from "@/types/patient";
import { SCORE_DEFINITIONS, RED_FLAGS, RedFlagDefinition } from "./definitions";

export const computeIMC = (poids: string, taille: string): string | null => {
  if (!poids || !taille) return null;
  const p = parseFloat(poids);
  const t = parseFloat(taille) / 100;
  if (isNaN(p) || isNaN(t) || t === 0) return null;
  const imc = p / (t * t);
  return imc.toFixed(1);
};

export const interpretScore = (
  scoreKey: keyof typeof SCORE_DEFINITIONS,
  value: string,
) => {
  if (!scoreKey || !value) return null;
  const def = SCORE_DEFINITIONS[scoreKey];
  if (!def) return null;
  const numVal = parseFloat(value);
  if (isNaN(numVal)) return null;

  // Default to lowest level
  let result = def.levels[0];

  // Find the highest threshold met
  for (const level of def.levels) {
    if (numVal >= level.threshold) {
      result = level;
    }
  }
  return result;
};

export interface DetectedRedFlag extends RedFlagDefinition {
  matchCount: number;
  detected: boolean;
}

export type DetectedRedFlags = Record<string, DetectedRedFlag>;

export const detectRedFlags = (data: PatientData): DetectedRedFlags => {
  const detected: DetectedRedFlags = {};
  const allDataStr = JSON.stringify(data).toLowerCase();

  for (const [flagKey, flagDef] of Object.entries(RED_FLAGS)) {
    let matchCount = 0;
    for (const term of flagDef.searchTerms) {
      if (allDataStr.includes(term.toLowerCase())) matchCount++;
    }
    if (matchCount > 0) {
      detected[flagKey] = { ...flagDef, matchCount, detected: true };
    }
  }
  return detected;
};

export const generateHypothesis = (
  data: PatientData,
  scores: Partial<ScoresSection>,
) => {
  return {
    pathology: analyzePathology(data),
    sourcesOfSymptoms: analyzeSourcesOfSymptoms(data),
    painType: analyzePainType(scores),
    impairments: analyzeImpairments(data),
    painMechanisms: analyzePainMechanisms(scores),
    precautions: analyzePrecautions(detectRedFlags(data)),
    patientsPerspectives: analyzePatientsPerspectives(data),
    activityParticipation: analyzeActivityParticipation(data),
    contributingFactors: analyzeContributingFactors(data),
    managementPrognosis: analyzeManagementPrognosis(data, detectRedFlags(data)),
  };
};

const analyzePathology = (data: PatientData) => {
  const trauma = data.pathologie?.traumatisme?.toLowerCase() || "";
  const type = data.pathologie?.type?.toLowerCase() || "";
  if (trauma.includes("oui")) return "Condition mécanique post-traumatique";
  else if (type.includes("chronique"))
    return "Condition musculo-squelettique chronique";
  else return "Douleur rachidienne mécanique";
};

const analyzeSourcesOfSymptoms = (data: PatientData) => {
  const mech = data.mecanismes || {};
  const sources: string[] = [];
  if (mech.articulaire?.toLowerCase().includes("oui"))
    sources.push("Articulaire");
  if (mech.myofascial?.toLowerCase().includes("oui"))
    sources.push("Myofasciale");
  if (mech.neurologique?.toLowerCase().includes("oui"))
    sources.push("Neurologique");
  return sources.length > 0 ? sources.join(" + ") : "Indéterminée";
};

const analyzePainType = (scores: Partial<ScoresSection>) => {
  const csi = parseInt(scores?.csi || "0");
  if (csi > 50) return "Nociceptif + Sensibilisation Centrale";
  else if (csi > 30)
    return "Douleur mixte (Nociceptif + Sensibilisation modérée)";
  else return "Nociceptif mécanique";
};

const analyzeImpairments = (data: PatientData) => {
  const tests = data.tests || {};
  const impairments: string[] = [];
  if (tests.flexion && tests.flexion.match(/\d+/))
    impairments.push("Limitation flexion");
  if (tests.extension && tests.extension.match(/\d+/))
    impairments.push("Limitation extension");
  if (tests.slrDroit && parseInt(tests.slrDroit) < 70)
    impairments.push("SLR limité droit");
  if (tests.slrGauche && parseInt(tests.slrGauche) < 70)
    impairments.push("SLR limité gauche");
  return impairments.length > 0
    ? impairments.join(" | ")
    : "ROM apparemment normal";
};

const analyzePainMechanisms = (scores: Partial<ScoresSection>) => {
  const csi = parseInt(scores?.csi || "0");
  const pcs = parseInt(scores?.pcs || "0");
  const fabq = parseInt(scores?.fabqTravail || "0");
  const mechanisms: string[] = [];
  if (csi > 50) mechanisms.push("↑ Sensibilisation centrale");
  if (pcs > 30) mechanisms.push("↑ Catastrophisation");
  if (fabq > 50) mechanisms.push("↑ Évitement par peur");
  return mechanisms.length > 0
    ? mechanisms.join(" + ")
    : "Mécanismes standards de douleur";
};

const analyzePrecautions = (redFlags: DetectedRedFlags) => {
  if (Object.keys(redFlags).length > 0)
    return "⚠️ AVERTISSEMENT: Drapeaux rouges détectés";
  return "✓ Pas de contre-indication identifiée";
};

const analyzePatientsPerspectives = (data: PatientData) => {
  const perspectives = data.perspectives || {};
  const comprehension = perspectives.comprehension?.toLowerCase() || "inconnue";
  if (comprehension.includes("oui") || comprehension.includes("bon"))
    return "Bon niveau de compréhension";
  else if (comprehension.includes("non") || comprehension.includes("faible"))
    return "Compréhension limitée - Education nécessaire";
  else return "Comprehension à évaluer";
};

const analyzeActivityParticipation = (data: PatientData) => {
  const activites = data.activites || {};
  const limited = activites.activitesLimitees?.toLowerCase() || "";
  if (limited.includes("oui") || limited.includes("significatif"))
    return "Participation ADL significativement limitée";
  else return "Participation ADL relativement préservée";
};

const analyzeContributingFactors = (data: PatientData) => {
  const factors = data.facteurs || {};
  const contributing: string[] = [];
  if (factors.psychosociaux?.toLowerCase().includes("oui"))
    contributing.push("Psychosociaux");
  if (factors.styleVie?.toLowerCase().includes("sedentaire"))
    contributing.push("Sédentarité");
  if (factors.facteursBiomécaniques?.toLowerCase().includes("oui"))
    contributing.push("Biomécaniques");
  return contributing.length > 0
    ? contributing.join(" + ")
    : "Facteurs mineurs identifiés";
};

const analyzeManagementPrognosis = (
  data: PatientData,
  redFlags: DetectedRedFlags,
) => {
  const pronostic = data.pronostic || {};
  const favorable = pronostic.facteurPositif?.toLowerCase() || "";
  if (favorable.includes("oui"))
    return "Pronostic favorable - Traitement peut être progressif";
  else if (Object.keys(redFlags).length > 0)
    return "Pronostic incertain - Management prudent recommandé";
  else return "Pronostic à préciser après réévaluation initiale";
};
