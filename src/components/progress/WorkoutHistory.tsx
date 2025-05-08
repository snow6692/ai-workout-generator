import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// Define the structure of a single workout performance entry
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

interface WorkoutHistoryProps {
  logs: ProgressLog[];
}

export const WorkoutHistory = ({ logs }: WorkoutHistoryProps) => {
  const workoutLogs = logs.filter(
    (log) => log.workoutPerformance && log.workoutPerformance.length > 0
  );
  const groupedWorkoutLogs = workoutLogs.reduce(
    (acc, log) => {
      const date = new Date(log.date).toLocaleDateString();
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(...(log.workoutPerformance || []));
      return acc;
    },
    {} as { [date: string]: WorkoutPerformance[] }
  );

  if (Object.keys(groupedWorkoutLogs).length === 0) return null;

  return (
    <Card className="p-4 sm:p-6">
      <h2 className="text-lg sm:text-xl font-semibold mb-4">Workout History</h2>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Exercises</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Object.entries(groupedWorkoutLogs).map(([date, exercises]) => (
              <TableRow key={date}>
                <TableCell>{date}</TableCell>
                <TableCell>
                  <div className="border rounded">
                    <div className="grid grid-cols-4 gap-2 p-2  text-sm font-semibold">
                      <div>Exercise</div>
                      <div>Sets</div>
                      <div>Reps</div>
                      <div>Weight</div>
                    </div>
                    {exercises.map((perf, idx) => (
                      <div
                        key={idx}
                        className="grid grid-cols-4 gap-2 p-2 text-sm border-t"
                      >
                        <div>{perf.exerciseName}</div>
                        <div>{perf.setsCompleted}</div>
                        <div>{perf.repsCompleted}</div>
                        <div>
                          {perf.weightUsed ? `${perf.weightUsed} kg` : "-"}
                        </div>
                      </div>
                    ))}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
};
