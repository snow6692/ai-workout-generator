import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Card } from "@/components/ui/card";

interface WorkoutStreakProps {
  userId: string;
}

export const WorkoutStreak = ({ userId }: WorkoutStreakProps) => {
  const streakData = useQuery(api.progressLogs.getWorkoutStreak, { userId });

  if (!streakData) {
    return (
      <Card className="p-4 sm:p-6 mb-8 bg-gradient-to-r from-blue-600 to-orange-500 text-white">
        <h2 className="text-lg sm:text-xl font-semibold mb-4">
          Workout Streak
        </h2>
        <p className="text-sm">Loading streak data...</p>
      </Card>
    );
  }

  const { currentStreak, longestStreak } = streakData;

  return (
    <Card className="p-4 sm:p-6 mb-8 bg-gradient-to-r from-blue-600 to-orange-500 text-white">
      <h2 className="text-lg sm:text-xl font-semibold mb-4">Workout Streak</h2>
      <div className="flex flex-col sm:flex-row gap-4">
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
      <p className="text-sm mt-4">
        {currentStreak > 0
          ? "Keep it up! Log a workout today to extend your streak!"
          : "Start a new streak by logging a workout today!"}
      </p>
    </Card>
  );
};
