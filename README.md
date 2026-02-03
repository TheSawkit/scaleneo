# SCALENEO 🩺

[![Next.js](https://img.shields.io/badge/Next.js-15.1.4-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.0.0-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.x-06B6D4?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Recharts](https://img.shields.io/badge/Recharts-3.x-22B5BF?style=for-the-badge&logo=recharts&logoColor=white)](https://recharts.org/)
[![License](https://img.shields.io/badge/License-Private-red?style=for-the-badge)](LICENSE)

[🇺🇸 English](#english) | [🇫🇷 Français](#français)

---

<a name="english"></a>

## 🇺🇸 English

**SCALENEO** is a professional clinical tool designed for physiotherapists and clinicians to track, analyze, and visualize patient data for Low Back Pain (LBP) assessments. It automates data extraction from clinical reports and provides longitudinal analytics to improve patient follow-up and clinical decision-making.

### 🚀 Key Features

#### 🔍 Smart Clinical Extraction

- **Declarative Parsing**: Robust engine to extract data from raw TXT clinical reports or JSON files.
- **Multi-Format Support**: Seamlessly handles various report structures with automated type conversion.
- **Template-Based**: Standardized template available for consistent data entry.

#### 📊 Longitudinal Analytics

- **Metric Tracking**: Visualization of core clinical scores (ODI, CSI, Pain NRS, FABQ, HADS, WAI).
- **Interactive Charts**: Responsive line charts using Recharts to track progress over time.
- **MCID Reference**: Automatic visualization of Minimum Clinically Important Difference (MCID) for each metric.
- **Baseline Comparison**: Quick comparison of current status against the patient's initial baseline.

#### 🧠 Clinical Intelligence

- **Red Flags Detection**: Automated search for 10 critical medical warning signs.
- **Hypothesis Generation**: Evidence-based clinical hypothesis selection based on patient profile and impairments.
- **Score Interpretation**: Color-coded severity levels for all standard clinical questionnaires.

#### 📥 Professional Export

- **Multiple Formats**: Export patient assessments to CSV, XLSX (Excel), or JSON.
- **Structured Data**: Automatic flattening of nested clinical data for easy analysis in external tools.

### 🛠 Tech Stack

- **Framework**: [Next.js 15+](https://nextjs.org/) (App Router, Turbopack)
- **UI Components**: [Radix UI](https://www.radix-ui.com/) & [Lucide React](https://lucide.dev/)
- **Styling**: [Tailwind CSS 4.0](https://tailwindcss.com/)
- **Charts**: [Recharts](https://recharts.org/)
- **Excel Processing**: [XLSX](https://sheetjs.com/)
- **Type Safety**: [TypeScript](https://www.typescriptlang.org/)

### ⚙️ Getting Started

#### Prerequisites

- Node.js 18.x or higher
- npm or pnpm

#### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/thesawkit/scaleneo.git
   cd scaleneo
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Run the development server:

   ```bash
   npm run dev
   ```

---

<a name="français"></a>

## 🇫🇷 Français

**SCALENEO** est un outil clinique professionnel conçu pour les kinésithérapeutes et les cliniciens afin de suivre, analyser et visualiser les données des patients pour les bilans de lombalgie (LBP). Il automatise l'extraction de données à partir de rapports cliniques et fournit des analyses longitudinales pour améliorer le suivi des patients et la prise de décision clinique.

### 🚀 Fonctionnalités Clés

#### 🔍 Extraction Clinique Intelligente

- **Parsing Déclaratif** : Moteur robuste pour extraire des données à partir de rapports cliniques TXT bruts ou de fichiers JSON.
- **Support Multi-Format** : Gère de manière transparente diverses structures de rapports avec conversion de type automatisée.
- **Basé sur un Modèle** : Modèle standardisé disponible pour une saisie de données cohérente.

#### 📊 Analyses Longitudinales

- **Suivi des Métriques** : Visualisation des scores cliniques de base (ODI, CSI, Pain NRS, FABQ, HADS, WAI).
- **Graphiques Interactifs** : Graphiques linéaires réactifs utilisant Recharts pour suivre les progrès au fil du temps.
- **Référence MCID** : Visualisation automatique de la Différence Cliniquement Importante Minimale (MCID) pour chaque métrique.
- **Comparaison de Base** : Comparaison rapide de l'état actuel avec l'état initial (baseline) du patient.

#### 🧠 Intelligence Clinique

- **Détection des "Red Flags"** : Recherche automatisée de 10 signes d'alerte médicale critiques.
- **Génération d'Hypothèses** : Sélection d'hypothèses cliniques basées sur des preuves en fonction du profil du patient et de ses déficiences.
- **Interprétation des Scores** : Niveaux de sévérité codés par couleur pour tous les questionnaires cliniques standards.

#### 📥 Export Professionnel

- **Plusieurs Formats** : Exportation des évaluations des patients vers CSV, XLSX (Excel) ou JSON.
- **Données Structurées** : Aplatissement automatique des données cliniques imbriquées pour une analyse facile dans des outils externes.

### 🛠 Stack Technique

- **Framework** : [Next.js 15+](https://nextjs.org/) (App Router, Turbopack)
- **Composants UI** : [Radix UI](https://www.radix-ui.com/) & [Lucide React](https://lucide.dev/)
- **Styling** : [Tailwind CSS 4.0](https://tailwindcss.com/)
- **Graphiques** : [Recharts](https://recharts.org/)
- **Traitement Excel** : [XLSX](https://sheetjs.com/)
- **Type Safety** : [TypeScript](https://www.typescriptlang.org/)

### ⚙️ Démarrage

#### Prérequis

- Node.js 18.x ou supérieur
- npm ou pnpm

#### Installation

1. Cloner le dépôt :

   ```bash
   git clone https://github.com/thesawkit/scaleneo.git
   cd scaleneo
   ```

2. Installer les dépendances :

   ```bash
   npm install
   ```

3. Lancer le serveur de développement :

   ```bash
   npm run dev
   ```

---

## 📄 License

This project is private and proprietary. All rights reserved.

---

Made with ❤️ by [sawkit](https://github.com/sawkit)
