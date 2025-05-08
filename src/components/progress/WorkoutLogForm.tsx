/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { z } from "zod";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const workoutSchema = z.object({
  setsCompleted: z.number().positive("Sets must be greater than 0"),
  repsCompleted: z.number().positive("Reps must be greater than 0"),
  weightUsed: z.number().optional(),
});

interface WorkoutLogFormProps {
  userId: string;
  activePlan: any;
}

export const WorkoutLogForm = ({ userId, activePlan }: WorkoutLogFormProps) => {
  const createLog = useMutation(api.progressLogs.createLog);
  const [selectedDay, setSelectedDay] = useState<string>("");
  const [workoutData, setWorkoutData] = useState<
    {
      exerciseName: string;
      setsCompleted: string;
      repsCompleted: string;
      weightUsed: string;
    }[]
  >([]);
  const [workoutError, setWorkoutError] = useState<string | null>(null);

  useEffect(() => {
    if (selectedDay && activePlan?.workoutPlan) {
      const dayExercises = activePlan.workoutPlan.exercises.find(
        (ex: any) => ex.day === selectedDay
      );
      if (dayExercises) {
        setWorkoutData(
          dayExercises.routines.map((routine: any) => ({
            exerciseName: routine.name,
            setsCompleted: routine.sets?.toString() || "",
            repsCompleted: routine.reps?.toString() || "",
            weightUsed: "",
          }))
        );
      }
    }
  }, [selectedDay, activePlan]);

  const handleLogWorkout = async () => {
    setWorkoutError(null);

    try {
      const validatedData = workoutData.map((data) => {
        const parsed = workoutSchema.parse({
          setsCompleted: Number(data.setsCompleted),
          repsCompleted: Number(data.repsCompleted),
          weightUsed: data.weightUsed ? Number(data.weightUsed) : undefined,
        });
        return {
          exerciseName: data.exerciseName,
          setsCompleted: parsed.setsCompleted,
          repsCompleted: parsed.repsCompleted,
          weightUsed: parsed.weightUsed,
        };
      });

      await createLog({
        userId,
        date: new Date().toISOString(),
        workoutPerformance: validatedData,
      });
      setWorkoutData([]);
      setSelectedDay("");
    } catch (validationError) {
      if (validationError instanceof z.ZodError) {
        setWorkoutError("Please enter valid sets and reps (greater than 0)");
      } else {
        setWorkoutError("Invalid workout data");
      }
    }
  };

  const updateWorkoutData = (index: number, field: string, value: string) => {
    setWorkoutData((prev) =>
      prev.map((data, i) => (i === index ? { ...data, [field]: value } : data))
    );
  };

  return (
    <Card className="p-4 sm:p-6 mb-8">
      <h2 className="text-lg sm:text-xl font-semibold mb-4">Log Workout</h2>
      {workoutError && (
        <div className="text-red-500 text-sm mb-4">{workoutError}</div>
      )}
      <Select value={selectedDay} onValueChange={setSelectedDay}>
        <SelectTrigger className="w-full sm:w-[200px] mb-4">
          <SelectValue placeholder="Select workout day" />
        </SelectTrigger>
        <SelectContent>
          {activePlan?.workoutPlan.exercises.map((ex: any) => (
            <SelectItem key={ex.day} value={ex.day}>
              {ex.day}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {selectedDay && workoutData.length > 0 && (
        <div className="space-y-4">
          {workoutData.map((data, index) => (
            <div
              key={index}
              className="flex flex-col sm:flex-row gap-4 items-start"
            >
              <div className="w-full sm:w-1/3 font-semibold text-sm pt-2">
                {data.exerciseName}
              </div>
              <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-2/3">
                <Input
                  type="number"
                  placeholder="Sets"
                  value={data.setsCompleted}
                  onChange={(e) =>
                    updateWorkoutData(index, "setsCompleted", e.target.value)
                  }
                  className="w-full"
                />
                <Input
                  type="number"
                  placeholder="Reps"
                  value={data.repsCompleted}
                  onChange={(e) =>
                    updateWorkoutData(index, "repsCompleted", e.target.value)
                  }
                  className="w-full"
                />
                <Input
                  type="number"
                  placeholder="Weight (kg, optional)"
                  value={data.weightUsed}
                  onChange={(e) =>
                    updateWorkoutData(index, "weightUsed", e.target.value)
                  }
                  className="w-full"
                />
              </div>
            </div>
          ))}
          <Button onClick={handleLogWorkout} className="w-full sm:w-auto">
            Log Workout
          </Button>
        </div>
      )}
    </Card>
  );
};
