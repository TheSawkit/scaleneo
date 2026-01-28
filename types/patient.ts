export interface JsonSection1 {
  patient_nom_prenom?: string;
  patient_annee_naissance?: string;
  patient_age?: string;
  patient_sexe?: string;
  prof_manuel?: number;
  prof_non_manuel?: number;
  prof_hybride?: number;
  patient_profession_secteur?: string;
  kine_examinateur?: string;
  date_bilan?: string;
  id_patient?: string;
  id_bilan?: string;
}

export interface JsonSection2 {
  poids_kg?: number;
  taille_cm?: number;
  imc_calcule?: number;
}

export interface JsonSection3 {
  antecedents_lbp?: boolean;
  episode_initial?: string;
  traumatisme?: string;
  recidive?: boolean;
  pire_episode?: string;
  duree_totale_lbp_mois?: number;
  type_lbp?: string;
}

export interface JsonSection4 {
  nrs_repos?: number;
  nrs_activite?: number;
  nrs_maximum?: number;
  horaire_douleur?: string;
  variation_journaliere?: string;
  facteurs_aggravants?: string;
  facteurs_soulageants?: string;
  evolution?: string;
}

export interface JsonSection5 {
  douleur_articulaire?: number;
  douleur_myofasciale?: number;
  douleur_neurologique?: number;
  sensibilisation_centrale_type?: string;
  deficit_sensorimoteur?: number;
  caractere_sourde?: number;
  caractere_aigue?: number;
  caractere_brulante?: number;
  caractere_piquante?: number;
  caractere_irradiante?: number;
  caractere_engourdie?: number;
  observations_mecanismes?: string;
}

export interface JsonSection6 {
  flexion_cm?: number;
  flexion_grade?: number;
  flexion_nrs?: number;
  extension_cm?: number;
  extension_grade?: number;
  extension_nrs?: number;
  inclinaison_d_cm?: number;
  inclinaison_d_grade?: number;
  inclinaison_d_nrs?: number;
  inclinaison_g_cm?: number;
  inclinaison_g_grade?: number;
  inclinaison_g_nrs?: number;
  rotation_d_deg?: number;
  rotation_d_grade?: number;
  rotation_d_nrs?: number;
  rotation_g_deg?: number;
  rotation_g_grade?: number;
  rotation_g_nrs?: number;
  combinaison_mouvements_grade?: string;
  combinaison_mouvements_nrs?: number;
  mobilite_segmentaire_pa_etage_grade?: string;
  mobilite_segmentaire_pa_nrs?: number;
  hanche_mouvements_grade?: string;
  hanche_nrs?: number;
  slr_d_deg?: number;
  slr_g_deg?: number;
  slr_asymetrie_deg?: number;
  slump_complet?: number;
  slump_limite?: number;
  slump_modif_cerv?: number;
  slump_modif_distance?: number;
  slump_asymetrie?: number;
  pkb_complet?: number;
  pkb_limite?: number;
  pkb_modif_cerv?: number;
  pkb_modif_distance?: number;
  pkb_asymetrie?: number;
  force_musculaire_mrc?: string;
  reflexes_present?: string;
  sensation_piquer_toucher?: number;
  sensation_sensibilite_fine?: number;
  sensation_chaud_froid?: number;
  sensation_localisation?: string;
  profil_normal?: number;
  profil_hypoesthesie?: number;
  profil_allodynie?: number;
  profil_hyperalgesie?: number;
  signes_meninges_negatifs?: number;
  signes_meninges_kernig?: number;
  signes_meninges_brudzinski?: number;
  tension_normale?: number;
  tension_legere?: number;
  tension_importante?: number;
  trigger_points_absent?: number;
  trigger_points_present?: number;
  trigger_points_localisation?: string;
  hypersensibilite_lombaire?: string;
  hypersensibilite_controle?: string;
  spasme_absent?: number;
  spasme_present?: number;
  spasme_fatiguabilite?: number;
  spasme_localisation?: string;
  sorensen_sec?: number;
  ito_shirado_sec?: number;
  core_strength_index?: number;
  side_plank_d_sec?: number;
  side_plank_g_sec?: number;
  csm_commentaire?: string;
}

