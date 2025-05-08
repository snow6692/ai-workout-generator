/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useUser } from "@clerk/nextjs";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { z } from "zod";

const weightSchema = z.number().positive("Weight must be greater than 0");

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-gray-300 p-2 rounded shadow">
        <p className="text-gray-600 text-sm">{`Date: ${label}`}</p>
        <p className="text-primary font-semibold text-sm">{`Weight: ${payload[0].value} kg`}</p>
      </div>
    );
  }
  return null;
};

const ProgressPage = () => {
  const { user } = useUser();
  const userId = user?.id as string;
  const logs = useQuery(api.progressLogs.getUserLogs, { userId }) || [];
  const createLog = useMutation(api.progressLogs.createLog);

  const [weight, setWeight] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [chartWidth, setChartWidth] = useState(600);

  // Adjust chart width based on window size
  useEffect(() => {
    const updateChartWidth = () => {
      const width = window.innerWidth > 768 ? 600 : window.innerWidth - 40; // Account for padding
      setChartWidth(width);
    };

    updateChartWidth();
    window.addEventListener("resize", updateChartWidth);
    return () => window.removeEventListener("resize", updateChartWidth);
  }, []);

  const handleLogWeight = async () => {
    setError(null); // Clear previous errors

    // Validate input
    const parsedWeight = Number(weight);
    try {
      weightSchema.parse(parsedWeight);
    } catch (validationError) {
      if (validationError instanceof z.ZodError) {
        setError(validationError.errors[0].message);
      } else {
        setError("Invalid weight");
      }
      return;
    }

    // Save valid weight
    await createLog({
      userId,
      date: new Date().toISOString(),
      weight: parsedWeight,
    });
    setWeight("");
  };

  // Prepare data for chart
  const chartData = logs
    .filter((log) => log.weight)
    .map((log) => ({
      date: new Date(log.date).toLocaleDateString(),
      weight: log.weight,
    }))
    .reverse(); // Oldest to newest for chart

  return (
    <div className="container mx-auto px-4 mt-12 py-12">
      <h1 className="text-2xl sm:text-3xl font-bold mb-8">
        <span className="text-primary">Track</span> Your Progress
      </h1>

      <Card className="p-4 sm:p-6 mb-8">
        <h2 className="text-lg sm:text-xl font-semibold mb-4">Log Weight</h2>
        {error && <div className="text-red-500 text-sm mb-4">{error}</div>}
        <div className="flex flex-col sm:flex-row gap-4">
          <Input
            type="number"
            placeholder="Enter weight (kg)"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            className="w-full sm:w-auto"
          />
          <Button onClick={handleLogWeight} className="w-full sm:w-auto">
            Log
          </Button>
        </div>
      </Card>

      {chartData.length > 0 && (
        <Card className="p-4 sm:p-6">
          <h2 className="text-lg sm:text-xl font-semibold mb-4">
            Weight History
          </h2>
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
      )}
    </div>
  );
};

export default ProgressPage;
