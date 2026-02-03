/**
 * Metrics configuration for clinical assessments
 *
 * Each metric includes:
 * - label: Display name
 * - mcid: Minimum Clinically Important Difference
 * - direction: Whether improvement is "up" or "down"
 * - min/max: Valid range for the metric
 * - color: Chart color (to be replaced with CSS variables)
 */

export interface MetricConfig {
    label: string;
    mcid: number;
    direction: "up" | "down";
    min: number;
    max: number;
    color: string;
}

export type MetricKey =
    | "nrsMax"
    | "odi"
    | "csi"
    | "pcs"
    | "fabqTravail"
    | "hadsAnxiete"
    | "hadsDepression"
    | "fabqActivite"
    | "wai";

export const METRICS_CONFIG: Record<MetricKey, MetricConfig> = {
    nrsMax: {
        label: "Douleur (NRS Max)",
        mcid: 2,
        direction: "down",
        min: 0,
        max: 10,
        color: "#e74c3c",
    },
    odi: {
        label: "Incapacité (ODI)",
        mcid: 10,
        direction: "down",
        min: 0,
        max: 100,
        color: "#3498db",
    },
    csi: {
        label: "Sensibilisation (CSI)",
        mcid: 15,
        direction: "down",
        min: 0,
        max: 100,
        color: "#f39c12",
    },
    pcs: {
        label: "Catastrophisme (PCS)",
        mcid: 6,
        direction: "down",
        min: 0,
        max: 52,
        color: "#9b59b6",
    },
    fabqTravail: {
        label: "Évitement (FABQ-W)",
        mcid: 12,
        direction: "down",
        min: 0,
        max: 100,
        color: "#e67e22",
    },
    hadsAnxiete: {
        label: "Anxiété (HADS-A)",
        mcid: 4,
        direction: "down",
        min: 0,
        max: 21,
        color: "#1abc9c",
    },
    hadsDepression: {
        label: "Dépression (HADS-D)",
        mcid: 4,
        direction: "down",
        min: 0,
        max: 21,
        color: "#16a085",
    },
    fabqActivite: {
        label: "Évitement (FABQ-A)",
        mcid: 12,
        direction: "down",
        min: 0,
        max: 100,
        color: "#d35400",
    },
    wai: {
        label: "Alliance (WAI)",
        mcid: 10,
        direction: "up",
        min: 0,
        max: 100,
        color: "#27ae60",
    },
};
