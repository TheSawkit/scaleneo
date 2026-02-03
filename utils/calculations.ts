import { PatientData } from "@/types/patient";
import { SCORE_DEFINITIONS, RED_FLAGS, RedFlagDefinition } from "./definitions";

// --- HELPERS ---

/** Helper pour parser un score qui peut être string ou number */
const parseScore = (val: string | number | undefined | null): number => {
  if (val === undefined || val === null) return 0;
  if (typeof val === "number") return val;
  const parsed = parseInt(val);
  return isNaN(parsed) ? 0 : parsed;
};

/** Helper pour vérifier si une string contient un mot (insensible à la casse) */
const hasText = (val: string | undefined | null, search: string): boolean => {
  if (!val) return false;
  return val.toLowerCase().includes(search.toLowerCase());
};

// --- CALCULS ---

export const computeIMC = (poids: string | undefined, taille: string | undefined): string | null => {
  if (!poids || !taille) return null;
  const p = parseFloat(poids);
  // Si la taille est > 3 (ex: 175 cm), on divise par 100. Sinon (1.75 m) on garde tel quel.
  let t = parseFloat(taille);
  if (t > 3) t = t / 100;

  if (isNaN(p) || isNaN(t) || t === 0) return null;
  const imc = p / (t * t);
  return imc.toFixed(1);
};

