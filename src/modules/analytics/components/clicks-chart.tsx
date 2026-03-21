import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import {
  CardContent,
  CardHeader,
  CardTitle,
  LyncsCard,
} from "@/components/custom-components/custom-card";

interface ClicksChartProps {
  data: { date: string; clicks: number }[];
}

const ClicksChart = ({ data }: ClicksChartProps) => {
  return (
    <LyncsCard>
      <CardHeader className="border-b border-lyncs-border">
        <CardTitle className="text-[12px] uppercase tracking-[0.5px] text-lyncs-text-muted">
          Clicks over time
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="h-55">
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={data} margin={{ left: 0, right: 12, top: 10 }}>
              <defs>
                <linearGradient id="clicksGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="var(--color-lyncs-accent)"
                    stopOpacity={0.15}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--color-lyncs-accent)"
                    stopOpacity={0}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid
                stroke="var(--color-lyncs-border)"
                strokeDasharray="3 3"
              />
              <XAxis
                dataKey="date"
                tick={{ fill: "var(--color-lyncs-text-muted)", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(value) =>
                  new Date(value).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })
                }
              />
              <YAxis
                tick={{ fill: "var(--color-lyncs-text-muted)", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                contentStyle={{
                  background: "var(--color-lyncs-card)",
                  border: "1px solid var(--color-lyncs-border)",
                  borderRadius: "var(--radius-md)",
                  color: "var(--color-lyncs-text)",
                  fontSize: "12px",
                }}
              />
              <Area
                type="monotone"
                dataKey="clicks"
                stroke="var(--color-lyncs-accent)"
                strokeWidth={2}
                fill="url(#clicksGrad)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </LyncsCard>
  );
};

export default ClicksChart;
