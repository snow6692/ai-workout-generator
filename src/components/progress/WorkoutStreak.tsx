import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Card } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import toast from "react-hot-toast";
import { useEffect } from "react";

interface WorkoutStreakProps {
  userId: string;
}

export const WorkoutStreak = ({ userId }: WorkoutStreakProps) => {
  const streakData = useQuery(api.progressLogs.getWorkoutStreak, { userId });
  const milestones = useQuery(api.progressLogs.getStreakMilestones, { userId });
  const streakReset = useQuery(api.progressLogs.checkStreakReset, { userId });

  useEffect(() => {
    if (streakReset) {
      toast.error(
        "Your workout streak has reset. Log a workout today to start a new one!",
        {
          duration: 4000,
          style: {
            background: "#ef4444",
            color: "#ffffff",
            border: "1px solid #b91c1c",
          },
        }
      );
    }
  }, [streakReset]);

  if (!streakData || !milestones) {
    return (
      <Card className="p-4 sm:p-6 mb-8 bg-gradient-to-r from-blue-600 to-orange-500 text-white">
        <h2 className="text-lg sm:text-xl font-semibold mb-4">
          Workout Streak
        </h2>
        <p className="text-sm">Loading streak data...</p>
      </Card>
    );
  }

  const { currentStreak, longestStreak, streakHistory } = streakData;

  // Prepare data for chart
  const chartData = streakHistory
    .map((entry) => ({
      date: new Date(entry.date).toLocaleDateString(),
      streak: entry.streak,
    }))
    .reverse();

  return (
    <Card className="p-4 sm:p-6 mb-8 bg-gradient-to-r from-blue-600 to-orange-500 text-white">
      <h2 className="text-lg sm:text-xl font-semibold mb-4">Workout Streak</h2>
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1">
          <p className="text-2xl sm:text-3xl font-bold">
            🔥 {currentStreak} Day{currentStreak !== 1 ? "s" : ""}
          </p>
          <p className="text-sm">Current Streak</p>
        </div>
        <div className="flex-1">
          <p className="text-2xl sm:text-3xl font-bold">
            {longestStreak} Day{longestStreak !== 1 ? "s" : ""}
          </p>
          <p className="text-sm">Longest Streak</p>
        </div>
      </div>
      <p className="text-sm mb-6">
        {currentStreak > 0
          ? `Great job! Log one workout per day to extend your streak.`
          : `Log a workout today to start a streak! One workout per day keeps it going.`}
      </p>

      {/* Milestones */}
      {milestones.length > 0 && (
        <div className="mb-6">
          <h3 className="text-md font-semibold mb-2">Milestones Achieved</h3>
          <div className="flex flex-wrap gap-2">
            {milestones.map((milestone, index) => (
              <div
                key={index}
                className="bg-orange-500 px-3 py-1 rounded-full text-sm"
              >
                🎉 {milestone.milestone}-Day Streak on{" "}
                {new Date(milestone.date).toLocaleDateString()}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Streak History Chart */}
      {chartData.length > 0 && (
        <div className="mb-6">
          <h3 className="text-md font-semibold mb-2">Streak History</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff33" />
                <XAxis dataKey="date" stroke="#ffffff" />
                <YAxis stroke="#ffffff" />
                <Tooltip
                  contentStyle={{ backgroundColor: "#1f2937", border: "none" }}
                  labelStyle={{ color: "#ffffff" }}
                />
                <Bar dataKey="streak" fill="#f97316" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </Card>
  );
};
