/**
 * MetricChart Component
 *
 * Displays a line chart for a specific clinical metric over time.
 * Shows baseline and MCID target reference lines.
 */

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend,
    ReferenceLine,
} from "recharts";
import { MetricConfig } from "@/utils/metricsConfig";

interface MetricChartProps {
    metricKey: string;
    config: MetricConfig;
    chartData: Array<{
        name: string;
        date: string;
        [key: string]: string | number;
    }>;
    baselineValue: number;
}

/**
 * Renders a line chart showing metric progression over time
 * Includes baseline and MCID target reference lines
 */
export function MetricChart({
    metricKey,
    config,
    chartData,
    baselineValue,
}: MetricChartProps) {
    const mcidTarget =
        config.direction === "down"
            ? baselineValue - config.mcid
            : baselineValue + config.mcid;

    return (
        <Card className="shadow-sm border-muted">
            <CardHeader className="pb-2">
                <CardTitle className="text-sm font-bold flex items-center justify-between">
                    <span>📈 Trend: {config.label}</span>
                    <span className="text-[10px] font-normal text-muted-foreground">
                        Range: {config.min}-{config.max}
                    </span>
                </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
                <div className="h-62.5 w-full mt-4">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                            data={chartData}
                            margin={{ top: 5, right: 30, left: -20, bottom: 5 }}
                        >
                            <CartesianGrid
                                strokeDasharray="3 3"
                                vertical={false}
                                stroke="#f0f0f0"
                            />
                            <XAxis
                                dataKey="name"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fontSize: 10, fill: "#666" }}
                            />
                            <YAxis
                                domain={[config.min, config.max]}
                                axisLine={false}
                                tickLine={false}
                                tick={{ fontSize: 10, fill: "#666" }}
                            />
                            <Tooltip
                                contentStyle={{
                                    borderRadius: "8px",
                                    border: "1px solid #e2e8f0",
                                    boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                                }}
                                labelStyle={{ fontWeight: "bold", fontSize: "12px" }}
                            />
                            <Legend iconType="circle" wrapperStyle={{ fontSize: "10px" }} />
                            <ReferenceLine
                                y={baselineValue}
                                label={{
                                    value: "Baseline",
                                    position: "insideLeft",
                                    fontSize: 8,
                                    fill: "#94a3b8",
                                }}
                                stroke="#94a3b8"
                                strokeDasharray="3 3"
                            />
                            <ReferenceLine
                                y={mcidTarget}
                                label={{
                                    value: "MCID Target",
                                    position: "insideRight",
                                    fontSize: 8,
                                    fill: "#10b981",
                                }}
                                stroke="#10b981"
                                strokeDasharray="5 5"
                            />
                            <Line
                                type="monotone"
                                dataKey={metricKey}
                                name={config.label}
                                stroke={config.color}
                                strokeWidth={3}
                                dot={{
                                    r: 4,
                                    fill: config.color,
                                    strokeWidth: 2,
                                    stroke: "#fff",
                                }}
                                activeDot={{ r: 6, strokeWidth: 0 }}
                                animationDuration={1000}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
}
