"use client";

import { useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { WeightLogForm } from "@/components/progress/WeightLogForm";
import { WorkoutLogForm } from "@/components/progress/WorkoutLogForm";
import { WeightHistoryChart } from "@/components/progress/WeightHistoryChart";
import { ProgressSummary } from "@/components/progress/ProgressSummary";
import { WorkoutHistory } from "@/components/progress/WorkoutHistory";
import { MeasurementsLogForm } from "@/components/progress/MeasurementsLogForm";
import { MeasurementsHistory } from "@/components/progress/MeasurementsHistory";

const ProgressPage = () => {
  const { user } = useUser();
  const userId = user?.id as string;
  const logs = useQuery(api.progressLogs.getUserLogs, { userId }) || [];
  const recentLogs =
    useQuery(api.progressLogs.getRecentWorkoutLogs, { userId, days: 10 }) || [];
  const activePlan = useQuery(api.progressLogs.getActivePlan, { userId });

  return (
    <div className="container mx-auto px-4 mt-12 py-12">
      <h1 className="text-2xl sm:text-3xl font-bold mb-8">
        <span className="text-primary">Track</span> Your Progress
      </h1>

      <WeightLogForm userId={userId} />
      <MeasurementsLogForm userId={userId} />
      {activePlan && <WorkoutLogForm userId={userId} activePlan={activePlan} />}
      <WeightHistoryChart logs={logs} />
      <MeasurementsHistory logs={logs} />
      <ProgressSummary logs={logs} recentLogs={recentLogs} />
      <WorkoutHistory logs={logs} />
    </div>
  );
};

export default ProgressPage;
