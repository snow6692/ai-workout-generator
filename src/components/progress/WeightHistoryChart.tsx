/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
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

interface WeightHistoryChartProps {
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
        <p className="text-black font-semibold text-sm">{`Weight: ${payload[0].value} kg`}</p>
      </div>
    );
  }
  return null;
};

export const WeightHistoryChart = ({ logs }: WeightHistoryChartProps) => {
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

  const chartData = logs
    .filter((log) => log.weight)
    .map((log) => ({
      date: new Date(log.date).toLocaleDateString(),
      weight: log.weight,
    }))
    .reverse();

  if (chartData.length === 0) return null;

  return (
    <Card className="p-4 sm:p-6 mb-8">
      <h2 className="text-lg sm:text-xl font-semibold mb-4">Weight History</h2>
      <div className="overflow-x-auto">
        <LineChart width={chartWidth} height={300} data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" tick={{ fontSize: 12 }} />
          <YAxis tick={{ fontSize: 12 }} />
          <Tooltip content={<CustomTooltip />} />
          <Line type="monotone" dataKey="weight" stroke="#8884d8" />
        </LineChart>
      </div>
    </Card>
  );
};
