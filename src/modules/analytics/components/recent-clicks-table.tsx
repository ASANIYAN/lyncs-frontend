import {
  CardContent,
  CardHeader,
  CardTitle,
  LyncsCard,
} from "@/components/custom-components/custom-card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface RecentClicksTableProps {
  clicks: {
    clickedAt: string;
    country: string;
    referrer: string;
    deviceType: string;
  }[];
}

const toFlagEmoji = (code: string) => {
  try {
    return String.fromCodePoint(
      ...code
        .toUpperCase()
        .split("")
        .map((char) => 0x1f1e6 + char.charCodeAt(0) - 65),
    );
  } catch {
    return "🌐";
  }
};

const formatReferrer = (referrer: string) => {
  try {
    return new URL(referrer).hostname;
  } catch {
    return "Direct";
  }
};

const RecentClicksTable = ({ clicks }: RecentClicksTableProps) => {
  return (
    <LyncsCard>
      <CardHeader className="border-b border-lyncs-border">
        <CardTitle className="text-[12px] uppercase tracking-[0.5px] text-lyncs-text-muted">
          Recent clicks
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        <Table className="w-full">
          <TableHeader>
            <TableRow className="border-b border-lyncs-border">
              <TableHead className="text-xi uppercase tracking-[0.5px] text-lyncs-text-muted">
                Time
              </TableHead>
              <TableHead className="text-xi uppercase tracking-[0.5px] text-lyncs-text-muted">
                Country
              </TableHead>
              <TableHead className="text-xi uppercase tracking-[0.5px] text-lyncs-text-muted">
                Device
              </TableHead>
              <TableHead className="text-xi uppercase tracking-[0.5px] text-lyncs-text-muted">
                Referrer
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {clicks.slice(0, 8).map((click, index) => (
              <TableRow
                key={`${click.clickedAt}-${index}`}
                className="border-b border-lyncs-border last:border-0"
              >
                <TableCell className="text-[12px] text-lyncs-text-muted">
                  {new Date(click.clickedAt).toLocaleTimeString("en-GB", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </TableCell>
                <TableCell className="text-[12px] text-lyncs-text-muted">
                  <span className="inline-flex items-center gap-2">
                    <span>
                      {click.country ? toFlagEmoji(click.country) : "🌐"}
                    </span>
                    <span>{click.country || "—"}</span>
                  </span>
                </TableCell>
                <TableCell className="text-[12px] text-lyncs-text-muted">
                  {click.deviceType}
                </TableCell>
                <TableCell className="text-[12px] text-lyncs-text-muted max-w-40 truncate">
                  {formatReferrer(click.referrer)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </LyncsCard>
  );
};

export default RecentClicksTable;
