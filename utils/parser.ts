/**
 * parser.ts
 * Moteur de parsing robuste pour les fiches bilan.
 * Utilise une approche déclarative (Configuration over Code).
 */

// --- DÉFINITION DES TYPES DE SORTIE (A adapter selon tes besoins exacts) ---
export interface SectionData {
  [key: string]: string | string[] | boolean | number | null;
}

export interface PatientData {
  section1: SectionData;
  section2: SectionData;
  section3: SectionData;
  section4: SectionData;
  section5: SectionData;
  section6: SectionData;
  section7: SectionData;
  section8: SectionData;
  section9: SectionData;
  section10: SectionData;
  section11: SectionData;
  section12: SectionData;
  section13: SectionData;
  section14: SectionData;
  section15: SectionData;
  section16: SectionData;
  section17: SectionData;
  section18: SectionData;
}

// --- CONFIGURATION DU MAPPING ---
// Clé = Texte à chercher dans le fichier (insensible à la casse)
// Valeur = Nom de la propriété dans l'objet JSON final
const PARSER_CONFIG: Record<string, Record<string, string>> = {
  "SECTION 1": {
    "nom et prénom": "nomPatient",
    "année de naissance": "anneeNaissance",
    "age": "age",
    "sexe": "sexe",
    "profession": "profession",
    "secteur": "secteur",
    "kiné examinateur": "kineExaminateur",
    "date bilan": "dateBilan",
    "id patient": "idPatient",
    "id bilan": "idBilan"
  },
  "SECTION 2": {
    "poids": "poids",
    "taille": "taille",
    "imc": "imc"
  },
  "SECTION 3": {
    "antécédents lbp": "antecedentsLBP",
    "episode initial": "episodeInitial",
    "traumatisme": "modeApparition",
    "récidive": "recidive",
    "pire episode": "pireEpisode",
    "durée totale": "dureeTotale",
    "type lbp": "typeLBP"
  },
  "SECTION 4": {
    "douleur au repos": "nrsRepos",
    "douleur à l'activité": "nrsActivite",
    "douleur maximum": "nrsMax",
    "horaire douleur": "horaireDouleur",
    "variation journalière": "variationJournaliere",
    "facteurs aggravants": "facteursAggravants",
    "facteurs soulageants": "facteursSoulageants",
    "évolution": "evolution"
  },
  "SECTION 5": {
    "douleur articulaire": "douleurArticulaire",
    "douleur myofasciale": "douleurMyofasciale",
    "douleur neurologique": "douleurNeurologique",
    "sensibilisation centrale": "sensibilisationCentrale",
    "déficit sensorimotor": "deficitSensorimoteur",
    "caractère sensations": "caractereSensations",
    "observations mécanismes": "observationsMecanismes"
  },
  "SECTION 6": {
    // Mouvements
    "flexion avant": "flexionAvant",
    "flexion avant nrs": "flexionAvantNrs",
    "extension": "extension",
    "extension nrs": "extensionNrs",
    "inclinaison d": "inclinaisonDroit",
    "inclinaison d nrs": "inclinaisonDroitNrs",
    "inclinaison g": "inclinaisonGauche",
    "inclinaison g nrs": "inclinaisonGaucheNrs",
    "rotation d": "rotationDroit",
    "rotation d nrs": "rotationDroitNrs",
    "rotation g": "rotationGauche",
    "rotation g nrs": "rotationGaucheNrs",
    "mobilité segmentaire pa": "mobiliteSegmentaire",
    "mobilité segmentaire pa nrs": "mobiliteSegmentaireNrs",
    "hanche": "hanche",
    "hanche nrs": "hancheNrs",
    // Tests Neuro Spécifiques
    "slr droit": "slrDroit",
    "slr gauche": "slrGauche",
    "asymétrie slr": "asymetrieSlr",
    "slump test": "slumpTest",
    "pkb": "pkb",
    "force musculaire": "forceMusculaire",
    "réflexes": "reflexes",
    "sensation": "sensation",
    "sensation localisation": "sensationLocalisation",
    "profil sensoriel": "profilSensoriel",
    "tension musculaire": "tensionMusculaire",
    "trigger points": "triggerPoints",
    "trigger points localisation": "triggerPointsLocalisation",
    "hypersensibilité": "hypersensibilite",
    "spasme musculaire": "spasmeMusculaire",
    "spasme musculaire localisation": "spasmeLocalisation",
    "localisation": "localisation",
    "signes méningés": "signesMeninges",
    "hypersensibilité à la pression": "hypersensibilitePression",
    "zone lombaire": "zoneLombaire",
    "zone contrôle": "zoneControle",
    // Endurance
    "sorensen": "testSorensen",
    "ito shirado": "testItoShirado",
    "core strength index": "coreStrengthIndex",
    "side plank": "sidePlank",
    "csm": "controlSensoriMoteur"
  },
  "SECTION 7": {
    "sbt": "scoreSBT",
    "csi score": "scoreCSI",
    "odi score": "scoreODI",
    "pcs score": "scorePCS",
    "hads score anxiété": "scoreAnxiete",
    "hads score dépression": "scoreDepression",
    "fabq score travail": "scoreFabqTravail",
    "fabq score activité": "scoreFabqActivite",
    "wai score": "scoreWAI",
    "ipaq": "scoreIPAQ",
    "ipaq met": "scoreIPAQ_MET",
    "psfs": "scorePSFS",
    "psfs scores": "scorePSFS_Scores",
    "sf-36": "qualiteVie",
    "autres questionnaires": "autresQuestionnaires"
  },
  "SECTION 8": {
    "drapeaux rouges": "redFlags",
    "si oui, lesquels": "detailsRedFlags",
    "contre-indications": "contreIndications",
    "allergies": "allergies",
    "médications": "medications",
    "examen médicaux": "examensMedicaux",
    "instabilité rachidienne": "instabiliteRachidienne",
    "signes": "signesInstabilite",
    "limitation traitement": "limitationManuelle",
    "anticoagulation": "anticoagulation",
    "traitement": "traitementAnticoagulation",
    "grossesse": "grossesse",
    "trimestre": "trimestreGrossesse",
    "adaptations": "adaptationsGrossesse",
    "état général": "etatGeneral"
  },
  "SECTION 9": {
    "motif articulaire": "motifArticulaire",
    "motif myofascial": "motifMyofascial",
    "motif neural": "motifNeural",
    "sensibilisation centrale": "sensibilisationCentrale",
    "contrôle sensorimoteur": "controleSensorimoteur"
  },
  "SECTION 10": {
    "fréquence thérapie": "frequence",
    "thérapie manuelle": "hasTherapieManuelle",
    "types tm": "typesTherapieManuelle",
    "thérapie par exercice": "hasExercices",
    "types exercices": "typesExercices",
    "thérapie par neurodynamique": "hasNeurodynamique",
    "types neuro": "typesNeurodynamique",
    "éducation patient": "hasEducation",
    "sujets éducation": "sujetsEducation",
    "modalités supplémentaires": "modalitesSup"
  },
  "SECTION 11": {
    "compréhension du diagnostic": "comprehensionDiagnostic",
    "inquiétudes": "inquietudes",
    "perception de gravité": "perceptionGravite",
    "auto-efficacité": "autoEfficacite",
    "croyance contrôle": "croyanceControle"
  },
  "SECTION 12": {
    "durée estimée traitement": "dureeTraitement",
    "nombre de séances": "nbSeances",
    "facteurs pronostiques positifs": "facteursPositifs",
    "facteurs pronostiques négatifs": "facteursNegatifs",
    "objectifs à court terme": "objectifsCourtTerme",
    "objectifs à long terme": "objectifsLongTerme",
    "attentes réalistes": "attentesRealistes",
    "attentes réalistes détails": "detailAttentes",
    "patient anticipe guérison": "anticipationGuerison",
    "yellow flags": "detailYellowFlags", // Direct mapping as no pipe separation
    "soutien social": "soutienSocial",
    "soutien social détails": "detailSoutien",
    "stresseurs": "stresseurs",
    "point de réévaluation": "pointReevaluation",
    "critères changement": "criteresChangement",
    "besoin orientation": "orientationSpecialise",
    "barrières anticipées": "barrieresTraitement"
  },
  "SECTION 13": {
    "activités quotidiennes": "activitesQuotidiennes", // Checkboxes
    "loisirs/sports": "loisirs",
    "activités antérieures": "activitesAnterieures",
    "actuellement": "activitesActuelles",
    "temps assis": "tempsAssis", // Gestion multiple sur une ligne possible
    "temps assis debout": "tempsDebout",
    "temps assis marche": "tempsMarche",
    "temps assis quotidien": "tempsAssisQuotidien",
    "écran": "tempsEcran",
    "comportement sédentaire": "sedentarite",
    "statut professionnel": "statutPro",
    "jours d'absence": "joursAbsence",
    "limitations professionnelles": "limitationsPro",
    "tâches impossibles": "tachesImpossibles",
    "tâches difficiles": "tachesDifficiles",
    "attentes retour": "attentesRetourTravail",
    "délai anticipé": "delaiRetourTravail",
    "confiance": "confianceRetourTravail",
    "modifications poste": "modifPoste",
    "type": "typeModifPoste"
  },
  "SECTION 14": {
    "défauts posturaux": "defautsPosturaux",
    "facteurs biomécaniques": "facteursBiomeca",
    "facteurs de style de vie": "facteursLifestyle",
    "facteurs hormonaux": "facteursHormonaux",
    "contexte de travail": "ergonomieTravail",
    "poste optimisé": "posteOptimise",
    "recommandations": "recommandationsErgonomie",
    "facteurs psychosociaux": "facteursPsycho",
    "système santé": "systemeSante",
    "conception biopsychosociale": "conceptionBiopsychosociale",
    "attentes culturelles": "attentesCulturelles",
    "attente guérison rapide": "attenteGuerisonRapide",
    "approche préférée": "approchePreferee",
    "compliance anticipée": "compliance",
    "barrières": "barrieresCompliance"
  },
  "SECTION 15": {
    "pgic": "pgic",
    "état": "etatPGIC",
    "treatment satisfaction": "satisfaction",
    "relation thérapeute": "relationTherapeute",
    "gas": "gasScore",
    "progression objectives": "progressionGAS"
  },
  "SECTION 16": {
    "résumé clinique": "resumeClinique",
    "observations globales": "observationsGlobales",
    "impression générale": "impressionGenerale",
    "notes supplémentaires": "notesSup",
    "plan de traitement": "planTraitement"
  },
  "SECTION 17": {
    "pathology": "pathology",
    "sources of symptoms": "sourcesOfSymptoms",
    "pain type": "painType",
    "impairments": "impairments",
    "pain mechanisms": "painMechanisms",
    "precautions": "precautions",
    "patients' perspectives": "patientPerspectives",
    "activity & participation": "activityParticipation",
    "contributing factors": "contributingFactors",
    "management & prognosis": "managementPrognosis"
  },
  "SECTION 18": {
    "confiance extraction": "confianceExtraction",
    "données complètes": "isComplete",
    "révision manuelle": "needsReview",
    "modifié par": "modifiePar",
    "date modification": "dateModification"
  }
};


