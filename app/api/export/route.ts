import { NextRequest, NextResponse } from "next/server";
import * as XLSX from "xlsx";

export async function POST(request: NextRequest) {
    function createSheet(wb: any, sheetName: string, data: any[]) {
        const ws = XLSX.utils.json_to_sheet(data);
        ws['!cols'] = [{ wch: 30 }, { wch: 80 }];
        const safeName = sheetName.substring(0, 31);
        XLSX.utils.book_append_sheet(wb, ws, safeName);
    }

    try {
        let data, format;

        const contentType = request.headers.get("content-type") || "";
        const orderedCategories = ["ADMIN", "ANTHROPO", "PATHOLOGIE", "SYMPTOMES", "MECANISMES", "TESTS", "SCORES", "REDFLAGS", "GESTION", "PRONOSTIC", "OBSERVATIONS", "HYPOTHESE"];

        if (contentType.includes("application/json")) {
            const body = await request.json();
            data = body.data;
            format = body.format;
        } else {
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

        if (format === "csv") {
            const categories: Record<string, any[]> = {};

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

            let csvContent = "";

            orderedCategories.forEach(cat => {
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

            return new NextResponse(csvBuffer, {
                status: 200,
                headers: {
                    "Content-Disposition": `attachment; filename="patient-data-${new Date().toISOString().split('T')[0]}.csv"`,
                    "Content-Type": "text/csv;charset=utf-8",
                    "Content-Length": csvBuffer.length.toString(),
                },
            });
        }

        if (format === "xlsx") {
            const workbook = XLSX.utils.book_new();

            const categories: Record<string, any[]> = {};

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

            orderedCategories.forEach(cat => {
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

            return new NextResponse(buffer, {
                status: 200,
                headers: {
                    "Content-Disposition": `attachment; filename="patient-data-${new Date().toISOString().split('T')[0]}.xlsx"`,
                    "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                    "Content-Length": buffer.length.toString(),
                },
            });
        }

        if (format === "json") {
            const nested = unflattenDotObject(data);

            const json = JSON.stringify(nested, null, 2);
            const jsonBuffer = Buffer.from(json, "utf-8");

            return new NextResponse(jsonBuffer, {
                status: 200,
                headers: {
                    "Content-Disposition": `attachment; filename="patient-data-${new Date()
                        .toISOString()
                        .split("T")[0]}.json"`,
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

function unflattenDotObject(flat: Record<string, any>) {
    const result: any = {};

    for (const [path, value] of Object.entries(flat)) {
        if (!path.includes(".")) {
            result[path] = value;
            continue;
        }

        const keys = path.split(".");
        let cur = result;

        for (let i = 0; i < keys.length; i++) {
            const k = keys[i];
            const isLast = i === keys.length - 1;
            const nextKey = keys[i + 1];

            if (isLast) {
                cur[k] = value;
                break;
            }

            if (!(k in cur)) {
                cur[k] = isFinite(Number(nextKey)) ? [] : {};
            }

            cur = cur[k];
        }
    }

    return result;
}