export interface JsonSection7 {
  sbt_score?: number;
  csi_score?: number;
  odi_score?: number;
  pcs_score?: number;
  hads_anxiete?: number;
  hads_depression?: number;
  fabq_travail?: number;
  fabq_activite?: number;
  wai_score?: number;
  ipaq_sedentaire?: number;
  ipaq_modere?: number;
  ipaq_vigoureux?: number;
  ipaq_met_min_week?: number;
  psfs_activite1?: string;
  psfs_activite2?: string;
  psfs_activite3?: string;
  psfs_score1?: number;
  psfs_score2?: number;
  psfs_score3?: number;
  qualite_vie?: number;
  autres_questionnaires?: string;
}

export interface JsonSection8 {
  drapeaux_rouges?: boolean;
  drapeaux_rouges_details?: string;
  contre_indications?: string;
  allergies?: string;
  medications?: string;
  examens_medicaux?: string;
  instabilite_a_verifier?: number;
  instabilite_presente?: number;
  instabilite_suspectee?: number;
  instabilite_signes?: string;
  limitation_manipulation_contre_indiquee?: number;
  limitation_mobilisation_legere?: number;
  limitation_pas_de_limite?: number;
  anticoagulation?: boolean;
  anticoagulation_traitement?: string;
  grossesse_na?: number;
  grossesse_oui?: number;
  grossesse_adaptations?: string;
  etat_general_stable?: number;
  etat_general_consultation_recommandee?: number;
}

export interface JsonSection9 {
  motif_articulaire?: number;
  motif_myofascial?: number;
  motif_neural?: number;
  sensibilisation_centrale?: number;
  controle_sensorimoteur?: number;
}

export interface JsonSection10 {
  frequence_seances_par_semaine?: string;
  tm_oui?: number;
  tm_types?: string;
  exercice_oui?: number;
  exercice_types?: string;
  neurodynamique?: number;
  neurodynamique_types?: string;
  education_patient_oui?: number;
  education_sujets?: string;
  modalites_supplementaires?: string;
}

export interface JsonSection11 {
  comprehension_oui?: number;
  comprehension_partielle?: number;
  comprehension_non?: number;
  inquietudes?: string;
  perception_benigne?: number;
  perception_moderee?: number;
  perception_grave?: number;
  perception_catastrophe?: number;
  auto_eff_faible?: number;
  auto_eff_moderee?: number;
  auto_eff_bonne?: number;
  croyance_controle?: string;
}

export interface JsonSection12 {
  duree_estimee?: string;
  nb_seances_esperees?: string;
  facteurs_pronostiques_positifs?: string;
  facteurs_pronostiques_negatifs?: string;
  objectifs_court_terme?: string;
  objectifs_long_terme?: string;
  attentes_oui?: number;
  attentes_partiellement?: number;
  attentes_non?: number;
  attentes_realistes_detail?: string;
  anticipation_complete?: number;
  anticipation_partielle?: number;
  anticipation_chronique?: number;
  yellow_flags?: number;
  yellow_flags_details?: string;
  soutien_bon?: number;
  soutien_modere?: number;
  soutien_faible?: number;
  soutien_social_detail?: string;
  stresseurs_travail?: number;
  stresseurs_famille?: number;
  stresseurs_financier?: number;
  stresseurs_autre?: string;
  stresseurs_detail?: string;
  revaluation_semaine?: number;
  revaluation_criteres?: string;
  orientation_specialisee?: number;
  orientation_psychologue?: number;
  orientation_medecin?: number;
  orientation_autre?: string;
  barrieres_anticipees?: string;
}

