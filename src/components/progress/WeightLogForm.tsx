import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { z } from "zod";

const weightSchema = z.number().positive("Weight must be greater than 0");

interface WeightLogFormProps {
  userId: string;
}

export const WeightLogForm = ({ userId }: WeightLogFormProps) => {
  const createLog = useMutation(api.progressLogs.createLog);
  const [weight, setWeight] = useState("");
  const [weightError, setWeightError] = useState<string | null>(null);

  const handleLogWeight = async () => {
    setWeightError(null);

    const parsedWeight = Number(weight);
    try {
      weightSchema.parse(parsedWeight);
    } catch (validationError) {
      if (validationError instanceof z.ZodError) {
        setWeightError(validationError.errors[0].message);
      } else {
        setWeightError("Invalid weight");
      }
      return;
    }

    await createLog({
      userId,
      date: new Date().toISOString(),
      weight: parsedWeight,
    });
    setWeight("");
  };

  return (
    <Card className="p-4 sm:p-6 mb-8">
      <h2 className="text-lg sm:text-xl font-semibold mb-4">Log Weight</h2>
      {weightError && (
        <div className="text-red-500 text-sm mb-4">{weightError}</div>
      )}
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
  );
};
