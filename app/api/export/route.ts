import { NextRequest, NextResponse } from "next/server";
import * as XLSX from "xlsx";
import { unflattenDotObject } from "@/utils/objectHelpers";

/**
 * Ordered category list for organizing exported data
 * Ensures consistent section ordering in CSV and XLSX exports
 */
const ORDERED_CATEGORIES = [
    "ADMIN",
    "ANTHROPO",
    "PATHOLOGIE",
    "SYMPTOMES",
    "MECANISMES",
    "TESTS",
    "SCORES",
    "REDFLAGS",
    "GESTION",
    "PRONOSTIC",
    "OBSERVATIONS",
    "HYPOTHESE"
];

/**
 * Creates a worksheet and adds it to the workbook
 *
 * @param wb - Excel workbook to append sheet to
 * @param sheetName - Name of the sheet (max 31 characters)
 * @param data - Array of objects to populate sheet
 */
function createSheet(
    wb: XLSX.WorkBook,
    sheetName: string,
    data: Record<string, unknown>[]
) {
    const ws = XLSX.utils.json_to_sheet(data);
    ws['!cols'] = [{ wch: 30 }, { wch: 80 }];
    const safeName = sheetName.substring(0, 31);
    XLSX.utils.book_append_sheet(wb, ws, safeName);
}

/**
 * POST /api/export
 *
 * Exports patient data in requested format (CSV, XLSX, or JSON)
 *
 * Request body:
 * - data: Flattened patient data object with dot-notation keys
 * - format: Export format ('csv' | 'xlsx' | 'json')
 *
 * Response: Binary file with appropriate Content-Type and filename
 */
export async function POST(request: NextRequest) {
    try {
        let data: Record<string, unknown>;
        let format: string;

        const contentType = request.headers.get("content-type") || "";

        if (contentType.includes("application/json")) {
            const body = await request.json();
            data = body.data;
            format = body.format;
        } else {
            // Support legacy FormData format
            const formData = await request.formData();
            const payloadString = formData.get("payload") as string;

            if (!payloadString) {
                return NextResponse.json({ error: "No payload" }, { status: 400 });
            }

            const payload = JSON.parse(payloadString);
            data = payload.data;
            format = payload.format;
        }

        if (!data) {
            return NextResponse.json({ error: "No data provided" }, { status: 400 });
        }

        const patientName = String(
            data["section1.nomPatient"] || data["nomPatient"] || "patient"
        );
        const patientId = String(
            data["section1.idPatient"] || data["idPatient"] || ""
        );

        const cleanName = patientName.replace(/[^a-z0-9]/gi, '_').toLowerCase();
        const cleanId = patientId.replace(/[^a-z0-9]/gi, '_').toLowerCase();

        const baseName = [cleanName, cleanId].filter(Boolean).join('_') || 'export_scalenoe';
        const dateStr = new Date().toISOString().split('T')[0];
        const filenamePre = `export_${baseName}_${dateStr}`;

        if (format === "csv") {
            const categories = categorizeData(data);
            let csvContent = "";
            ORDERED_CATEGORIES.forEach(cat => {
                if (categories[cat]) {
                    csvContent += `\n=== ${cat} ===\n`;
                    const worksheet = XLSX.utils.json_to_sheet(categories[cat]);
                    const csv = XLSX.utils.sheet_to_csv(worksheet);
                    csvContent += csv;
                    delete categories[cat];
                }
            });

            Object.keys(categories).forEach(cat => {
                csvContent += `\n=== ${cat} ===\n`;
                const worksheet = XLSX.utils.json_to_sheet(categories[cat]);
                const csv = XLSX.utils.sheet_to_csv(worksheet);
                csvContent += csv;
            });

            const BOM = '\uFEFF';
            const csvWithBOM = BOM + csvContent;
            const csvBuffer = Buffer.from(csvWithBOM, 'utf-8');

            const filename = `${filenamePre}.csv`;
            return new NextResponse(csvBuffer, {
                status: 200,
                headers: {
                    "Content-Disposition": `attachment; filename="${filename}"`,
                    "Content-Type": "text/csv;charset=utf-8",
                    "Content-Length": csvBuffer.length.toString(),
                },
            });
        }

        if (format === "xlsx") {
            const workbook = XLSX.utils.book_new();
            const categories = categorizeData(data);
            ORDERED_CATEGORIES.forEach(cat => {
                if (categories[cat]) {
                    createSheet(workbook, cat, categories[cat]);
                    delete categories[cat];
                }
            });

            Object.keys(categories).forEach(cat => {
                createSheet(workbook, cat, categories[cat]);
            });

            const b64 = XLSX.write(workbook, { type: "base64", bookType: "xlsx" });
            const buffer = Buffer.from(b64, "base64");

            const filename = `${filenamePre}.xlsx`;
            return new NextResponse(buffer, {
                status: 200,
                headers: {
                    "Content-Disposition": `attachment; filename="${filename}"`,
                    "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                    "Content-Length": buffer.length.toString(),
                },
            });
        }

        if (format === "json") {
            const nested = unflattenDotObject(data);
            const json = JSON.stringify(nested, null, 2);
            const jsonBuffer = Buffer.from(json, "utf-8");

            const filename = `${filenamePre}.json`;
            return new NextResponse(jsonBuffer, {
                status: 200,
                headers: {
                    "Content-Disposition": `attachment; filename="${filename}"`,
                    "Content-Type": "application/json;charset=utf-8",
                    "Content-Length": jsonBuffer.length.toString(),
                },
            });
        }

        return NextResponse.json(
            { error: "Invalid format" },
            { status: 400 }
        );
    } catch (error) {
        console.error("Export error:", error);
        return NextResponse.json(
            { error: "Export failed" },
            { status: 500 }
        );
    }
}

/**
 * Categorizes flattened data by section prefix
 *
 * Converts dot-notation keys like "section1.nomPatient" into categorized groups
 * - Keys with dots are grouped by their prefix (e.g., "section1" → "SECTION1")
 * - Keys without dots go into "GENERAL" category
 *
 * @param data - Flattened data object with dot-notation keys
 * @returns Object mapping category names to arrays of field/value pairs
 */
function categorizeData(data: Record<string, unknown>): Record<string, Record<string, unknown>[]> {
    const categories: Record<string, Record<string, unknown>[]> = {};

    for (const [key, value] of Object.entries(data)) {
        const parts = key.split('.');
        const categoryName = parts.length > 1 ? parts[0].toUpperCase() : "GENERAL";
        const fieldName = parts.length > 1 ? parts.slice(1).join(' ') : key;

        if (!categories[categoryName]) {
            categories[categoryName] = [];
        }

        categories[categoryName].push({
            Champ: fieldName,
            Valeur: value
        });
    }

    return categories;
}