export interface JsonSection13 {
  limitation_marche?: number;
  limitation_assise?: number;
  limitation_levage?: number;
  limitation_escaliers?: number;
  limitation_toilette?: number;
  limitation_sexualite?: number;
  limitation_sommeil?: number;
  loisirs_anterieurs?: string;
  loisirs_actuels?: string;
  temps_assis_min?: number;
  temps_debout_min?: number;
  temps_marche_min?: number;
  temps_sedentaire_heures?: number;
  temps_ecran_heures?: number;
  statut_actif?: number;
  statut_conge_maladie?: number;
  statut_incapacite?: number;
  statut_arret?: number;
  statut_sans_activite?: number;
  jours_absence_3m?: number;
  jours_absence_6m?: number;
  taches_impossibles?: string;
  taches_difficiles?: string;
  retour_travail_delai?: string;
  retour_travail_conf_elevee?: number;
  retour_travail_conf_moderee?: number;
  retour_travail_conf_faible?: number;
  modifications_poste?: number;
  modifications_poste_type?: string;
}

export interface JsonSection14 {
  defaut_hyperlordose?: number;
  defaut_dos_plat?: number;
  defaut_scoliose?: number;
  defaut_tete_antepulse?: number;
  defaut_bassin_anteverse?: number;
  facteur_biomec_charge?: number;
  facteur_biomec_posture?: number;
  facteur_biomec_mvt_repete?: number;
  facteur_biomec_vibrations?: number;
  facteur_biomec_autre?: string;
  style_vie_tabac?: number;
  style_vie_alcool?: number;
  style_vie_obesite?: number;
  style_vie_inactivite?: number;
  style_vie_sommeil?: number;
  style_vie_nutrition?: number;
  facteur_hormo_menopause?: number;
  facteur_hormo_diabete?: number;
  facteur_hormo_thyroide?: number;
  facteur_hormo_inflammation?: number;
  facteur_hormo_autre?: string;
  poste_ergonomique_optimise?: number;
  poste_ergonomique_recommandations?: string;
  psycho_peur_evitement?: number;
  psycho_catastrophisme?: number;
  psycho_depression?: number;
  psycho_anxiete?: number;
  psycho_stress?: number;
  conception_bien_comprise?: number;
  conception_a_developper?: number;
  attente_guerison_rapide?: number;
  attente_approche_preferee?: string;
  compliance_bonne?: number;
  compliance_moderee?: number;
  compliance_a_questionner?: number;
  compliance_barrieres?: string;
}

export interface JsonSection15 {
  pgic_score?: number | null;
  pgic_gueri?: number | null;
  pgic_mieux?: number | null;
  pgic_pareil?: number | null;
  pgic_pire?: number | null;
  satisfaction_score?: number | null;
  relation_tres_bonne?: number | null;
  relation_bonne?: number | null;
  relation_a_ameliorer?: number | null;
  gas_non_atteint?: number | null;
  gas_partiellement?: number | null;
  gas_atteint?: number | null;
}

export interface JsonSection16 {
  resume_clinique?: string;
  observations_globales?: string;
  impression_generale?: string;
  notes_supplementaires?: string;
  plan_traitement_recommande?: string;
}

export interface JsonSection17 {
  pathology?: string;
  sources_symptoms?: string;
  pain_type?: string;
  impairments?: string;
  pain_mechanisms?: string;
  precautions?: string;
  patients_perspectives?: string;
  activity_participation?: string;
  contributing_factors?: string;
  management_prognosis?: string;
}

export interface JsonSection18 {
  confiance_extraction_pct?: number;
  donnees_completes?: boolean;
  revision_manuelle_requise?: boolean;
  modifie_par?: string;
  date_modification?: string;
}

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
  exercice: string;
  neurodynamique: string;
  education: string;
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
  posteOptimise: string;
  psychosociaux: string;
  systemeSante: string;
  attenteGuerison?: string;
  compliance?: string;
  complianceBarrieres?: string;
}

export interface SatisfactionSection {
  pgic: string;
  treatmentSatisfaction: string;
  relationTherapeute: string;
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
