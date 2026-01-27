export interface PatientData {
  admin: AdminSection;
  anthropo: AnthropoSection;
  pathologie: PathologieSection;
  symptomes: SymptomesSection;
  mecanismes: MecanismesSection;
  tests: TestsSection;
  scores: ScoresSection;
  redFlags: RedFlagsSection;
  mecanismesResume: MecanismesResumeSection;
  gestion: GestionSection;
  perspectives: PerspectivesSection;
  pronostic: PronosticSection;
  activites: ActivitesSection;
  facteurs: FacteursSection;
  satisfaction: SatisfactionSection;
  observations: ObservationsSection;
  hypothese: HypotheseSection;
  qualite: QualiteSection;
}

export interface AdminSection {
  nom: string;
  anneeNaiss: string;
  age: string;
  sexe: string;
  profession: string;
  secteur: string;
  kine: string;
  dateBilan: string;
  idPatient: string;
  idBilan: string;
}

export interface AnthropoSection {
  poids: string;
  taille: string;
  imc: string;
}

export interface PathologieSection {
  antecedents: string;
  episode: string;
  traumatisme: string;
  recidive: string;
  pireEpisode: string;
  duree: string;
  type: string;
}

export interface SymptomesSection {
  nrsRepos: string;
  nrsActivite: string;
  nrsMax: string;
  horaire: string;
  variation: string;
  aggravants: string;
  soulagants: string;
  evolution: string;
}

export interface MecanismesSection {
  articulaire: string;
  myofascial: string;
  neurologique: string;
  sensitization: string;
  sensorimotor: string;
  caractereNeurologique: string;
  observations: string;
}

export interface TestsSection {
  flexion: string;
  extension: string;
  inclinDroit: string;
  inclinGauche: string;
  rotationDroit: string;
  rotationGauche: string;
  combinaison: string;
  mobilitePA: string;
  hanche: string;
  slrDroit: string;
  slrGauche: string;
  sorensen: string;
  itoShirado: string;
  asymetrieSLR: string;
  slumpTest: string;
  pkb: string;
  forceMusculaire: string;
  reflexes: string;
  sensation: string;
  profilSensoriel: string;
  signeMeninges: string;
  tensionMusculaire: string;
  triggerPoints: string;
  sensibiliteSession: string;
  spasmeMusculaire: string;
  csiStrength: string;
  sidePlank: string;
  csm: string;
}

export interface ScoresSection {
  sbt: string;
  csi: string;
  odi: string;
  pcs: string;
  hadsAnxiete: string;
  hadsDepression: string;
  fabqTravail: string;
  fabqActivite: string;
  wai: string;
  ipaq: string;
  psfs: string;
  sf36: string;
  autresQuestionnaires: string;
}

export interface RedFlagsSection {
  detectes: string;
  lesquels: string;
  contraindications: string;
  allergies: string;
  medications: string;
  examensMedicaux: string;
  instabiliteRachidienne: string;
  limitationMT: string;
  anticoagulation: string;
  grossesse: string;
  etatGeneral: string;
}

export interface MecanismesResumeSection {
  motifArticulaire: string;
  motifMyofascial: string;
  motifNeural: string;
  sensibilisationCentrale: string;
  controleSensorimotor: string;
}

export interface GestionSection {
  frequence: string;
  therapieManuelle: string;
  typesMT: string;
  exercice: string;
  typesExercice: string;
  neurodynamique: string;
  education: string;
  sujetsEducation: string;
  modalites: string;
}

export interface PerspectivesSection {
  comprehension: string;
  perception: string;
  autoEfficacite: string;
}

export interface PronosticSection {
  dureeEstimee: string;
  nombreSeances: string;
  facteurPositif: string;
  facteurNegatif: string;
  objectifCourt: string;
  objectifLong: string;
  attentesRealistes: string;
  anticipationGuérison: string;
  yellowFlags: string;
  soutienSocial: string;
  stresseurs: string;
  reevaluation: string;
  orientationSpecialisee: string;
  barrieres: string;
}

export interface ActivitesSection {
  activitesLimitees: string;
  activitesAnterieures?: string;
  activitesActuelles?: string;
  tempsAssis: string;
  comportementSedentaire: string;
  statutProfessionnel: string;
  joursAbsence: string;
  limitationsProfessionnelles: string;
  delaiRetourTravail?: string;
  confianceRetourTravail?: string;
  modificationPoste: string;
}

export interface FacteursSection {
  defautsPosturaux: string;
  facteursBiomécaniques: string;
  styleVie: string;
  hormonal: string;
  posteOptimise?: string;
  recommandationsErgonomiques?: string;
  psychosociaux: string;
  systemeSante: string;
  attenteGuerison?: string;
  approchePreferee?: string;
  compliance?: string;
  complianceBarrieres?: string;
}

export interface SatisfactionSection {
  pgic: string;
  treatmentSatisfaction: string;
  gas: string;
}

export interface ObservationsSection {
  resume: string;
  observationsGlobales: string;
  impressionGenerale: string;
  notes: string;
  planTraitement: string;
}

export interface HypotheseSection {
  pathologie: string;
  sources: string;
  painType: string;
  impairments: string;
  painMechanisms: string;
  precautions: string;
  patientsPerspectives: string;
  activityParticipation: string;
  contributingFactors: string;
  managementPrognosis: string;
}

export interface QualiteSection {
  confiance: string;
  completude: string;
  revision: string;
  modifiePar: string;
  dateModif: string;
}
