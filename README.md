# SCALENEO 🩺

[![Next.js](https://img.shields.io/badge/Next.js-15.1.4-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.0.0-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.x-06B6D4?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Recharts](https://img.shields.io/badge/Recharts-3.x-22B5BF?style=for-the-badge&logo=recharts&logoColor=white)](https://recharts.org/)
[![License](https://img.shields.io/badge/License-Private-red?style=for-the-badge)](LICENSE)

**SCALENEO** is a professional clinical tool designed for physiotherapists and clinicians to track, analyze, and visualize patient data for Low Back Pain (LBP) assessments. It automates data extraction from clinical reports and provides longitudinal analytics to improve patient follow-up and clinical decision-making.

---

## 🚀 Key Features

### 🔍 Smart Clinical Extraction

- **Declarative Parsing**: Robust engine to extract data from raw TXT clinical reports or JSON files.
- **Multi-Format Support**: Seamlessly handles various report structures with automated type conversion.
- **Template-Based**: Standardized template available for consistent data entry.

### 📊 Longitudinal Analytics

- **Metric Tracking**: Visualization of core clinical scores (ODI, CSI, Pain NRS, FABQ, HADS, WAI).
- **Interactive Charts**: Responsive line charts using Recharts to track progress over time.
- **MCID Reference**: Automatic visualization of Minimum Clinically Important Difference (MCID) for each metric.
- **Baseline Comparison**: Quick comparison of current status against the patient's initial baseline.

### 🧠 Clinical Intelligence

- **Red Flags Detection**: Automated search for 10 critical medical warning signs.
- **Hypothesis Generation**: Evidence-based clinical hypothesis selection based on patient profile and impairments.
- **Score Interpretation**: Color-coded severity levels for all standard clinical questionnaires.

### 📥 Professional Export

- **Multiple Formats**: Export patient assessments to CSV, XLSX (Excel), or JSON.
- **Structured Data**: Automatic flattening of nested clinical data for easy analysis in external tools.

---

## 🛠 Tech Stack

- **Framework**: [Next.js 15+](https://nextjs.org/) (App Router, Turbopack)
- **UI Components**: [Radix UI](https://www.radix-ui.com/) & [Lucide React](https://lucide.dev/)
- **Styling**: [Tailwind CSS 4.0](https://tailwindcss.com/)
- **Charts**: [Recharts](https://recharts.org/)
- **Excel Processing**: [XLSX](https://sheetjs.com/)
- **Type Safety**: [TypeScript](https://www.typescriptlang.org/)

---

## 📂 Project Structure

```text
scaleneo/
├── app/              # Next.js App Router (Pages, API Routes)
├── components/       # Reusable React components (Dashboard, UI)
├── lib/              # Shared libraries
├── public/           # Static assets (Templates, Documents)
├── utils/            # Core logic (Parser, Calculations, Helpers)
├── types/            # TypeScript interfaces
└── brain/            # Project documentation & tasks
```

---

## ⚙️ Getting Started

### Prerequisites

- Node.js 18.x or higher
- npm or pnpm

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/sawkit/scaleneo.git
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

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📄 License

This project is private and proprietary. All rights reserved.

---

Made with ❤️ by [sawkit](https://github.com/sawkit)
