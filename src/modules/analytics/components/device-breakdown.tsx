import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";

import { CardContent, CardHeader, CardTitle, LyncsCard } from "@/components/custom-components/custom-card";

interface DeviceBreakdownProps {
  deviceTypes: { type: string; clicks: number; percentage: number }[];
}

const COLORS = [
  "var(--color-lyncs-accent)",
  "var(--color-lyncs-info)",
  "var(--color-lyncs-warning)",
  "var(--color-lyncs-danger)",
  "var(--color-lyncs-text-muted)",
];

const DeviceBreakdown = ({ deviceTypes }: DeviceBreakdownProps) => {
  return (
    <LyncsCard>
      <CardHeader className="border-b border-lyncs-border">
        <CardTitle className="text-[12px] uppercase tracking-[0.5px] text-lyncs-text-muted">
          Device types
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="flex items-center justify-center">
          <ResponsiveContainer width="100%" height={140}>
            <PieChart>
              <Pie
                data={deviceTypes}
                dataKey="clicks"
                innerRadius={36}
                outerRadius={56}
                paddingAngle={3}
              >
                {deviceTypes.map((entry, index) => (
                  <Cell
                    key={`${entry.type}-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 space-y-2">
          {deviceTypes.map((device, index) => (
            <div key={device.type} className="flex items-center gap-2 text-[12px]">
              <span
                className="size-2 rounded-full"
                style={{ backgroundColor: COLORS[index % COLORS.length] }}
              />
              <span className="text-lyncs-text-muted">
                {device.type.charAt(0).toUpperCase() + device.type.slice(1)}
              </span>
              <span className="ml-auto text-lyncs-text tabular-nums">
                {Math.round(device.percentage)}%
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </LyncsCard>
  );
};

export default DeviceBreakdown;
