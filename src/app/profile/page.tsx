"use client";

import { useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useState } from "react";
import ProfileHeader from "../components/ProfileHeader";
import NoFitnessPlan from "@/components/NoFitnessPlan";
import CornerElements from "../components/CornerElements";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AppleIcon, CalendarIcon, DumbbellIcon } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Doc } from "../../../convex/_generated/dataModel";
import Link from "next/link";

const ProfilePage = () => {
  const { user } = useUser();
  const userId = user?.id as string;

  const allPlans = useQuery(api.plans.getUserPlans, { userId });
  const [selectedPlanId, setSelectedPlanId] = useState<null | string>(null);

  const activePlan = allPlans?.find((plan: Doc<"plans">) => plan.isActive);

  const currentPlan = selectedPlanId
    ? allPlans?.find((plan: Doc<"plans">) => plan._id === selectedPlanId)
    : activePlan;

  return (
    <section className="relative z-10 pt-12 pb-24 flex-grow container mx-auto px-4">
      <ProfileHeader user={user} />

      <div className="mb-8">
        <Button
          asChild
          className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 text-base font-mono"
        >
          <Link href="/progress">View Progress</Link>
        </Button>
      </div>

      {allPlans && allPlans?.length > 0 ? (
        <div className="space-y-8">
          {/* PLAN SELECTOR */}
          <div className="relative backdrop-blur-sm border border-blue-600/50 bg-gradient-to-br from-blue-600/10 to-orange-500/10 p-4 md:p-6 rounded-lg shadow-[0_0_8px_rgba(37,99,235,0.5)]">
            <CornerElements />
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4">
              <h2 className="text-2xl font-bold tracking-tight">
                <span className="text-blue-600">Your</span>{" "}
                <span className="text-orange-500">Fitness Plans</span>
              </h2>
              <div className="font-mono text-sm text-muted-foreground mt-2 sm:mt-0">
                TOTAL: {allPlans.length}
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              {allPlans.map((plan: Doc<"plans">) => (
                <Button
                  key={plan._id}
                  onClick={() => setSelectedPlanId(plan._id)}
                  className={`font-mono text-sm border transition-all ${
                    selectedPlanId === plan._id || plan.isActive
                      ? "bg-blue-600/20 text-blue-600 border-blue-600"
                      : "bg-transparent text-foreground border-border hover:bg-orange-500/20 hover:border-orange-500"
                  }`}
                >
                  {plan.name}
                  {plan.isActive && (
                    <span className="ml-2 bg-green-500/20 text-green-500 text-xs px-2 py-0.5 rounded">
                      ACTIVE
                    </span>
                  )}
                </Button>
              ))}
            </div>
          </div>

          {/* PLAN DETAILS */}
          {currentPlan && (
            <div className="relative backdrop-blur-sm border border-blue-600/50 bg-gradient-to-br from-blue-600/10 to-orange-500/10 p-4 md:p-6 rounded-lg shadow-[0_0_8px_rgba(37,99,235,0.5)]">
              <CornerElements />
              <div className="flex items-center gap-2 mb-4">
                <div className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></div>
                <h3 className="text-xl font-bold">
                  PLAN:{" "}
                  <span className="text-orange-500">{currentPlan.name}</span>
                </h3>
              </div>

              <Tabs defaultValue="workout" className="w-full">
                <TabsList className="mb-6 w-full grid grid-cols-2 bg-transparent border-b border-blue-600/50">
                  <TabsTrigger
                    value="workout"
                    className="font-mono text-sm data-[state=active]:bg-blue-600/20 data-[state=active]:text-blue-600 data-[state=active]:border-b-2 data-[state=active]:border-blue-600"
                  >
                    <DumbbellIcon className="mr-2 size-4" />
                    Workout Plan
                  </TabsTrigger>
                  <TabsTrigger
                    value="diet"
                    className="font-mono text-sm data-[state=active]:bg-blue-600/20 data-[state=active]:text-blue-600 data-[state=active]:border-b-2 data-[state=active]:border-blue-600"
                  >
                    <AppleIcon className="mr-2 size-4" />
                    Diet Plan
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="workout">
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 mb-4">
                      <CalendarIcon className="size-4 text-blue-600" />
                      <span className="font-mono text-sm text-muted-foreground">
                        SCHEDULE: {currentPlan.workoutPlan.schedule.join(", ")}
                      </span>
                    </div>

                    <Accordion type="multiple" className="space-y-3">
                      {currentPlan.workoutPlan.exercises.map(
                        (exerciseDay, index) => (
                          <AccordionItem
                            key={index}
                            value={exerciseDay.day}
                            className="border border-blue-600/30 rounded-lg overflow-hidden bg-background/50 transition-all hover:shadow-[0_0_6px_rgba(37,99,235,0.3)]"
                          >
                            <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-blue-600/10 font-mono text-sm">
                              <div className="flex justify-between w-full items-center">
                                <span className="text-blue-600">
                                  {exerciseDay.day}
                                </span>
                                <div className="text-xs text-muted-foreground">
                                  {exerciseDay.routines.length} EXERCISES
                                </div>
                              </div>
                            </AccordionTrigger>

                            <AccordionContent className="pb-4 px-4">
                              <div className="space-y-3 mt-2">
                                {exerciseDay.routines.map(
                                  (routine, routineIndex) => (
                                    <div
                                      key={routineIndex}
                                      className="border border-blue-600/20 rounded p-3 bg-gradient-to-r from-blue-600/5 to-orange-500/5"
                                    >
                                      <div className="flex justify-between items-start mb-2">
                                        <h4 className="font-semibold text-foreground">
                                          {routine.name}
                                        </h4>
                                        <div className="flex items-center gap-2">
                                          <div className="px-2 py-1 rounded bg-blue-600/20 text-blue-600 text-xs font-mono">
                                            {routine.sets} SETS
                                          </div>
                                          <div className="px-2 py-1 rounded bg-orange-500/20 text-orange-500 text-xs font-mono">
                                            {routine.reps} REPS
                                          </div>
                                        </div>
                                      </div>
                                      {routine.description && (
                                        <p className="text-sm text-muted-foreground mt-1">
                                          {routine.description}
                                        </p>
                                      )}
                                      <Button
                                        asChild
                                        variant="outline"
                                        size="sm"
                                        className="mt-2 bg-green-500/20 text-green-500 border-green-500/50 hover:bg-green-500/30"
                                      >
                                        <Link
                                          href={`/progress?day=${encodeURIComponent(
                                            exerciseDay.day
                                          )}`}
                                        >
                                          Log Workout
                                        </Link>
                                      </Button>
                                    </div>
                                  )
                                )}
                              </div>
                            </AccordionContent>
                          </AccordionItem>
                        )
                      )}
                    </Accordion>
                  </div>
                </TabsContent>

                <TabsContent value="diet">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center mb-4">
                      <span className="font-mono text-sm text-muted-foreground">
                        DAILY CALORIE TARGET
                      </span>
                      <div className="font-mono text-xl text-blue-600">
                        {currentPlan.dietPlan.dailyCalories} KCAL
                      </div>
                    </div>

                    <div className="h-px w-full bg-gradient-to-r from-blue-600/50 to-orange-500/50 my-4"></div>

                    <div className="space-y-4">
                      {currentPlan.dietPlan.meals.map((meal, index) => (
                        <div
                          key={index}
                          className="border border-blue-600/20 rounded-lg p-4 bg-gradient-to-r from-blue-600/5 to-orange-500/5"
                        >
                          <div className="flex items-center gap-2 mb-3">
                            <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                            <h4 className="font-mono text-orange-500">
                              {meal.name}
                            </h4>
                          </div>
                          <ul className="space-y-2">
                            {meal.foods.map((food, foodIndex) => (
                              <li
                                key={foodIndex}
                                className="flex items-center gap-2 text-sm text-muted-foreground"
                              >
                                <span className="text-xs text-blue-600 font-mono">
                                  {String(foodIndex + 1).padStart(2, "0")}
                                </span>
                                {food}
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          )}
        </div>
      ) : (
        <NoFitnessPlan />
      )}
    </section>
  );
};

export default ProfilePage;
