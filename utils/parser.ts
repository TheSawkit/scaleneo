import {
  PatientData,
  JsonSection1,
  JsonSection2,
  JsonSection3,
  JsonSection4,
  JsonSection5,
  JsonSection6,
  JsonSection7,
  JsonSection8,
  JsonSection9,
  JsonSection10,
  JsonSection11,
  JsonSection12,
  JsonSection13,
  JsonSection14,
  JsonSection15,
  JsonSection16,
  JsonSection17,
  JsonSection18,
} from "@/types/patient";

const clean = (val: string | number | boolean | null | undefined): string => {
  if (
    val === undefined ||
    val === null ||
    val === "" ||
    (typeof val === "string" && val.trim() === "")
  ) {
    return "À remplir";
  }
  if (typeof val !== "string") return String(val);
  return val
    .replace(/'e9/g, "é")
    .replace(/'e8/g, "è")
    .replace(/'f4/g, "ô")
    .replace(/'e0/g, "à")
    .replace(/'e2/g, "â")
    .replace(/'b0/g, "°")
    .replace(/'b2/g, "²")
    .replace(/'eb/g, "ë")
    .replace(/'ee/g, "î")
    .replace(/'ea/g, "ê")
    .replace(/'ef/g, "ï");
};

const getNRSBadge = (val: number | undefined | null): string => {
  if (val === undefined || val === null) return "";
  return `NRS ${val}/10`;
};

const mapJsonToPatientData = (json: {
  section1?: JsonSection1;
  section2?: JsonSection2;
  section3?: JsonSection3;
  section4?: JsonSection4;
  section5?: JsonSection5;
  section6?: JsonSection6;
  section7?: JsonSection7;
  section8?: JsonSection8;
  section9?: JsonSection9;
  section10?: JsonSection10;
  section11?: JsonSection11;
  section12?: JsonSection12;
  section13?: JsonSection13;
  section14?: JsonSection14;
  section15?: JsonSection15;
  section16?: JsonSection16;
  section17?: JsonSection17;
  section18?: JsonSection18;
}): PatientData => {
  const s1: JsonSection1 = json.section1 || {};
  const s2: JsonSection2 = json.section2 || {};
  const s3: JsonSection3 = json.section3 || {};
  const s4: JsonSection4 = json.section4 || {};
  const s5: JsonSection5 = json.section5 || {};
  const s6: JsonSection6 = json.section6 || {};
  const s7: JsonSection7 = json.section7 || {};
  const s8: JsonSection8 = json.section8 || {};
  const s9: JsonSection9 = json.section9 || {};
  const s10: JsonSection10 = json.section10 || {};
  const s11: JsonSection11 = json.section11 || {};
  const s12: JsonSection12 = json.section12 || {};
  const s13: JsonSection13 = json.section13 || {};
  const s14: JsonSection14 = json.section14 || {};
  const s15: JsonSection15 = json.section15 || {};
  const s16: JsonSection16 = json.section16 || {};
  const s17: JsonSection17 = json.section17 || {};
  const s18: JsonSection18 = json.section18 || {};

  return {
    admin: {
      nom: clean(s1.patient_nom_prenom),
      anneeNaiss: clean(s1.patient_annee_naissance),
      age: clean(s1.patient_age),
      sexe: clean(s1.patient_sexe),
      profession: clean(
        [
          s1.prof_manuel ? "Manuel" : "",
          s1.prof_non_manuel ? "Non-manuel" : "",
          s1.prof_hybride ? "Hybride" : "",
        ]
          .filter(Boolean)
          .join(", "),
      ),
      secteur: clean(s1.patient_profession_secteur),
      kine: clean(s1.kine_examinateur),
      dateBilan: clean(s1.date_bilan),
      idPatient: clean(s1.id_patient),
      idBilan: clean(s1.id_bilan),
    },
    anthropo: {
      poids: clean(s2.poids_kg + " kg"),
      taille: clean(s2.taille_cm + " cm"),
      imc:
        s2.imc_calcule !== undefined
          ? `${s2.imc_calcule} (${s2.imc_calcule < 18.5 ? "Insuffisance" : s2.imc_calcule < 25 ? "Normal" : s2.imc_calcule < 30 ? "Surpoids" : "Obésité"})`
          : "À remplir",
    },
    pathologie: {
      antecedents: s3.antecedents_lbp ? "Oui" : "Non",
      episode: clean(s3.episode_initial),
      traumatisme: clean(s3.traumatisme),
      recidive: s3.recidive ? "Oui" : "Non",
      pireEpisode: clean(s3.pire_episode),
      duree:
        s3.duree_totale_lbp_mois !== undefined
          ? clean(s3.duree_totale_lbp_mois + " mois")
          : "À remplir",
      type: clean(s3.type_lbp),
    },
    symptomes: {
      nrsRepos:
        s4.nrs_repos !== undefined
          ? `(${getNRSBadge(s4.nrs_repos)})`
          : "À remplir",
      nrsActivite:
        s4.nrs_activite !== undefined
          ? `(${getNRSBadge(s4.nrs_activite)})`
          : "À remplir",
      nrsMax:
        s4.nrs_maximum !== undefined
          ? `(${getNRSBadge(s4.nrs_maximum)})`
          : "À remplir",
      horaire: clean(s4.horaire_douleur),
      variation: clean(s4.variation_journaliere),
      aggravants: clean(s4.facteurs_aggravants),
      soulagants: clean(s4.facteurs_soulageants),
      evolution: clean(s4.evolution),
    },
    mecanismes: {
      articulaire: s5.douleur_articulaire ? "Oui" : "Non",
      myofascial: s5.douleur_myofasciale ? "Oui" : "Non",
      neurologique: s5.douleur_neurologique ? "Oui" : "Non",
      sensitization: clean(s5.sensibilisation_centrale_type),
      sensorimotor: s5.deficit_sensorimoteur ? "Oui" : "Non",
      caractereNeurologique: clean(
        [
          s5.caractere_sourde ? "Sourde" : "",
          s5.caractere_aigue ? "Aiguë" : "",
          s5.caractere_brulante ? "Brulante" : "",
          s5.caractere_piquante ? "Piquante" : "",
          s5.caractere_irradiante ? "Irradiante" : "",
          s5.caractere_engourdie ? "Engourdie" : "",
        ]
          .filter(Boolean)
          .join(", "),
      ),
      observations: clean(s5.observations_mecanismes),
    },
    tests: {
      flexion: clean(
        [
          s6.flexion_cm ? `${clean(s6.flexion_cm)} cm` : "",
          s6.flexion_grade ? `Grade ${clean(s6.flexion_grade)}` : "",
        ]
          .filter(Boolean)
          .join(" | ") +
          " " +
          (s6.flexion_nrs !== undefined
            ? `(${getNRSBadge(s6.flexion_nrs)})`
            : "(NRS 0/10)"),
      ).trim(),
      extension: clean(
        [
          s6.extension_cm ? `${clean(s6.extension_cm)} cm` : "",
          s6.extension_grade ? `Grade ${clean(s6.extension_grade)}` : "",
        ]
          .filter(Boolean)
          .join(" | ") +
          " " +
          (s6.extension_nrs !== undefined
            ? `(${getNRSBadge(s6.extension_nrs)})`
            : "(NRS 0/10)"),
      ).trim(),
      inclinDroit: clean(
        [
          s6.inclinaison_d_cm ? `${clean(s6.inclinaison_d_cm)} cm` : "",
          s6.inclinaison_d_grade
            ? `Grade ${clean(s6.inclinaison_d_grade)}`
            : "",
        ]
          .filter(Boolean)
          .join(" | ") +
          " " +
          (s6.inclinaison_d_nrs !== undefined
            ? `(${getNRSBadge(s6.inclinaison_d_nrs)})`
            : "(NRS 0/10)"),
      ).trim(),
      inclinGauche: clean(
        [
          s6.inclinaison_g_cm ? `${clean(s6.inclinaison_g_cm)} cm` : "",
          s6.inclinaison_g_grade
            ? `Grade ${clean(s6.inclinaison_g_grade)}`
            : "",
        ]
          .filter(Boolean)
          .join(" | ") +
          " " +
          (s6.inclinaison_g_nrs !== undefined
            ? `(${getNRSBadge(s6.inclinaison_g_nrs)})`
            : "(NRS 0/10)"),
      ).trim(),
      rotationDroit: clean(
        [
          s6.rotation_d_deg ? `${clean(s6.rotation_d_deg)}°` : "",
          s6.rotation_d_grade ? `Grade ${clean(s6.rotation_d_grade)}` : "",
        ]
          .filter(Boolean)
          .join(" | ") +
          " " +
          (s6.rotation_d_nrs !== undefined
            ? `(${getNRSBadge(s6.rotation_d_nrs)})`
            : "(NRS 0/10)"),
      ).trim(),
      rotationGauche: clean(
        [
          s6.rotation_g_deg ? `${clean(s6.rotation_g_deg)}°` : "",
          s6.rotation_g_grade ? `Grade ${clean(s6.rotation_g_grade)}` : "",
        ]
          .filter(Boolean)
          .join(" | ") +
          " " +
          (s6.rotation_g_nrs !== undefined
            ? `(${getNRSBadge(s6.rotation_g_nrs)})`
            : "(NRS 0/10)"),
      ).trim(),
      combinaison: clean(
        [clean(s6.combinaison_mouvements_grade)].filter(Boolean).join(" | ") +
          " " +
          (s6.combinaison_mouvements_nrs !== undefined
            ? `(${getNRSBadge(s6.combinaison_mouvements_nrs)})`
            : "(NRS 0/10)"),
      ).trim(),
      mobilitePA: clean(
        [clean(s6.mobilite_segmentaire_pa_etage_grade)]
          .filter(Boolean)
          .join(" | ") +
          " " +
          (s6.mobilite_segmentaire_pa_nrs !== undefined
            ? `(${getNRSBadge(s6.mobilite_segmentaire_pa_nrs)})`
            : "(NRS 0/10)"),
      ).trim(),
      hanche: clean(
        [clean(s6.hanche_mouvements_grade)].filter(Boolean).join(" | ") +
          " " +
          (s6.hanche_nrs !== undefined
            ? `(${getNRSBadge(s6.hanche_nrs)})`
            : "(NRS 0/10)"),
      ).trim(),
      slrDroit: clean(s6.slr_d_deg + "°"),
      slrGauche: clean(s6.slr_g_deg + "°"),
      asymetrieSLR: clean(s6.slr_asymetrie_deg + "°"),
      slumpTest: [
        s6.slump_complet ? "Complet" : "",
        s6.slump_limite ? "Limite" : "",
        s6.slump_modif_cerv ? "Modif Cerv" : "",
        s6.slump_modif_distance ? "Modif Distance" : "",
        s6.slump_asymetrie ? "Asymétrie" : "",
      ]
        .filter(Boolean)
        .join(", "),
      pkb: [
        s6.pkb_complet ? "Complet" : "",
        s6.pkb_limite ? "Limite" : "",
        s6.pkb_modif_cerv ? "Modif Cerv" : "",
        s6.pkb_modif_distance ? "Modif Distance" : "",
        s6.pkb_asymetrie ? "Asymétrie" : "",
      ]
        .filter(Boolean)
        .join(", "),
      forceMusculaire: clean(s6.force_musculaire_mrc),
      reflexes: clean(s6.reflexes_present),
      sensation:
        [
          s6.sensation_piquer_toucher ? "Piquer/Toucher" : "",
          s6.sensation_sensibilite_fine ? "Sensibilité fine" : "",
          s6.sensation_chaud_froid ? "Chaud/Froid" : "",
        ]
          .filter(Boolean)
          .join(", ") +
        (s6.sensation_localisation ? ` (${s6.sensation_localisation})` : ""),
      profilSensoriel: clean(
        [
          s6.profil_normal ? "Normal" : "",
          s6.profil_hypoesthesie ? "Hypoesthésie" : "",
          s6.profil_allodynie ? "Allodynie" : "",
          s6.profil_hyperalgesie ? "Hyperalgésie" : "",
        ]
          .filter(Boolean)
          .join(", "),
      ),
      signeMeninges: [
        s6.signes_meninges_negatifs ? "Négatifs" : "",
        s6.signes_meninges_kernig ? "Kernig" : "",
        s6.signes_meninges_brudzinski ? "Brudzinski" : "",
      ]
        .filter(Boolean)
        .join(", "),
      tensionMusculaire: clean(
        [
          s6.tension_normale ? "Normale" : "",
          s6.tension_legere ? "Légère" : "",
          s6.tension_importante ? "Importante" : "",
        ]
          .filter(Boolean)
          .join(", "),
      ),
      triggerPoints: clean(
        [
          s6.trigger_points_absent ? "Absent" : "",
          s6.trigger_points_present ? "Présent" : "",
        ]
          .filter(Boolean)
          .join(", ") +
          (s6.trigger_points_localisation
            ? ` (${clean(s6.trigger_points_localisation)})`
            : ""),
      ),
      sensibiliteSession: clean(
        (clean(s6.hypersensibilite_lombaire) || "") +
          (s6.hypersensibilite_controle
            ? ` / ${clean(s6.hypersensibilite_controle)}`
            : ""),
      ),
      spasmeMusculaire: clean(
        [
          s6.spasme_absent ? "Absent" : "",
          s6.spasme_present ? "Present" : "",
          s6.spasme_fatiguabilite ? "Fatiguabilité" : "",
        ]
          .filter(Boolean)
          .join(", ") +
          (s6.spasme_localisation ? ` (${clean(s6.spasme_localisation)})` : ""),
      ),
      sorensen: clean(s6.sorensen_sec + " secondes"),
      itoShirado: clean(s6.ito_shirado_sec + " secondes"),
      csiStrength: clean(s6.core_strength_index),
      sidePlank: clean(
        `${clean(s6.side_plank_d_sec)} secondes / ${clean(s6.side_plank_g_sec)} secondes`,
      ),
      csm: clean(s6.csm_commentaire),
    },
    scores: {
      sbt: clean(s7.sbt_score + "/9"),
      csi: clean(s7.csi_score + "/100"),
      odi: clean(s7.odi_score + "/100"),
      pcs: clean(s7.pcs_score + "/52"),
      hadsAnxiete: clean(s7.hads_anxiete + "/21"),
      hadsDepression: clean(s7.hads_depression + "/21"),
      fabqTravail: clean(s7.fabq_travail + "/100"),
      fabqActivite: clean(s7.fabq_activite + "/100"),
      wai: clean(s7.wai_score + "/100"),
      ipaq: clean(
        [
          s7.ipaq_sedentaire ? "Sédentaire" : "",
          s7.ipaq_modere ? "Modéré" : "",
          s7.ipaq_vigoureux ? "Vigoureux" : "",
        ]
          .filter(Boolean)
          .join(", ") + ` (${clean(s7.ipaq_met_min_week)} MET)`,
      ),
      psfs: clean(
        [
          s7.psfs_activite1
            ? `${clean(s7.psfs_activite1)}: ${clean(s7.psfs_score1 + "/10")}`
            : "",
          s7.psfs_activite2
            ? `${clean(s7.psfs_activite2)}: ${clean(s7.psfs_score2 + "/10")}`
            : "",
          s7.psfs_activite3
            ? `${clean(s7.psfs_activite3)}: ${clean(s7.psfs_score3 + "/10")}`
            : "",
        ]
          .filter(Boolean)
          .join("\n"),
      ),
      sf36: clean(s7.qualite_vie + "/100"),
      autresQuestionnaires: s7.autres_questionnaires
        ? clean(s7.autres_questionnaires)
        : "N/A",
    },
    redFlags: {
      detectes: s8.drapeaux_rouges
        ? `Oui${s8.drapeaux_rouges_details ? `, ${clean(s8.drapeaux_rouges_details)}` : ""}`
        : "Non",
      contraindications: clean(s8.contre_indications),
      allergies: clean(s8.allergies),
      medications: clean(s8.medications),
      examensMedicaux: clean(s8.examens_medicaux),
      instabiliteRachidienne: clean(
        [
          s8.instabilite_a_verifier ? "À vérifier" : "",
          s8.instabilite_presente ? "Présente" : "",
          s8.instabilite_suspectee ? "Suspectée" : "",
        ]
          .filter(Boolean)
          .join(", ") +
          (s8.instabilite_signes ? ` (${clean(s8.instabilite_signes)})` : ""),
      ),
      limitationMT: clean(
        [
          s8.limitation_manipulation_contre_indiquee
            ? "Manipulation contre-indiquée"
            : "",
          s8.limitation_mobilisation_legere
            ? "Mobilisation légère seulement"
            : "",
          s8.limitation_pas_de_limite ? "Pas de limite" : "",
        ]
          .filter(Boolean)
          .join(", "),
      ),
      anticoagulation: s8.anticoagulation
        ? `Oui${s8.anticoagulation_traitement ? `, ${clean(s8.anticoagulation_traitement)}` : ""}`
        : "Non",
      grossesse: clean(
        [s8.grossesse_na ? "N/A" : "", s8.grossesse_oui ? "Oui" : ""]
          .filter(Boolean)
          .join(", ") +
          (s8.grossesse_adaptations
            ? ` (${clean(s8.grossesse_adaptations)})`
            : ""),
      ),
      etatGeneral: clean(
        [
          s8.etat_general_stable ? "Stable" : "",
          s8.etat_general_consultation_recommandee
            ? "Consultation médicale recommandée"
            : "",
        ]
          .filter(Boolean)
          .join(", "),
      ),
    },
    mecanismesResume: {
      motifArticulaire: s9.motif_articulaire ? "Oui" : "Non",
      motifMyofascial: s9.motif_myofascial ? "Oui" : "Non",
      motifNeural: s9.motif_neural ? "Oui" : "Non",
      sensibilisationCentrale: s9.sensibilisation_centrale ? "Oui" : "Non",
      controleSensorimotor: s9.controle_sensorimoteur ? "Oui" : "Non",
    },
    gestion: {
      frequence: clean(s10.frequence_seances_par_semaine),
      therapieManuelle: s10.tm_oui
        ? `Oui${s10.tm_types ? `, ${clean(s10.tm_types)}` : ""}`
        : "Non",
      exercice: s10.exercice_oui
        ? `Oui${s10.exercice_types ? `, ${clean(s10.exercice_types)}` : ""}`
        : "Non",
      neurodynamique: s10.neurodynamique
        ? `Oui${s10.neurodynamique_types ? `, ${clean(s10.neurodynamique_types)}` : ""}`
        : "Non",
      education: s10.education_patient_oui
        ? `Oui${s10.education_sujets ? `, ${clean(s10.education_sujets)}` : ""}`
        : "Non",
      modalites: clean(s10.modalites_supplementaires),
    },
    perspectives: {
      comprehension: clean(
        [
          s11.comprehension_oui ? "Oui" : "",
          s11.comprehension_partielle ? "Partiellement" : "",
          s11.comprehension_non ? "Non" : "",
          s11.inquietudes ? `(Inquiétudes: ${clean(s11.inquietudes)})` : "",
        ]
          .filter((val) => val && val !== "À remplir")
          .join(" "),
      ),
      perception: clean(
        [
          s11.perception_benigne ? "Bénigne" : "",
          s11.perception_moderee ? "Modérée" : "",
          s11.perception_grave ? "Grave" : "",
          s11.perception_catastrophe ? "Catastrophe" : "",
        ]
          .filter(Boolean)
          .join(", "),
      ),
      autoEfficacite: clean(
        [
          s11.auto_eff_faible ? "Faible" : "",
          s11.auto_eff_moderee ? "Modérée" : "",
          s11.auto_eff_bonne ? "Bonne" : "",
          s11.croyance_controle
            ? `(Contrôle: ${clean(s11.croyance_controle)})`
            : "",
        ]
          .filter((val) => val && val !== "À remplir")
          .join(" "),
      ),
    },
    pronostic: {
      dureeEstimee: clean(s12.duree_estimee),
      nombreSeances: clean(s12.nb_seances_esperees),
      facteurPositif: clean(s12.facteurs_pronostiques_positifs),
      facteurNegatif: clean(s12.facteurs_pronostiques_negatifs),
      objectifCourt: clean(s12.objectifs_court_terme),
      objectifLong: clean(s12.objectifs_long_terme),
      attentesRealistes: clean(
        [
          s12.attentes_oui ? "Oui" : "",
          s12.attentes_partiellement ? "Partiellement" : "",
          s12.attentes_non ? "Non" : "",
          s12.attentes_realistes_detail
            ? `(${clean(s12.attentes_realistes_detail)})`
            : "",
        ]
          .filter((val) => val && val !== "À remplir")
          .join(" "),
      ),
      anticipationGuérison: clean(
        [
          s12.anticipation_complete ? "Complète" : "",
          s12.anticipation_partielle ? "Partielle" : "",
          s12.anticipation_chronique ? "Chronique" : "",
        ]
          .filter(Boolean)
          .join(", "),
      ),
      yellowFlags: s12.yellow_flags
        ? `Oui, ${clean(s12.yellow_flags_details)}`
        : "Non",
      soutienSocial: clean(
        [
          s12.soutien_bon ? "Bon" : "",
          s12.soutien_modere ? "Modéré" : "",
          s12.soutien_faible ? "Faible" : "",
          s12.soutien_social_detail
            ? `(${clean(s12.soutien_social_detail)})`
            : "",
        ]
          .filter((val) => val && val !== "À remplir")
          .join(" "),
      ),
      stresseurs: clean(
        [
          s12.stresseurs_travail ? "Travail" : "",
          s12.stresseurs_famille ? "Famille" : "",
          s12.stresseurs_financier ? "Financier" : "",
          clean(s12.stresseurs_autre),
          s12.stresseurs_detail ? `(${clean(s12.stresseurs_detail)})` : "",
        ]
          .filter((val) => val && val !== "À remplir")
          .join(", "),
      ),
      reevaluation: clean(
        [
          s12.revaluation_semaine !== undefined
            ? `S${clean(s12.revaluation_semaine)}`
            : "",
          s12.revaluation_criteres
            ? `(${clean(s12.revaluation_criteres)})`
            : "",
        ]
          .filter((val) => val && val !== "À remplir")
          .join(" "),
      ),
      orientationSpecialisee: clean(
        [
          s12.orientation_specialisee ? "Spécialisée" : "",
          s12.orientation_psychologue ? "Psychologue" : "",
          s12.orientation_medecin ? "Médecin" : "",
          clean(s12.orientation_autre),
        ]
          .filter((val) => val && val !== "À remplir")
          .join(", "),
      ),
      barrieres: clean(s12.barrieres_anticipees),
    },
    activites: {
      activitesLimitees: clean(
        [
          s13.limitation_marche ? "Marche" : "",
          s13.limitation_assise ? "Assise" : "",
          s13.limitation_levage ? "Levage" : "",
          s13.limitation_escaliers ? "Escaliers" : "",
          s13.limitation_toilette ? "Toilette" : "",
          s13.limitation_sexualite ? "Sexualité" : "",
          s13.limitation_sommeil ? "Sommeil" : "",
        ]
          .filter(Boolean)
          .join(", "),
      ),
      activitesAnterieures: clean(s13.loisirs_anterieurs),
      activitesActuelles: clean(s13.loisirs_actuels),
      tempsAssis: clean(
        `${clean(s13.temps_assis_min)} minutes assis \n${clean(s13.temps_debout_min)} minutes debout \n${clean(s13.temps_marche_min)} minutes marche`,
      ),
      comportementSedentaire: clean(
        `${clean(s13.temps_sedentaire_heures)}h sédentaire \n${clean(s13.temps_ecran_heures)}h écran`,
      ),
      statutProfessionnel: clean(
        [
          s13.statut_actif ? "Actif" : "",
          s13.statut_conge_maladie ? "Congé maladie" : "",
          s13.statut_incapacite ? "Incapacité" : "",
          s13.statut_arret ? "Arrêt" : "",
          s13.statut_sans_activite ? "Sans activité / Retraité" : "",
        ]
          .filter(Boolean)
          .join(", "),
      ),
      joursAbsence: clean(
        `${clean(s13.jours_absence_3m)} jours (< 3 mois) \n${clean(s13.jours_absence_6m)} jours (< 6 mois)`,
      ),
      limitationsProfessionnelles: clean(
        [
          s13.taches_impossibles
            ? `Impossibles: ${clean(s13.taches_impossibles)}`
            : "",
          s13.taches_difficiles
            ? `Difficiles: ${clean(s13.taches_difficiles)}`
            : "",
        ]
          .filter(Boolean)
          .join(", "),
      ),
      delaiRetourTravail: clean(s13.retour_travail_delai),
      confianceRetourTravail: clean(
        [
          s13.retour_travail_conf_elevee ? "Élevée" : "",
          s13.retour_travail_conf_moderee ? "Modérée" : "",
          s13.retour_travail_conf_faible ? "Faible" : "",
        ]
          .filter(Boolean)
          .join(", "),
      ),
      modificationPoste: clean(
        (s13.modifications_poste ? "Oui" : "Non") +
          (s13.modifications_poste_type
            ? ` (${clean(s13.modifications_poste_type)})`
            : ""),
      ),
    },
    facteurs: {
      defautsPosturaux: clean(
        [
          s14.defaut_hyperlordose ? "Hyperlordose" : "",
          s14.defaut_dos_plat ? "Dos plat" : "",
          s14.defaut_scoliose ? "Scoliose" : "",
          s14.defaut_tete_antepulse ? "Tête antépulsée" : "",
          s14.defaut_bassin_anteverse ? "Bassin antéversé" : "",
        ]
          .filter(Boolean)
          .join(", "),
      ),
      facteursBiomécaniques: clean(
        [
          s14.facteur_biomec_charge ? "Charge de travail" : "",
          s14.facteur_biomec_posture ? "Posture" : "",
          s14.facteur_biomec_mvt_repete ? "Mouvement répété" : "",
          s14.facteur_biomec_vibrations ? "Vibrations" : "",
          clean(s14.facteur_biomec_autre),
        ]
          .filter(Boolean)
          .join(", "),
      ),
      styleVie: clean(
        [
          s14.style_vie_tabac ? "Tabac" : "",
          s14.style_vie_alcool ? "Alcool" : "",
          s14.style_vie_obesite ? "Obésité" : "",
          s14.style_vie_inactivite ? "Inactivité" : "",
          s14.style_vie_sommeil ? "Sommeil" : "",
          s14.style_vie_nutrition ? "Nutrition" : "",
        ]
          .filter(Boolean)
          .join(", "),
      ),
      hormonal: clean(
        [
          s14.facteur_hormo_menopause ? "Ménopause" : "",
          s14.facteur_hormo_diabete ? "Diabète" : "",
          s14.facteur_hormo_thyroide ? "Thyroïde" : "",
          s14.facteur_hormo_inflammation ? "Inflammation" : "",
          clean(s14.facteur_hormo_autre),
        ]
          .filter(Boolean)
          .join(", "),
      ),
      posteOptimise:
        (s14.poste_ergonomique_optimise ? "Oui" : "Non") +
        (s14.poste_ergonomique_recommandations
          ? ` (${clean(s14.poste_ergonomique_recommandations)})`
          : ""),
      psychosociaux: clean(
        [
          s14.psycho_peur_evitement ? "Peur/Evitement" : "",
          s14.psycho_catastrophisme ? "Catastrophisme" : "",
          s14.psycho_depression ? "Dépression" : "",
          s14.psycho_anxiete ? "Anxiété" : "",
          s14.psycho_stress ? "Stress" : "",
        ]
          .filter((val) => val && val !== "À remplir")
          .join(", "),
      ),
      systemeSante: clean(
        [
          s14.conception_bien_comprise ? "Bien comprise" : "",
          s14.conception_a_developper ? "À développer" : "",
        ]
          .filter(Boolean)
          .join(", "),
      ),
      attenteGuerison:
        (s14.attente_guerison_rapide ? "Oui" : "Non") +
        (s14.attente_approche_preferee
          ? ` (${clean(s14.attente_approche_preferee)})`
          : ""),
      compliance: clean(
        [
          s14.compliance_bonne ? "Bonne" : "",
          s14.compliance_moderee ? "Modérée" : "",
          s14.compliance_a_questionner ? "À questionner" : "",
        ]
          .filter(Boolean)
          .join(", "),
      ),
      complianceBarrieres: clean(s14.compliance_barrieres),
    },
    satisfaction: {
      pgic: clean(
        `${s15.pgic_score !== null ? clean(s15.pgic_score) : "?"}/7 (${[
          s15.pgic_gueri ? "Guéri" : "",
          s15.pgic_mieux ? "Mieux" : "",
          s15.pgic_pareil ? "Pareil" : "",
          s15.pgic_pire ? "Pire" : "",
        ]
          .filter(Boolean)
          .join(", ")})`,
      ),
      treatmentSatisfaction:
        s15.satisfaction_score !== null
          ? clean(s15.satisfaction_score + "/100")
          : "?/100",
      relationTherapeute: clean(
        [
          s15.relation_tres_bonne ? "Très bonne" : "",
          s15.relation_bonne ? "Bonne" : "",
          s15.relation_a_ameliorer ? "À améliorer" : "",
        ]
          .filter(Boolean)
          .join(", ") || "À remplir",
      ),
      gas: clean(
        [
          s15.gas_non_atteint ? "Non atteint" : "",
          s15.gas_partiellement ? "Partiellement" : "",
          s15.gas_atteint ? "Atteint" : "",
        ]
          .filter(Boolean)
          .join(", ") || "À remplir",
      ),
    },
    observations: {
      resume: clean(s16.resume_clinique),
      observationsGlobales: clean(s16.observations_globales),
      impressionGenerale: clean(s16.impression_generale),
      notes: clean(s16.notes_supplementaires),
      planTraitement: clean(s16.plan_traitement_recommande),
    },
    hypothese: {
      pathologie: clean(s17.pathology),
      sources: clean(s17.sources_symptoms),
      painType: clean(s17.pain_type),
      impairments: clean(s17.impairments),
      painMechanisms: clean(s17.pain_mechanisms),
      precautions: clean(s17.precautions),
      patientsPerspectives: clean(s17.patients_perspectives),
      activityParticipation: clean(s17.activity_participation),
      contributingFactors: clean(s17.contributing_factors),
      managementPrognosis: clean(s17.management_prognosis),
    },
    qualite: {
      confiance: clean(s18.confiance_extraction_pct + "%"),
      completude: s18.donnees_completes ? "Oui" : "Non",
      revision: s18.revision_manuelle_requise ? "Oui" : "Non",
      modifiePar: clean(s18.modifie_par),
      dateModif: clean(s18.date_modification),
    },
  };
};

export const parsePatientFile = (content: string): PatientData => {
  try {
    const json = JSON.parse(content);
    return mapJsonToPatientData(json);
  } catch {
    console.warn(
      "Content is not valid JSON, falling back to empty data or regex (if implemented)",
    );
    return {} as PatientData;
  }
};
