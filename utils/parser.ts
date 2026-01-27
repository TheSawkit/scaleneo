import { PatientData } from "@/types/patient";

const VAL = "(?:\\[?([^\\]\\n]+)\\]?)";
const VAL_OR_REST = "(?:\\[?([^\\]\\n]*)[\\]]?)";

const SECTION_PATTERNS = {
  admin: {
    nom: /Nom et prénom du Patient\s*[:=\s]+(?:\[?([^\]\n]+)\]?)/iu,
    anneeNaiss: /Année de Naissance\s*[:=\s]+(?:\[?([^\]\n]+)\]?)/iu,
    age: /Age\s*[:=\s]+(?:\[?([^\]\n]+)\]?)/iu,
    sexe: /Sexe\s*[:=\s]+(?:\[?([MFmf]|Masculin|Féminin|Homme|Femme|.*)\]?)/iu,
    profession: /Profession\s*[:=\s]+(.*?)(?:\|?\s*☐?\s*Secteur)/iu,
    secteur: /Secteur\s*[:=\s]+(?:\[?([^\]\n]+)\]?)/iu,
    kine: /Kiné.*Examinateur\s*[:=\s]+(?:\[?([^\]\n]+)\]?)/iu,
    dateBilan: /Date Bilan\s*[:=\s]+(?:\[?([^\]\n]+)\]?)/iu,
    idPatient: /ID Patient\s*[:=\s]+(?:\[?([^\]\n]+)\]?)/iu,
    idBilan: /ID Bilan\s*[:=\s]+(?:\[?([^\]\n]+)\]?)/iu,
  },
  anthropo: {
    poids: /Poids\s*\(kg\)\s*[:=\s]+(?:\[?([^\]\n]+)\]?)/iu,
    taille: /Taille\s*\(cm\)\s*[:=\s]+(?:\[?([^\]\n]+)\]?)/iu,
    imc: /IMC\s*Calculé\s*[:=\s]+(?:\[?([^\]\n]+)\]?)/iu,
  },
  pathologie: {
    antecedents:
      /Antécédents LBP\s*\(Oui\/Non\)\s*[:=\s]+(?:\[?([^\]\n]+)\]?)/iu,
    episode: /Episode Initial\s*[:=\s]+(?:\[?([^\]\n]+)\]?)/iu,
    traumatisme:
      /Traumatisme[,\s]progressif ou spontané\s*[:=\s]+(?:\[?([^\]\n]+)\]?)/iu,
    recidive: /Récidive\s*\(Oui\/Non\)\s*[:=\s]+(?:\[?([^\]\n]+)\]?)/iu,
    pireEpisode: /Pire Episode\s*[:=\s]+(?:\[?([^\]\n]+)\]?)/iu,
    duree: /Durée Totale LBP\s*\(mois\)\s*[:=\s]+(?:\[?([^\]\n]+)\]?)/iu,
    type: /Type LBP\s*\(.*?\)\s*[:=\s]+(?:\[?([^\]\n]+)\]?)/iu,
  },
  symptomes: {
    nrsRepos: /NRS Douleur au Repos\s*[:=\s]+(?:\[?([^\]\n]+)\]?)/iu,
    nrsActivite: /NRS Douleur à l'Activité\s*[:=\s]+(?:\[?([^\]\n]+)\]?)/iu,
    nrsMax: /NRS Douleur Maximum\s*[:=\s]+(?:\[?([^\]\n]+)\]?)/iu,
    horaire: /Horaire Douleur\s*\(.*?\)\s*[:=\s]+(?:\[?([^\]\n]+)\]?)/iu,
    variation: /Variation Journalière\s*[:=\s]+(?:\[?([^\]\n]+)\]?)/iu,
    aggravants: /Facteurs Aggravants\s*[:=\s]+(?:\[?([^\]\n]+)\]?)/iu,
    soulagants: /Facteurs Soulageants\s*[:=\s]+(?:\[?([^\]\n]+)\]?)/iu,
    evolution: /Évolution\s*[:=\s]+(?:\[?([^\]\n]+)\]?)/iu,
  },
  mecanismes: {
    articulaire: /Douleur Articulaire\s*[:=\s]+(?:\[?([^\]\n]+)\]?)/iu,
    myofascial: /Douleur Myofasciale\s*[:=\s]+(?:\[?([^\]\n]+)\]?)/iu,
    neurologique: /Douleur Neurologique\s*[:=\s]+(?:\[?([^\]\n]+)\]?)/iu,
    sensitization: /Sensibilisation Centrale\s*.*[:=\s]+(?:\[?([^\]\n]+)\]?)/iu,
    sensorimotor: /Déficit Sensorimotor\s*[:=\s]+(?:\[?([^\]\n]+)\]?)/iu,
    caractereNeurologique: /Caractère sensations\s*[:=\s]+(.+)/iu,
    observations: /Observations Mécanismes\s*[:=\s]+(?:\[?([^\]\n]+)\]?)/iu,
  },
  tests: {
    flexion: /Flexion Avant\s*\(cm\/grade\)\s*[:=\s]+(?:\[?([^\]\n]+)\]?)/iu,
    extension: /Extension\s*\(cm\/grade\)\s*[:=\s]+(?:\[?([^\]\n]+)\]?)/iu,
    inclinDroit:
      /Inclinaison Latérale Droit\s*\(cm\/grade\)\s*[:=\s]+(?:\[?([^\]\n]+)\]?)/iu,
    inclinGauche:
      /Inclinaison Latérale Gauche\s*\(cm\/grade\)\s*[:=\s]+(?:\[?([^\]\n]+)\]?)/iu,
    rotationDroit:
      /Rotation droite\(degré\/grade\)\s*[:=\s]+(?:\[?([^\]\n]+)\]?)/iu,
    rotationGauche:
      /Rotation Gauche\(degré\/grade\)\s*[:=\s]+(?:\[?([^\]\n]+)\]?)/iu,
    combinaison:
      /Combinaison de mouvements\s*\(mouvements\/grade\)\s*[:=\s]+(?:\[?([^\]\n]+)\]?)/iu,
    mobilitePA:
      /Mobilité segmentaire PA\s*\(étage\/grade\)\s*[:=\s]+(?:\[?([^\]\n]+)\]?)/iu,
    hanche: /Hanche\s*\(mouvements\/grade\)\s*[:=\s]+(?:\[?([^\]\n]+)\]?)/iu,
    slrDroit: /SLR Droit\s*\(degrés\)\s*[:=\s]+(?:\[?([^\]\n]+)\]?)/iu,
    slrGauche: /SLR Gauche\s*\(degrés\)\s*[:=\s]+(?:\[?([^\]\n]+)\]?)/iu,
    asymetrieSLR: /Asymétrie SLR\s*[:=\s]+(?:\[?([^\]\n]+)\]?)/iu,
    slumpTest: /Slump test\s*\(degrés\)\s*[:=\s]+(.+)/iu,
    pkb: /PKB\s*\(degrés\)\s*[:=\s]+(.+)/iu,
    forceMusculaire:
      /Force musculaire\s*\(MRC scale 0-5\)\s*[:=\s]+(?:\[?([^\]\n]+)\]?)/iu,
    reflexes: /Réflexes\s*\(Oui\/Non\)\s*[:=\s]+(?:\[?([^\]\n]+)\]?)/iu,
    sensation: /Sensation.*Localisation\s*[:=\s]+(?:\[?([^\]\n]+)\]?)/iu,
    profilSensoriel: /Profil sensoriel\s*[:=\s]+(.+)/iu,
    signeMeninges: /Signes méningés\s*[:=\s]+(.+)/iu,
    tensionMusculaire: /Tension musculaire\s*[:=\s]+(.+)/iu,
    triggerPoints:
      /Trigger points.*Localisation\s*[:=\s]+(?:\[?([^\]\n]+)\]?)/iu,
    sensibiliteSession:
      /Hypersensibilité à la pression.*Zone lombaire\s*(?:\[?([^\]\n]+)\]?)/iu,
    spasmeMusculaire:
      /Spasme musculaire.*Localisation\s*[:=\s]+(?:\[?([^\]\n]+)\]?)/iu,
    sorensen: /Sorensen\s*\(secondes\)\s*[:=\s]+(?:\[?([^\]\n]+)\]?)/iu,
    itoShirado: /Ito Shirado\s*\(secondes\)\s*[:=\s]+(?:\[?([^\]\n]+)\]?)/iu,
    csiStrength: /Core Strength Index\s*[:=\s]+(?:\[?([^\]\n]+)\]?)/iu,
    sidePlank: /Side plank D\/G\s*\(secondes\)\s*[:=\s]+(?:\[?([^\]\n]+)\]?)/iu,
    csm: /CSM\s*\(Plank.*\)\s*[:=\s]+(?:\[?([^\]\n]+)\]?)/iu,
  },
  scores: {
    sbt: /SBT\s*\(STarT Back Screening Tool, 0-9\)\s*[:=\s]+(?:\[?([^\]\n]+)\]?)/iu,
    csi: /CSI Score\s*\(Central Sensitization Inventory, 0-100\)\s*[:=\s]+(?:\[?([^\]\n]+)\]?)/iu,
    odi: /ODI Score\s*\(Oswestry Disability Index, 0-100\)\s*[:=\s]+(?:\[?([^\]\n]+)\]?)/iu,
    pcs: /PCS Score\s*\(Pain Catastrophizing Scale, 0-52\)\s*[:=\s]+(?:\[?([^\]\n]+)\]?)/iu,
    hadsAnxiete:
      /HADS Score Anxiété\s*\(0-21\)\s*[:=\s]+(?:\[?([^\]\n]+)\]?)/iu,
    hadsDepression:
      /HADS Score Dépression\s*\(0-21\)\s*[:=\s]+(?:\[?([^\]\n]+)\]?)/iu,
    fabqTravail:
      /FABQ Score Travail\s*\(0-100\)\s*[:=\s]+(?:\[?([^\]\n]+)\]?)/iu,
    fabqActivite:
      /FABQ Score Activité\s*\(0-100\)\s*[:=\s]+(?:\[?([^\]\n]+)\]?)/iu,
    wai: /WAI Score\s*\(Work Ability Index, 0-100\)\s*[:=\s]+(?:\[?([^\]\n]+)\]?)/iu,
    ipaq: /IPAQ\s*\(International Physical Activity\).*MET\(min\/week\)\s*[:=\s]+(?:\[?([^\]\n]+)\]?)/iu,
    psfs: /PSFS\s*\(Patient-Specific Functional Scale, 0-10\).*Scores\s*[:=\s]+(?:\[?([^\]\n]+)\]?)/iu,
    sf36: /SF-36 ou EQ-5D\s*\(Qualité de vie\)\s*[:=\s]+(?:\[?([^\]\n]+)\]?)/iu,
    autresQuestionnaires:
      /Autres Questionnaires\s*[:=\s]+(?:\[?([^\]\n]+)\]?)/iu,
  },
  redFlags: {
    detectes:
      /Drapeaux Rouges Détectés\s*\(Oui\/Non\)\s*[:=\s]+(?:\[?([^\]\n]+)\]?)/iu,
    lesquels: /Si Oui, lesquels\s*[:=\s]+(?:\[?([^\]\n]+)\]?)/iu,
    contraindications: /Contre-Indications\s*[:=\s]+(?:\[?([^\]\n]+)\]?)/iu,
    allergies: /Allergies\s*[:=\s]+(?:\[?([^\]\n]+)\]?)/iu,
    medications: /Médications Pertinentes\s*[:=\s]+(?:\[?([^\]\n]+)\]?)/iu,
    examensMedicaux: /Examen médicaux\s*[:=\s]+(?:\[?([^\]\n]+)\]?)/iu,
    instabiliteRachidienne: /Instabilité rachidienne\s*[:=\s]+(.+)/iu,
    limitationMT: /Limitation traitement manuel\s*[:=\s]+(.+)/iu,
    anticoagulation: /Anticoagulation\/Trouble hémorragique\s*[:=\s]+(.+)/iu,
    grossesse: /Grossesse\s*[:=\s]+(.+)/iu,
    etatGeneral: /État général\s*[:=\s]+(.+)/iu,
  },
  mecanismesResume: {
    motifArticulaire: /Motif articulaire/iu,
    motifMyofascial: /Motif myofascial/iu,
    motifNeural: /Motif neural/iu,
    sensibilisationCentrale: /Sensibilisation centrale/iu,
    controleSensorimotor: /Contrôle sensorimoteur/iu,
  },
  gestion: {
    frequence:
      /Fréquence Thérapie\s*\(séances\/semaine\)\s*[:=\s]+(?:\[?([^\]\n]+)\]?)/iu,
    therapieManuelle:
      /Thérapie Manuelle\s*\(Oui\/Non\)\s*[:=\s]+(?:\[?([^\]\n]+)\]?)/iu,
    typesMT: /Types TM si Oui\s*[:=\s]+(?:\[?([^\]\n]+)\]?)/iu,
    exercice:
      /Thérapie par Exercice\s*\(Oui\/Non\)\s*[:=\s]+(?:\[?([^\]\n]+)\]?)/iu,
    typesExercice: /Types Exercices\s*[:=\s]+(?:\[?([^\]\n]+)\]?)/iu,
    neurodynamique:
      /Thérapie par Neurodynamique\s*\(Oui\/Non\)\s*[:=\s]+(?:\[?([^\]\n]+)\]?)/iu,
    education:
      /Éducation Patient\s*\(Oui\/Non\)\s*[:=\s]+(?:\[?([^\]\n]+)\]?)/iu,
    sujetsEducation: /Sujets Éducation\s*[:=\s]+(?:\[?([^\]\n]+)\]?)/iu,
    modalites: /Modalités Supplémentaires\s*[:=\s]+(?:\[?([^\]\n]+)\]?)/iu,
  },
  perspectives: {
    comprehension: /Compréhension du diagnostic par le patient\s*[:=\s]+(.+)/iu,
    perception: /Perception de gravité\s*[:=\s]+(.+)/iu,
    autoEfficacite: /Auto-efficacité face à la douleur\s*[:=\s]+(.+)/iu,
  },
  pronostic: {
    dureeEstimee: /Durée Estimée Traitement\s*.*[:=\s]+(?:\[?([^\]\n]+)\]?)/iu,
    nombreSeances: /Nombre de Séances Espérées\s*[:=\s]+(?:\[?([^\]\n]+)\]?)/iu,
    facteurPositif:
      /Facteurs Pronostiques Positifs\s*[:=\s]+(?:\[?([^\]\n]+)\]?)/iu,
    facteurNegatif:
      /Facteurs Pronostiques Négatifs\s*[:=\s]+(?:\[?([^\]\n]+)\]?)/iu,
    objectifCourt: /Objectifs à Court Terme\s*.*[:=\s]+(?:\[?([^\]\n]+)\]?)/iu,
    objectifLong: /Objectifs à Long Terme\s*.*[:=\s]+(?:\[?([^\]\n]+)\]?)/iu,
    attentesRealistes: /Attentes réalistes\s*[:=\s]+(.+)/iu,
    // TODO: Regex FIX ⬆️
    anticipationGuérison: /Patient anticipe guérison\s*[:=\s]+(.+)/iu,
    yellowFlags: /Yellow Flags\s*[:=\s]+(.+)/iu,
    soutienSocial: /Soutien social\s*[:=\s]+(.+)/iu,
    stresseurs: /Stresseurs identifiés\s*[:=\s]+(.+)/iu,
    reevaluation: /Point de réévaluation\s*[:=\s]+(?:\[?([^\]\n]+)\]?)/iu,
    orientationSpecialisee: /Besoin orientation spécialisée\s*[:=\s]+(.+)/iu,
    barrieres:
      /Barrières anticipées au traitement\s*[:=\s]+(?:\[?([^\]\n]+)\]?)/iu,
  },
  activites: {
    activitesLimitees: /Activités quotidiennes limitées\s*[:=\s]+(.+)/iu,
    activitesAnterieures: /Activités antérieures\s*[:=\s]+([^|\n]+)/iu,
    activitesActuelles: /\|\s*Actuellement\s*[:=\s]+(?:\[?([^\]\n]+)\]?)/iu,
    tempsAssis:
      /Temps assis\/debout toléré.*Assis\s*[:=\s]+(?:\[?([^\]\n]+)\]?)/iu,
    comportementSedentaire:
      /Comportement sédentaire.*Temps assis quotidien\s*[:=\s]+(?:\[?([^\]\n]+)\]?)/iu,
    statutProfessionnel: /Statut professionnel\s*[:=\s]+(.+)/iu,
    joursAbsence:
      /Jours d'absence.*Derniers 3 mois\s*[:=\s]+(?:\[?([^\]\n]+)\]?)/iu,
    limitationsProfessionnelles:
      /Limitations professionnelles.*Tâches impossibles\s*[:=\s]+(?:\[?([^\]\n]+)\]?)/iu,
    delaiRetourTravail: /Délai anticipé\s*[:=\s]+([^|\n]+)/iu,
    confianceRetourTravail: /\|\s*Confiance\s*[:=\s]+([^\n]+)/iu,
    modificationPoste: /Modifications poste possibles\s*[:=\s]+(.+)/iu,
  },
  facteurs: {
    defautsPosturaux: /Défauts posturaux identifiés\s*[:=\s]+(.+)/iu,
    facteursBiomécaniques: /Facteurs biomécaniques\s*[:=\s]+(.+)/iu,
    styleVie: /Facteurs de style de vie\s*[:=\s]+(.+)/iu,
    hormonal: /Facteurs hormonaux\/métaboliques\s*[:=\s]+(.+)/iu,
    posteOptimise: /Poste optimisé\s*[:=\s]+([^|\n]+)/iu,
    recommandationsErgonomiques:
      /\|\s*Recommandations\s*[:=\s]+(?:\[?([^\]\n]+)\]?)/iu,
    psychosociaux: /Facteurs psychosociaux majeurs\s*[:=\s]+(.+)/iu,
    systemeSante: /Système santé\/Culture\s*[:=\s]+(.+)/iu,
    attenteGuerison: /Attente guérison rapide\s*[:=\s]+([^|\n]+)/iu,
    approchePreferee: /\|\s*Approche préférée\s*[:=\s]+(?:\[?([^\]\n]+)\]?)/iu,
    compliance: /Compliance anticipée\s*[:=\s]+([^|\n]+)/iu,
    complianceBarrieres: /\|\s*Barrières\s*[:=\s]+(?:\[?([^\]\n]+)\]?)/iu,
  },
  satisfaction: {
    pgic: /PGIC\s*(?:\(.*\))?\s*[:=]\s*(?:\[?([^\]\n]+)\]?)/iu,
    treatmentSatisfaction:
      /Treatment Satisfaction\s*Score\s*(?:\([^)]+\))?\s*[:=]\s*(?:\[?([^|\]\n]+)\]?)/iu,
    relationTherapeute: /Relation thérapeute\s*[:=\s]+(?:\[?([^\]\n]+)\]?)/iu,
    gas: /GAS.*Progression objectives\s*[:=\s]+(.+)/iu,
  },
  observations: {
    resume: /Résumé Clinique\s*[:=\s]+(?:\[?([^\]\n]+)\]?)/iu,
    observationsGlobales:
      /Observations globales\s*[:=\s]+(?:\[?([^\]\n]+)\]?)/iu,
    impressionGenerale: /Impression Générale\s*[:=\s]+(?:\[?([^\]\n]+)\]?)/iu,
    notes: /Notes Supplémentaires\s*[:=\s]+(?:\[?([^\]\n]+)\]?)/iu,
    planTraitement:
      /Plan de traitement recommandé\s*[:=\s]+(?:\[?([^\]\n]+)\]?)/iu,
  },
  hypothese: {
    pathologie: /(?:1\.?\s*)?PATHOLOGY\s*[:=\s]+(?:\[?([^\]\n]+)\]?)/iu,
    sources: /(?:2\.?\s*)?SOURCES OF SYMPTOMS\s*[:=\s]+(?:\[?([^\]\n]+)\]?)/iu,
    painType: /(?:3\.?\s*)?PAIN TYPE\s*[:=\s]+(?:\[?([^\]\n]+)\]?)/iu,
    impairments: /(?:4\.?\s*)?IMPAIRMENTS\s*[:=\s]+(?:\[?([^\]\n]+)\]?)/iu,
    painMechanisms:
      /(?:5\.?\s*)?PAIN MECHANISMS\s*[:=\s]+(?:\[?([^\]\n]+)\]?)/iu,
    precautions: /(?:6\.?\s*)?PRECAUTIONS\s*[:=\s]+(?:\[?([^\]\n]+)\]?)/iu,
    patientsPerspectives:
      /(?:7\.?\s*)?PATIENTS.*PERSPECTIVES\s*[:=\s]+(?:\[?([^\]\n]+)\]?)/iu,
    activityParticipation:
      /(?:8\.?\s*)?ACTIVITY.*PARTICIPATION\s*[:=\s]+(?:\[?([^\]\n]+)\]?)/iu,
    contributingFactors:
      /(?:9\.?\s*)?CONTRIBUTING FACTORS\s*[:=\s]+(?:\[?([^\]\n]+)\]?)/iu,
    managementPrognosis:
      /(?:10\.?\s*)?MANAGEMENT.*PROGNOSIS\s*[:=\s]+(?:\[?([^\]\n]+)\]?)/iu,
  },
  qualite: {
    confiance:
      /Confiance Extraction\s*(?:\(estimée\s*%\))?\s*[:=]\s*(?:\[?([^\]\n]+)\]?)/iu,
    completude:
      /Données Complètes\s*(?:\(Oui\/Non\))?\s*[:=]\s*(?:\[?([^\]\n]+)\]?)/iu,
    revision:
      /Révision Manuelle\s*(?:Requise)?\s*(?:\(Oui\/Non\))?\s*[:=]\s*(?:\[?([^\]\n]+)\]?)/iu,
    modifiePar: /Modifié Par\s*[:=\s]+(?:\[?([^\]\n]+)\]?)/iu,
    dateModif: /Date Modification\s*[:=\s]+(?:\[?([^\]\n]+)\]?)/iu,
  },
};

