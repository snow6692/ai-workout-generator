import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { z } from "zod";

const measurementSchema = z.object({
  waist: z.number().positive("Waist must be greater than 0").optional(),
  chest: z.number().positive("Chest must be greater than 0").optional(),
  hips: z.number().positive("Hips must be greater than 0").optional(),
});

interface MeasurementsLogFormProps {
  userId: string;
}

export const MeasurementsLogForm = ({ userId }: MeasurementsLogFormProps) => {
  const createLog = useMutation(api.progressLogs.createLog);
  const [measurements, setMeasurements] = useState({
    waist: "",
    chest: "",
    hips: "",
  });
  const [error, setError] = useState<string | null>(null);

  const handleLogMeasurements = async () => {
    setError(null);

    const parsedMeasurements = {
      waist: measurements.waist ? Number(measurements.waist) : undefined,
      chest: measurements.chest ? Number(measurements.chest) : undefined,
      hips: measurements.hips ? Number(measurements.hips) : undefined,
    };

    try {
      measurementSchema.parse(parsedMeasurements);
    } catch (validationError) {
      if (validationError instanceof z.ZodError) {
        setError(validationError.errors[0].message);
      } else {
        setError("Invalid measurements");
      }
      return;
    }

    if (
      !parsedMeasurements.waist &&
      !parsedMeasurements.chest &&
      !parsedMeasurements.hips
    ) {
      setError("At least one measurement is required");
      return;
    }

    await createLog({
      userId,
      date: new Date().toISOString(),
      measurements: parsedMeasurements,
    });
    setMeasurements({ waist: "", chest: "", hips: "" });
  };

  const updateMeasurement = (field: string, value: string) => {
    setMeasurements((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <Card className="p-4 sm:p-6 mb-8">
      <h2 className="text-lg sm:text-xl font-semibold mb-4">
        Log Body Measurements
      </h2>
      {error && <div className="text-red-500 text-sm mb-4">{error}</div>}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <Input
            type="number"
            placeholder="Waist (cm)"
            value={measurements.waist}
            onChange={(e) => updateMeasurement("waist", e.target.value)}
            className="w-full sm:w-1/3"
          />
          <Input
            type="number"
            placeholder="Chest (cm)"
            value={measurements.chest}
            onChange={(e) => updateMeasurement("chest", e.target.value)}
            className="w-full sm:w-1/3"
          />
          <Input
            type="number"
            placeholder="Hips (cm)"
            value={measurements.hips}
            onChange={(e) => updateMeasurement("hips", e.target.value)}
            className="w-full sm:w-1/3"
          />
        </div>
        <Button onClick={handleLogMeasurements} className="w-full sm:w-auto">
          Log Measurements
        </Button>
      </div>
    </Card>
  );
};
