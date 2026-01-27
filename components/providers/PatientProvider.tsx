"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { PatientData } from "@/types/patient";

interface PatientContextType {
  patientData: PatientData | null;
  setPatientData: (data: PatientData | null) => void;
  rawContent: string;
  setRawContent: (content: string) => void;
}

const PatientContext = createContext<PatientContextType | undefined>(undefined);

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

export function usePatient() {
  const context = useContext(PatientContext);
  if (context === undefined) {
    throw new Error("usePatient must be used within a PatientProvider");
  }
  return context;
}