export const interpretScore = (
  scoreKey: keyof typeof SCORE_DEFINITIONS,
  value: string | number | undefined,
) => {
  if (!scoreKey || value === undefined || value === null) return null;
  const def = SCORE_DEFINITIONS[scoreKey];
  if (!def) return null;

  const numVal = parseScore(value);

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
  // On stringify tout l'objet pour chercher globalement (méthode bruteforce efficace)
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

// --- GÉNÉRATION D'HYPOTHÈSE ---

export const generateHypothesis = (data: PatientData) => {
  const redFlags = detectRedFlags(data);

  return {
    pathology: analyzePathology(data),
    sourcesOfSymptoms: analyzeSourcesOfSymptoms(data),
    painType: analyzePainType(data),
    impairments: analyzeImpairments(data),
    painMechanisms: analyzePainMechanisms(data),
    precautions: analyzePrecautions(redFlags),
    patientsPerspectives: analyzePatientsPerspectives(data),
    activityParticipation: analyzeActivityParticipation(data),
    contributingFactors: analyzeContributingFactors(data),
    managementPrognosis: analyzeManagementPrognosis(data, redFlags),
  };
};

const analyzePathology = (data: PatientData) => {
  // Section 3: Antécédents & Pathologie
  const trauma = data.section3.modeApparition; // "Traumatisme"
  const type = data.section3.typeLBP; // "Chronique", "Aigu"

  if (hasText(trauma, "trauma")) return "Condition mécanique post-traumatique";
  else if (hasText(type, "chronique")) return "Condition musculo-squelettique chronique";
  else return "Douleur rachidienne mécanique non-spécifique";
};

const analyzeSourcesOfSymptoms = (data: PatientData) => {
  // Section 9: Mécanismes Douleur (Checkboxes)
  const s9 = data.section9;
  const sources: string[] = [];

  if (s9.motifArticulaire) sources.push("Articulaire");
  if (s9.motifMyofascial) sources.push("Myofasciale");
  if (s9.motifNeural) sources.push("Neurologique");

  // Fallback Section 5 si Section 9 vide
  const s5 = data.section5;
  if (sources.length === 0) {
    if (s5.douleurArticulaire) sources.push("Articulaire");
    if (s5.douleurMyofasciale) sources.push("Myofasciale");
    if (s5.douleurNeurologique) sources.push("Neurologique");
  }

  return sources.length > 0 ? sources.join(" + ") : "Indéterminée (Mixte probable)";
};

const analyzePainType = (data: PatientData) => {
  // Basé sur CSI (Central Sensitization Inventory) - Section 7
  const csi = parseScore(data.section7.scoreCSI);

  if (csi > 40) return "Nociceptif + Sensibilisation Centrale Dominante";
  else if (csi > 25) return "Douleur mixte (Nociceptif + Sensibilisation modérée)";
  else return "Nociceptif mécanique pur";
};

const analyzeImpairments = (data: PatientData) => {
  // Section 6: Examen Physique
  const s6 = data.section6;
  const impairments: string[] = [];

  // Analyse Flexion/Extension (ex: "40cm" ou "Limité")
  if (s6.flexionAvant && !hasText(s6.flexionAvant, "complet") && !hasText(s6.flexionAvant, "normal")) {
    impairments.push("Déficit Flexion");
  }

  // SLR (Straight Leg Raise) - Neuro
  const slrD = parseScore(s6.slrDroit);
  const slrG = parseScore(s6.slrGauche);
  if ((slrD > 0 && slrD < 70) || (slrG > 0 && slrG < 70)) {
    impairments.push("Neurodynamique limité (SLR+)");
  }

  // Force
  if (s6.forceMusculaire && !hasText(s6.forceMusculaire, "5/5")) {
    impairments.push("Déficit Force");
  }

  return impairments.length > 0 ? impairments.join(" | ") : "Pas de déficits majeurs (ROM préservé)";
};

const analyzePainMechanisms = (data: PatientData) => {
  // Section 7 Scores
  const csi = parseScore(data.section7.scoreCSI);
  const pcs = parseScore(data.section7.scorePCS); // Pain Catastrophizing
  const fabq = parseScore(data.section7.scoreFabqTravail); // Fear Avoidance

  const mechanisms: string[] = [];
  if (csi > 40) mechanisms.push("↑ Sensibilisation centrale");
  if (pcs > 30) mechanisms.push("↑ Catastrophisation élevée");
  if (fabq > 40) mechanisms.push("↑ Peur-Évitement (Yellow Flag)");

  return mechanisms.length > 0 ? mechanisms.join(" + ") : "Mécanismes nociceptifs standards";
};

const analyzePrecautions = (redFlags: DetectedRedFlags) => {
  if (Object.keys(redFlags).length > 0)
    return "⚠️ AVERTISSEMENT: Drapeaux rouges détectés - Voir section dédiée";
  return "✓ Pas de contre-indication absolue identifiée";
};

const analyzePatientsPerspectives = (data: PatientData) => {
  // Section 11
  const s11 = data.section11;
  const comprehension = s11.comprehensionDiagnostic || "inconnue";

  if (hasText(comprehension, "oui") || hasText(comprehension, "bon"))
    return "Bon niveau de compréhension - Alliance thérapeutique favorable";
  else if (hasText(comprehension, "non") || hasText(comprehension, "faible"))
    return "⚠️ Compréhension limitée - Éducation thérapeutique prioritaire";
  else
    return "Compréhension et attentes à clarifier";
};

const analyzeActivityParticipation = (data: PatientData) => {
  // Section 13: Activités
  const s13 = data.section13;

  // Le champ activitesQuotidiennes est souvent une liste de checkboxes concaténée
  if (s13.activitesQuotidiennes && s13.activitesQuotidiennes.length > 5)
    return "Limitations fonctionnelles ADL significatives";

  // PSFS Score (Section 7)
  if (data.section7.scorePSFS)
    return `Limitations spécifiques identifiées (PSFS: ${data.section7.scorePSFS})`;

  return "Participation ADL relativement préservée";
};

const analyzeContributingFactors = (data: PatientData) => {
  // Section 14
  const s14 = data.section14;
  const contributing: string[] = [];

  if (s14.facteursPsycho && !hasText(s14.facteursPsycho, "non")) contributing.push("Facteurs Psychosociaux");
  if (hasText(s14.facteursLifestyle, "sédentaire") || hasText(s14.facteursLifestyle, "inactivité")) contributing.push("Sédentarité");
  if (s14.facteursBiomeca) contributing.push("Facteurs Biomécaniques");

  return contributing.length > 0 ? contributing.join(" + ") : "Pas de facteurs contribuants majeurs";
};

const analyzeManagementPrognosis = (data: PatientData, redFlags: DetectedRedFlags) => {
  // Section 12: Pronostic
  const s12 = data.section12;

  if (hasText(s12.facteursPositifs, "oui") || hasText(s12.facteursPositifs, "bon"))
    return "Pronostic favorable - Réponse attendue au traitement conservateur";

  if (Object.keys(redFlags).length > 0)
    return "Pronostic réservé - Nécessite surveillance médicale (Red Flags)";

  if (hasText(s12.yellowFlags, "oui"))
    return "Pronostic modéré - Risque de chronicité (Yellow Flags)";

  return "Pronostic standard - Réévaluation à 4 semaines";
};