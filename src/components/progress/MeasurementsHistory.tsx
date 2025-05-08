/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

// Define the structure of a progress log entry
interface ProgressLog {
  userId: string;
  date: string;
  weight?: number;
  measurements?: {
    waist?: number;
    chest?: number;
    hips?: number;
  };
  workoutPerformance?: {
    exerciseName: string;
    setsCompleted: number;
    repsCompleted: number;
    weightUsed?: number;
  }[];
}

interface MeasurementsHistoryProps {
  logs: ProgressLog[];
}

const CustomTooltip = ({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: any[];
  label?: string;
}) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-gray-300 p-2 rounded shadow">
        <p className="text-gray-600 text-sm">{`Date: ${label}`}</p>
        {payload.map((entry, idx) => (
          <p key={idx} className="text-sm" style={{ color: entry.color }}>
            {`${entry.name}: ${entry.value} cm`}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export const MeasurementsHistory = ({ logs }: MeasurementsHistoryProps) => {
  const [chartWidth, setChartWidth] = useState(600);

  useEffect(() => {
    const updateChartWidth = () => {
      const width = window.innerWidth > 768 ? 600 : window.innerWidth - 40;
      setChartWidth(width);
    };

    updateChartWidth();
    window.addEventListener("resize", updateChartWidth);
    return () => window.removeEventListener("resize", updateChartWidth);
  }, []);

  const measurementLogs = logs.filter((log) => log.measurements);
  const chartData = measurementLogs
    .map((log) => ({
      date: new Date(log.date).toLocaleDateString(),
      waist: log.measurements?.waist,
      chest: log.measurements?.chest,
      hips: log.measurements?.hips,
    }))
    .reverse();

  if (measurementLogs.length === 0) return null;

  return (
    <Card className="p-4 sm:p-6 mb-8">
      <h2 className="text-lg sm:text-xl font-semibold mb-4">
        Measurements History
      </h2>
      <div className="overflow-x-auto mb-6">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Waist (cm)</TableHead>
              <TableHead>Chest (cm)</TableHead>
              <TableHead>Hips (cm)</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {measurementLogs.map((log, idx) => (
              <TableRow key={idx}>
                <TableCell>{new Date(log.date).toLocaleDateString()}</TableCell>
                <TableCell>
                  {log.measurements?.waist
                    ? `${log.measurements.waist} cm`
                    : "-"}
                </TableCell>
                <TableCell>
                  {log.measurements?.chest
                    ? `${log.measurements.chest} cm`
                    : "-"}
                </TableCell>
                <TableCell>
                  {log.measurements?.hips ? `${log.measurements.hips} cm` : "-"}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      {chartData.length > 0 && (
        <div className="overflow-x-auto">
          <LineChart width={chartWidth} height={300} data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Line
              type="monotone"
              dataKey="waist"
              stroke="#ff7300"
              name="Waist"
            />
            <Line
              type="monotone"
              dataKey="chest"
              stroke="#387908"
              name="Chest"
            />
            <Line type="monotone" dataKey="hips" stroke="#0088ff" name="Hips" />
          </LineChart>
        </div>
      )}
    </Card>
  );
};
