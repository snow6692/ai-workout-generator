import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// Define the structure of a workout performance entry
interface WorkoutPerformance {
  exerciseName: string;
  setsCompleted: number;
  repsCompleted: number;
  weightUsed?: number;
}

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
  workoutPerformance?: WorkoutPerformance[];
}

interface ProgressSummaryProps {
  logs: ProgressLog[];
  recentLogs: ProgressLog[];
}

export const ProgressSummary = ({ logs, recentLogs }: ProgressSummaryProps) => {
  const calculateTrends = () => {
    const exerciseTrends: {
      [key: string]: {
        sets: number;
        reps: number;
        weight: number;
        count: number;
      };
    } = {};

    recentLogs.forEach((log) => {
      log.workoutPerformance?.forEach((perf) => {
        if (!exerciseTrends[perf.exerciseName]) {
          exerciseTrends[perf.exerciseName] = {
            sets: 0,
            reps: 0,
            weight: 0,
            count: 0,
          };
        }
        exerciseTrends[perf.exerciseName].sets += perf.setsCompleted;
        exerciseTrends[perf.exerciseName].reps += perf.repsCompleted;
        exerciseTrends[perf.exerciseName].weight += perf.weightUsed || 0;
        exerciseTrends[perf.exerciseName].count += 1;
      });
    });

    return Object.entries(exerciseTrends).map(([name, data]) => ({
      exerciseName: name,
      avgSets: data.count > 0 ? Number((data.sets / data.count).toFixed(1)) : 0,
      avgReps: data.count > 0 ? Number((data.reps / data.count).toFixed(1)) : 0,
      avgWeight:
        data.count > 0 ? Number((data.weight / data.count).toFixed(1)) : 0,
    }));
  };

  const getImprovementMessage = () => {
    const trends = calculateTrends();
    let hasImproved = false;
    trends.forEach((trend) => {
      const earlierLogs = logs.filter(
        (log) =>
          new Date(log.date) <
          new Date(recentLogs[recentLogs.length - 1]?.date || Date.now())
      );
      const earlierTrend = earlierLogs
        .flatMap((log) => log.workoutPerformance || [])
        .filter((perf) => perf.exerciseName === trend.exerciseName);

      const earlierAvgReps =
        earlierTrend.length > 0
          ? earlierTrend.reduce((sum, perf) => sum + perf.repsCompleted, 0) /
            earlierTrend.length
          : 0;
      const earlierAvgWeight =
        earlierTrend.length > 0
          ? earlierTrend.reduce(
              (sum, perf) => sum + (perf.weightUsed || 0),
              0
            ) / earlierTrend.length
          : 0;

      if (
        trend.avgReps > earlierAvgReps ||
        trend.avgWeight > earlierAvgWeight
      ) {
        hasImproved = true;
      }
    });

    return hasImproved
      ? "You're getting stronger! Your reps or weights have increased."
      : recentLogs.length > 0
        ? "Keep it up! Consistent workouts are building your strength."
        : "Log some workouts to see your progress!";
  };

  const trends = calculateTrends();

  if (recentLogs.length === 0) return null;

  return (
    <Card className="p-4 sm:p-6 mb-8">
      <h2 className="text-lg sm:text-xl font-semibold mb-4">
        Progress Summary (Last 10 Days)
      </h2>
      <p className="text-sm text-green-600 mb-4">{getImprovementMessage()}</p>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Exercise</TableHead>
              <TableHead>Avg Sets</TableHead>
              <TableHead>Avg Reps</TableHead>
              <TableHead>Avg Weight</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {trends.map((trend) => (
              <TableRow key={trend.exerciseName}>
                <TableCell>{trend.exerciseName}</TableCell>
                <TableCell>{trend.avgSets}</TableCell>
                <TableCell>{trend.avgReps}</TableCell>
                <TableCell>
                  {trend.avgWeight > 0 ? `${trend.avgWeight} kg` : "-"}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
};