export class PatientParser {

  private static cleanValue(raw: string): string | boolean | number | null {
    if (!raw) return null;
    let val = raw.trim();

    // Nettoyage des crochets vides ou placeholders
    if (val.startsWith("[") && val.endsWith("]")) val = val.slice(1, -1).trim();
    if (val === "" || val.toLowerCase().includes("à remplir")) return null;

    // Gestion Booléens
    const lower = val.toLowerCase();
    if (["oui", "yes", "true", "vrai"].includes(lower)) return true;
    if (["non", "no", "false", "faux"].includes(lower)) return false;

    // Tentative de conversion numérique propre
    // On nettoie d'abord les suffixes communs pour "récupérer juste le nombre" comme demandé
    const cleanVal = val.toLowerCase().replace(/\s*(ans|kg|cm|ans|years|kg|kg.|cm|cm.)\s*$/, "").trim();

    const num = Number(cleanVal);
    if (!isNaN(num) && cleanVal !== "" && !cleanVal.includes(" ")) return num;

    return val;
  }

  public static parse(fileContent: string): PatientData {
    const result: Partial<PatientData> = {};

    // Initialisation
    for (let i = 1; i <= 18; i++) {
      const key = `section${i}` as keyof PatientData;
      result[key] = {};
    }

    const lines = fileContent.split(/\r?\n/);
    let currentSectionNum: string | null = null;
    let currentSectionConfig: Record<string, string> | null = null;

    for (const line of lines) {
      const trimmedLine = line.trim();
      if (!trimmedLine) continue;

      // 1. DÉTECTION SECTION
      const sectionMatch = trimmedLine.match(/^={0,}\s*SECTION\s+(\d+)/i);
      if (sectionMatch) {
        currentSectionNum = sectionMatch[1];
        const configKey = `SECTION ${currentSectionNum}`;
        currentSectionConfig = PARSER_CONFIG[configKey] || null;
        continue;
      }

      if (!currentSectionConfig || !currentSectionNum) continue;

      const sectionKey = `section${currentSectionNum}` as keyof PatientData;
      const currentSection = result[sectionKey]!;

      // 2. EXTRACTION CLÉ-VALEUR
      if (trimmedLine.includes(":")) {
        // On cherche le séparateur principal.
        // Dans "Flexion Avant (cm/grade): 45...", c'est le premier ":"
        const separatorIndex = trimmedLine.indexOf(":");
        const rawKey = trimmedLine.substring(0, separatorIndex).trim().toLowerCase(); // ex: "flexion avant (cm/grade)"
        const rawValue = trimmedLine.substring(separatorIndex + 1); // ex: " 45 cm / Grade 4 | (NRS 0-10): 7"

        // RECHERCHE INTELLIGENTE DE LA CLÉ
        // On cherche quelle clé de config est contenue dans rawKey
        // Ex: config "flexion avant" est contenu dans "flexion avant (cm/grade)"
        const foundKey = Object.keys(currentSectionConfig)
          .filter(configKey => rawKey.includes(configKey.toLowerCase()))
          .sort((a, b) => b.length - a.length)[0]; // On prend le match le plus long

        if (foundKey) {
          const targetProp = currentSectionConfig[foundKey];

          // Détection et extraction des cases à cocher à l'intérieur de la valeur
          // Exemple: "☒ Sourde | ☐ Aiguë | ☒ Brûlante | ..."
          const checkboxRegex = /(☒|☑|☐|\[x\]|\[ \])\s*([^☒☑☐\[\]|:]+)/g;
          const checkedLabels: string[] = [];
          let m: RegExpExecArray | null;

          while ((m = checkboxRegex.exec(rawValue)) !== null) {
            const marker = m[1];
            const label = (m[2] || "").trim().replace(/[\.|,]$/g, "");
            const isChecked = marker === "☒" || marker === "☑" || marker.toLowerCase() === "[x]";
            if (isChecked && label) checkedLabels.push(label);
          }

          if (checkedLabels.length > 0) {
            currentSection[targetProp] = checkedLabels.length === 1 ? checkedLabels[0] : checkedLabels.join(", ");
          } else {
            // Checkbox détectés mais aucun coché -> on vérifie si c'est vraiment "vide" (tous uncheck)
            const hasCheckboxes = /(☒|☑|☐|\[x\]|\[ \])/.test(rawValue);
            if (hasCheckboxes) {
              currentSection[targetProp] = null;
            } else {
              currentSection[targetProp] = this.cleanValue(rawValue);
            }
          }

          // EXTRACTION DES CHAMPS SUPPLÉMENTAIRES (RESTORED)
          // Supporte aussi les champs en début de ligne (sans |) si c'est une sous-clé immédiate
          const additionalFieldsRegex = /(?:^|\|)\s*([^:|]+)(?::\s*([^|]+))?/g;
          let fieldMatch: RegExpExecArray | null;

          while ((fieldMatch = additionalFieldsRegex.exec(trimmedLine)) !== null) {
            const fieldName = (fieldMatch[1] || "").trim().toLowerCase();
            const rawFieldValue = (fieldMatch[2] || "").trim();

            if (fieldName) {
              const lowerField = fieldName.toLowerCase();
              let normalizedField = lowerField;

              if (lowerField.includes("nrs") || lowerField.includes("score")) normalizedField = "nrs";
              if (lowerField.includes("localisation")) normalizedField = "localisation";
              if (lowerField.includes("détail")) normalizedField = "détails";
              if (lowerField.includes("met")) normalizedField = "met";
              if (lowerField.includes("debout")) normalizedField = "debout";
              if (lowerField.includes("marche")) normalizedField = "marche";
              if (lowerField.includes("scores")) normalizedField = "scores";

              const contextSearchKey = `${foundKey} ${normalizedField}`.toLowerCase();

              const preciseContextKey = Object.keys(currentSectionConfig).find(k =>
                contextSearchKey === k.toLowerCase() ||
                k.toLowerCase().includes(contextSearchKey)
              );

              // Helper pour extraire la valeur (texte ou checkbox)
              const extractValue = (text: string) => {
                const checkboxRegexNested = /(☒|☑|☐|\[x\]|\[ \])\s*([^☒☑☐\[\]|:]+)/g;
                const nestedLabels: string[] = [];
                let mNested: RegExpExecArray | null;
                let foundCheckbox = false;

                while ((mNested = checkboxRegexNested.exec(text)) !== null) {
                  foundCheckbox = true;
                  const marker = mNested[1];
                  const label = (mNested[2] || "").trim().replace(/[\.|,]$/g, "");
                  const isChecked = marker === "☒" || marker === "☑" || marker.toLowerCase() === "[x]";
                  if (isChecked && label) nestedLabels.push(label);
                }

                if (foundCheckbox) {
                  if (nestedLabels.length === 0) return null;
                  return nestedLabels.length === 1 ? nestedLabels[0] : nestedLabels.join(", ");
                }
                return this.cleanValue(text);
              };

              if (preciseContextKey) {
                const additionalProp = currentSectionConfig[preciseContextKey];
                const extracted = rawFieldValue ? extractValue(rawFieldValue) : true;
                currentSection[additionalProp] = extracted;
              } else {
                const additionalFieldKey = Object.keys(currentSectionConfig).find(k => {
                  if (k.includes(" ") && !normalizedField.includes(" ")) return false;
                  return normalizedField.includes(k.toLowerCase()) ||
                    k.toLowerCase().includes(normalizedField) ||
                    fieldName.toLowerCase().includes(k.toLowerCase());
                });

                if (additionalFieldKey) {
                  const additionalProp = currentSectionConfig[additionalFieldKey];
                  if (additionalProp !== targetProp) {
                    currentSection[additionalProp] = rawFieldValue ? extractValue(rawFieldValue) : true;
                  }
                }
              }
            }
          }
        }
      }

      // 3. CHECKBOXES (Section 9, 13...)
      else if (
        trimmedLine.startsWith("☐") ||
        trimmedLine.startsWith("☑") ||
        trimmedLine.startsWith("☒") ||
        trimmedLine.startsWith("[x]") ||
        trimmedLine.startsWith("- [ ]") ||
        trimmedLine.startsWith("- [x]")
      ) {
        const lowerLine = trimmedLine.toLowerCase();

        // On cherche si un mot clé de la ligne correspond à la config
        const foundKey = Object.keys(currentSectionConfig).find(k => lowerLine.includes(k));

        if (foundKey) {
          const targetProp = currentSectionConfig[foundKey];

          // Extraction des labels cochés sur la ligne
          const checkboxRegex = /(☒|☑|☐|\[x\]|\[ \])\s*([^☒☑☐\[\]|:]+)/g;
          const allMatches = [...trimmedLine.matchAll(checkboxRegex)];
          const isSingleCheckbox = allMatches.length === 1;
          const checkedLabels: string[] = [];

          for (const m of allMatches) {
            const marker = m[1];
            let label = (m[2] || "").trim().replace(/[\.|,]$/g, "");
            const isChecked = marker === "☒" || marker === "☑" || marker.toLowerCase() === "[x]";

            if (isSingleCheckbox) {
              // Logique "Elément Seul" (Section 9 etc) : on capture tout (Oui/Non) et on nettoie le titre
              // On retire le titre (foundKey) du label pour éviter la répétition dans l'UI
              if (foundKey) {
                const keyRegex = new RegExp(foundKey.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
                label = label.replace(keyRegex, "").trim();
              }

              const prefix = isChecked ? "Oui" : "Non";
              // Si label reste vide après nettoyage (ex: juste le titre), on garde juste "Oui" ou "Non"
              const finalValue = label ? `${prefix} | ${label}` : prefix;
              checkedLabels.push(finalValue);
            } else {
              // Logique Liste Multiple (Section 13 etc) : on garde seulement si coché
              if (isChecked && label) checkedLabels.push(label);
            }
          }

          if (checkedLabels.length > 0) {
            currentSection[targetProp] = checkedLabels.length === 1 ? checkedLabels[0] : checkedLabels.join(", ");
          } else {
            // Pas de label trouvé coché/traité
            // Si c'est un Single Checkbox Unchecked, on l'a déjà capturé comme "Non | ..." donc on ne passe pas ici (sauf si bug)
            // Pour liste multiple sans coche -> null (N/A)
            currentSection[targetProp] = null;
          }

          // EXTRACTION DES CHAMPS SUPPLÉMENTAIRES APRÈS LES CASES À COCHER
          // Recherche de champs comme "Secteur:", "Localisation:" après les cases
          // Supporte aussi les champs sans ":" comme "localisation" après "|"
          // MODIFICATION: Supporte aussi les champs en début de ligne (sans |) si c'est une sous-clé immédiate
          const additionalFieldsRegex = /(?:^|\|)\s*([^:|]+)(?::\s*([^|]+))?/g;
          let fieldMatch: RegExpExecArray | null;

          while ((fieldMatch = additionalFieldsRegex.exec(trimmedLine)) !== null) {
            const fieldName = (fieldMatch[1] || "").trim().toLowerCase();
            const rawFieldValue = (fieldMatch[2] || "").trim();
            // ...

            if (fieldName) {
              const lowerField = fieldName.toLowerCase();
              let normalizedField = lowerField;

              // Normalisation des mots-clés communs pour éviter les problèmes de format (ex: "(NRS 0-10)")
              if (lowerField.includes("nrs") || lowerField.includes("score")) normalizedField = "nrs"; // "nrs" ou "score" -> nrs (flexion avant nrs)
              if (lowerField.includes("localisation")) normalizedField = "localisation";
              if (lowerField.includes("détail")) normalizedField = "détails"; // Uniformiser avec la config
              if (lowerField.includes("met")) normalizedField = "met";
              if (lowerField.includes("debout")) normalizedField = "debout";
              if (lowerField.includes("marche")) normalizedField = "marche";

              // CONFIGURATION SPECIALE POUR "SCORES" vs "NRS"
              // Si la config attend "scores" (ex: PSFS), on garde "scores"
              if (lowerField.includes("scores")) normalizedField = "scores";

              // 1. RECHERCHE CONTEXTUELLE : Clé principale + Nom du champ
              // Ex: "flexion avant" + "nrs" -> "flexion avant nrs"
              const contextSearchKey = `${foundKey} ${normalizedField}`.toLowerCase();

              const preciseContextKey = Object.keys(currentSectionConfig).find(k =>
                contextSearchKey === k.toLowerCase() ||
                // Pour "yellow flags détails" vs "yellow flags" + "détails"
                k.toLowerCase().includes(contextSearchKey)
              );

              // Helper pour extraire la valeur (texte ou checkbox)
              const extractValue = (text: string) => {
                const checkboxRegexNested = /(☒|☑|☐|\[x\]|\[ \])\s*([^☒☑☐\[\]|:]+)/g;
                const nestedLabels: string[] = [];
                let mNested: RegExpExecArray | null;
                let foundCheckbox = false;

                while ((mNested = checkboxRegexNested.exec(text)) !== null) {
                  foundCheckbox = true;
                  const marker = mNested[1];
                  const label = (mNested[2] || "").trim().replace(/[\.|,]$/g, "");
                  const isChecked = marker === "☒" || marker === "☑" || marker.toLowerCase() === "[x]";
                  if (isChecked && label) nestedLabels.push(label);
                }

                if (foundCheckbox) {
                  // Si on a détecté des checkboxes mais AUCUNE n'est cochée -> on retourne null (N/A)
                  if (nestedLabels.length === 0) return null;
                  return nestedLabels.length === 1 ? nestedLabels[0] : nestedLabels.join(", ");
                }
                return this.cleanValue(text);
              };

              if (preciseContextKey) {
                const additionalProp = currentSectionConfig[preciseContextKey];
                const extracted = rawFieldValue ? extractValue(rawFieldValue) : true;
                currentSection[additionalProp] = extracted;
              } else {
                const additionalFieldKey = Object.keys(currentSectionConfig).find(k => {
                  if (k.includes(" ") && !normalizedField.includes(" ")) return false;
                  return normalizedField.includes(k.toLowerCase()) ||
                    k.toLowerCase().includes(normalizedField) ||
                    fieldName.toLowerCase().includes(k.toLowerCase());
                });

                if (additionalFieldKey) {
                  const additionalProp = currentSectionConfig[additionalFieldKey];
                  if (additionalProp !== targetProp) {
                    // Si rawFieldValue est vide (ex: marqueur seul), on met true, sinon on extrait
                    currentSection[additionalProp] = rawFieldValue ? extractValue(rawFieldValue) : true;
                  }
                }
              }
            }
          }
        }
      }

      // 3. CHECKBOXES (Section 9, 13...)
      else if (
        trimmedLine.startsWith("☐") ||
        trimmedLine.startsWith("☑") ||
        trimmedLine.startsWith("[x]") ||
        trimmedLine.startsWith("- [ ]") ||
        trimmedLine.startsWith("- [x]")
      ) {
        const lowerLine = trimmedLine.toLowerCase();

        // On cherche si un mot clé de la ligne correspond à la config
        const foundKey = Object.keys(currentSectionConfig).find(k => lowerLine.includes(k));

        if (foundKey) {
          const targetProp = currentSectionConfig[foundKey];

          // Extraction des labels cochés sur la ligne
          const checkboxRegex = /(☒|☑|☐|\[x\]|\[ \])\s*([^☒☑☐\[\]|:]+)/g;
          const checkedLabels: string[] = [];
          let m: RegExpExecArray | null;
          while ((m = checkboxRegex.exec(trimmedLine)) !== null) {
            const marker = m[1];
            const label = (m[2] || "").trim().replace(/[\.|,]$/g, "");
            const isChecked = marker === "☒" || marker === "☑" || marker.toLowerCase() === "[x]";
            if (isChecked && label) checkedLabels.push(label);
          }

          if (checkedLabels.length > 0) {
            currentSection[targetProp] = checkedLabels.length === 1 ? checkedLabels[0] : checkedLabels;
          } else {
            // Pas de label trouvé, on marque la présence générale
            currentSection[targetProp] = true;
          }
        }
      }
    }

    return result as PatientData;
  }
}