const processValue = (raw: string): string => {
  if (!raw) return "";
  const trimmed = raw.trim();

  const hasCheckbox =
    /[\u2610\u2611\u2612]/.test(trimmed) || /\[\s*[xX]\s*\]/.test(trimmed);

  if (hasCheckbox) {
    const values: string[] = [];

    const checkedPattern =
      /(?:[\u2611\u2612]|\[\s*[xX]\s*\])\s*([^|☐\u2610\u2611\u2612\[\n]+)/gu;
    const matches = [...trimmed.matchAll(checkedPattern)];

    if (matches.length > 0) {
      values.push(...matches.map((m) => m[1].trim()));
    }

    const pipeFieldMatch = trimmed.match(
      /\|\s*(?:Autre|Autres|Type|Détail|Détails|Signes|Croyance contrôle|Inquiétudes|Confiance|Actuellement)\s*[:=\s]+([^\n]+)/iu,
    );
    if (pipeFieldMatch && pipeFieldMatch[1]) {
      values.push(pipeFieldMatch[1].trim());
    }

    return values.length > 0 ? values.join(", ") : "";
  }

  return trimmed;
};

const processHormonalValue = (raw: string): string => {
  if (!raw) return "";
  const trimmed = raw.trim();

  const checkedPattern =
    /(?:[\u2611\u2612]|\[\s*[xX]\s*\])\s*([^|☐\u2610\u2611\u2612\[\n]+)/gu;
  const matches = [...trimmed.matchAll(checkedPattern)];

  if (matches.length > 0) {
    const values = matches.map((m) => m[1].trim());
    return values.join(", ");
  }

  const autreMatch = trimmed.match(/\|\s*Autre\s*[:=\s]+([^\n]+)/iu);
  if (autreMatch && autreMatch[1]) {
    return autreMatch[1].trim();
  }

  return "";
};

const processStyleVieValue = (raw: string): string => {
  if (!raw) return "N/A";
  const trimmed = raw.trim();

  const checkedPattern =
    /(?:[\u2611\u2612]|\[\s*[xX]\s*\])\s*([^|☐\u2610\u2611\u2612\[\n]+)/gu;
  const matches = [...trimmed.matchAll(checkedPattern)];

  if (matches.length > 0) {
    const values = matches.map((m) => m[1].trim());
    return values.join(", ");
  }

  return "N/A";
};

export const parsePatientFile = (content: string): PatientData => {
  const data: any = {};

  for (const [sectionKey, fields] of Object.entries(SECTION_PATTERNS)) {
    data[sectionKey] = {};
    for (const [fieldKey, pattern] of Object.entries(fields)) {
      if (Array.isArray(pattern)) {
        for (const p of pattern) {
          const match = content.match(p);
          if (match && match[1]) {
            data[sectionKey][fieldKey] = processValue(match[1]);
            break;
          }
        }
      } else {
        const match = content.match(pattern as RegExp);
        if (match && match[1]) {
          if (sectionKey === "facteurs" && fieldKey === "hormonal") {
            data[sectionKey][fieldKey] = processHormonalValue(match[1]);
          } else if (sectionKey === "facteurs" && fieldKey === "styleVie") {
            data[sectionKey][fieldKey] = processStyleVieValue(match[1]);
          } else {
            data[sectionKey][fieldKey] = processValue(match[1]);
          }
        }
      }
    }
  }

  return data as PatientData;
};
