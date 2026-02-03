"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { PatientData } from "@/types/patient";

/**
 * Patient context type definition
 * Provides patient data state and raw content state to the application
 */
interface PatientContextType {
  patientData: PatientData | null;
  setPatientData: (data: PatientData | null) => void;
  rawContent: string;
  setRawContent: (content: string) => void;
}

const PatientContext = createContext<PatientContextType | undefined>(undefined);

/**
 * Patient Provider Component
 *
 * Manages global patient data state across the application
 * Provides both structured patient data and raw file content
 */
export function PatientProvider({ children }: { children: ReactNode }) {
  const [patientData, setPatientData] = useState<PatientData | null>(null);
  const [rawContent, setRawContent] = useState<string>("");

  return (
    <PatientContext.Provider
      value={{
        patientData,
        setPatientData,
        rawContent,
        setRawContent,
      }}
    >
      {children}
    </PatientContext.Provider>
  );
}

/**
 * Custom hook to access patient context
 *
 * @throws Error if used outside PatientProvider
 * @returns Patient context with data and setter functions
 */
export function usePatient() {
  const context = useContext(PatientContext);
  if (context === undefined) {
    throw new Error("usePatient must be used within a PatientProvider");
  }
  return context;
}
