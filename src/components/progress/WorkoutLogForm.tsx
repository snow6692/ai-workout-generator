/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { useMutation, useQuery } from "convex/react";
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
import toast from "react-hot-toast";
import { Id } from "../../../convex/_generated/dataModel";

const workoutSchema = z.object({
  exerciseName: z.string().min(1, "Exercise name is required"),
  setsCompleted: z.number().positive("Sets must be greater than 0"),
  repsCompleted: z.number().positive("Reps must be greater than 0"),
  weightUsed: z.number().optional(),
});

interface WorkoutLogFormProps {
  userId: string;
  activePlan: any;
}

export const WorkoutLogForm = ({ userId, activePlan }: WorkoutLogFormProps) => {
  const addWorkoutToLog = useMutation(api.progressLogs.addWorkoutToLog);
  const deleteWorkoutFromLog = useMutation(
    api.progressLogs.deleteWorkoutFromLog
  );
  const logs =
    useQuery(api.progressLogs.getRecentWorkoutLogs, { userId, days: 30 }) || [];

  const [selectedDay, setSelectedDay] = useState<string>("");
  const [workoutData, setWorkoutData] = useState<
    {
      exerciseName: string;
      setsCompleted: string;
      repsCompleted: string;
      weightUsed: string;
    }[]
  >([]);
  const [newWorkout, setNewWorkout] = useState({
    exerciseName: "",
    setsCompleted: "",
    repsCompleted: "",
    weightUsed: "",
  });
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
      } else {
        setWorkoutData([]);
      }
    }
  }, [selectedDay, activePlan]);

  const handleAddWorkout = async () => {
    setWorkoutError(null);
    try {
      const validatedData = workoutSchema.parse({
        exerciseName: newWorkout.exerciseName,
        setsCompleted: Number(newWorkout.setsCompleted),
        repsCompleted: Number(newWorkout.repsCompleted),
        weightUsed: newWorkout.weightUsed
          ? Number(newWorkout.weightUsed)
          : undefined,
      });

      await addWorkoutToLog({
        userId,
        date: new Date().toISOString(),
        workout: validatedData,
      });

      setNewWorkout({
        exerciseName: "",
        setsCompleted: "",
        repsCompleted: "",
        weightUsed: "",
      });
      toast.success("Workout added successfully!", {
        style: { background: "#22c55e", color: "#ffffff" },
      });
    } catch (e) {
      if (e instanceof z.ZodError) {
        setWorkoutError(e.errors[0].message);
      } else {
        setWorkoutError("Failed to add workout");
      }
    }
  };

  const handleLogWorkout = async () => {
    setWorkoutError(null);
    try {
      const validatedData = workoutData.map((data) => {
        const parsed = workoutSchema.parse({
          exerciseName: data.exerciseName,
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

      await addWorkoutToLog({
        userId,
        date: new Date().toISOString(),
        workout: validatedData[0], // Log one at a time to support appending
      });

      setWorkoutData(workoutData.slice(1)); // Remove logged workout
      toast.success("Workout logged successfully!", {
        style: { background: "#22c55e", color: "#ffffff" },
      });
    } catch (e) {
      if (e instanceof z.ZodError) {
        setWorkoutError("Please enter valid sets and reps (greater than 0)");
      } else {
        setWorkoutError("Invalid workout data");
      }
    }
  };

  const handleDeleteWorkout = async (
    logId: Id<"progress_logs">,
    workoutIndex: number
  ) => {
    try {
      await deleteWorkoutFromLog({ logId, workoutIndex });
      toast.success("Workout deleted successfully!", {
        style: { background: "#22c55e", color: "#ffffff" },
      });
    } catch (e: any) {
      toast.error(`Failed to delete workout ${e}`, {
        style: { background: "#ef4444", color: "#ffffff" },
      });
    }
  };

  const updateWorkoutData = (index: number, field: string, value: string) => {
    setWorkoutData((prev) =>
      prev.map((data, i) => (i === index ? { ...data, [field]: value } : data))
    );
  };

  const updateNewWorkout = (field: string, value: string) => {
    setNewWorkout((prev) => ({ ...prev, [field]: value }));
  };

  // Filter logs for the selected day
  const selectedDayLogs = logs.filter(
    (log) => log.date.split("T")[0] === new Date().toISOString().split("T")[0]
  );

  return (
    <Card className="p-4 sm:p-6 mb-8">
      <h2 className="text-lg sm:text-xl font-semibold mb-4 text-blue-600">
        Log Workout
      </h2>
      {workoutError && (
        <div className="text-red-500 text-sm mb-4">{workoutError}</div>
      )}
      <Select value={selectedDay} onValueChange={setSelectedDay}>
        <SelectTrigger className="w-full sm:w-[200px] mb-4">
          <SelectValue placeholder="Select workout day" />
        </SelectTrigger>
        <SelectContent>
          {activePlan?.workoutPlan?.exercises?.map((ex: any) => (
            <SelectItem key={ex.day} value={ex.day}>
              {ex.day}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Existing Workouts for Selected Day */}
      {selectedDay && selectedDayLogs.length > 0 && (
        <div className="mb-6">
          <h3 className="text-md font-semibold mb-2">Logged Workouts</h3>
          {selectedDayLogs.map((log) =>
            log.workoutPerformance?.map((workout: any, index: number) => (
              <div
                key={`${log._id}-${index}`}
                className="flex flex-col sm:flex-row gap-2 items-center mb-2"
              >
                <p className="flex-1 text-sm">
                  {workout.exerciseName}: {workout.setsCompleted} sets,{" "}
                  {workout.repsCompleted} reps
                  {workout.weightUsed ? `, ${workout.weightUsed} kg` : ""}
                </p>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDeleteWorkout(log._id, index)}
                >
                  Delete
                </Button>
              </div>
            ))
          )}
        </div>
      )}

      {/* Pre-filled Workouts from Plan */}
      {selectedDay && workoutData.length > 0 && (
        <div className="space-y-4 mb-6">
          <h3 className="text-md font-semibold mb-2">Plan Exercises</h3>
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
              <Button
                onClick={handleLogWorkout}
                className="bg-green-500 hover:bg-green-600 w-full sm:w-auto"
              >
                Log
              </Button>
            </div>
          ))}
        </div>
      )}

      {/* Form to Add New Workout */}
      {selectedDay && (
        <div className="space-y-4">
          <h3 className="text-md font-semibold mb-2">Add New Workout</h3>
          <div className="flex flex-col sm:flex-row gap-4 items-start">
            <Input
              placeholder="Exercise Name"
              value={newWorkout.exerciseName}
              onChange={(e) => updateNewWorkout("exerciseName", e.target.value)}
              className="w-full sm:w-1/3"
            />
            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-2/3">
              <Input
                type="number"
                placeholder="Sets"
                value={newWorkout.setsCompleted}
                onChange={(e) =>
                  updateNewWorkout("setsCompleted", e.target.value)
                }
                className="w-full"
              />
              <Input
                type="number"
                placeholder="Reps"
                value={newWorkout.repsCompleted}
                onChange={(e) =>
                  updateNewWorkout("repsCompleted", e.target.value)
                }
                className="w-full"
              />
              <Input
                type="number"
                placeholder="Weight (kg, optional)"
                value={newWorkout.weightUsed}
                onChange={(e) => updateNewWorkout("weightUsed", e.target.value)}
                className="w-full"
              />
            </div>
            <Button
              onClick={handleAddWorkout}
              className="bg-orange-500 hover:bg-orange-600 w-full sm:w-auto"
            >
              Add Workout
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
};
