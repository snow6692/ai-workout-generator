import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const createLog = mutation({
  args: {
    userId: v.string(),
    date: v.string(),
    weight: v.optional(v.number()),
    measurements: v.optional(
      v.object({
        waist: v.optional(v.number()),
        chest: v.optional(v.number()),
        hips: v.optional(v.number()),
      })
    ),
    workoutPerformance: v.optional(
      v.array(
        v.object({
          exerciseName: v.string(),
          setsCompleted: v.number(),
          repsCompleted: v.number(),
          weightUsed: v.optional(v.number()),
        })
      )
    ),
  },
  handler: async (ctx, args) => {
    const logId = await ctx.db.insert("progress_logs", {
      userId: args.userId,
      date: args.date,
      weight: args.weight,
      measurements: args.measurements,
      workoutPerformance: args.workoutPerformance,
    });
    return logId;
  },
});

export const getUserLogs = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("progress_logs")
      .filter((q) => q.eq(q.field("userId"), args.userId))
      .order("desc")
      .take(50);
  },
});

export const getActivePlan = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("plans")
      .filter((q) => q.eq(q.field("userId"), args.userId))
      .filter((q) => q.eq(q.field("isActive"), true))
      .first();
  },
});

export const getRecentWorkoutLogs = query({
  args: { userId: v.string(), days: v.number() },
  handler: async (ctx, args) => {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - args.days);
    return await ctx.db
      .query("progress_logs")
      .filter((q) => q.eq(q.field("userId"), args.userId))
      .filter((q) => q.gte(q.field("date"), cutoffDate.toISOString()))
      .order("desc")
      .collect();
  },
});

export const getWorkoutStreak = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    const logs = await ctx.db
      .query("progress_logs")
      .filter((q) => q.eq(q.field("userId"), args.userId))
      .filter((q) => q.neq(q.field("workoutPerformance"), undefined))
      .order("desc")
      .collect();

    if (!logs.length) {
      return { currentStreak: 0, longestStreak: 0 };
    }

    // Get unique dates with workouts
    const workoutDates = Array.from(
      new Set(logs.map((log) => log.date.split("T")[0]))
    ).sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

    // Calculate current streak
    let currentStreak = 0;
    let currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    for (let i = 0; i < workoutDates.length; i++) {
      const logDate = new Date(workoutDates[i]);
      logDate.setHours(0, 0, 0, 0);

      // Check if log is for current or previous day
      const diffDays = Math.round(
        (currentDate.getTime() - logDate.getTime()) / (1000 * 60 * 60 * 24)
      );

      if (diffDays <= 1) {
        currentStreak++;
        currentDate = logDate;
      } else {
        break;
      }
    }

    // Calculate longest streak
    let longestStreak = 0;
    let tempStreak = 1;
    for (let i = 1; i < workoutDates.length; i++) {
      const prevDate = new Date(workoutDates[i - 1]);
      const currDate = new Date(workoutDates[i]);
      prevDate.setHours(0, 0, 0, 0);
      currDate.setHours(0, 0, 0, 0);

      const diffDays = Math.round(
        (prevDate.getTime() - currDate.getTime()) / (1000 * 60 * 60 * 24)
      );

      if (diffDays === 1) {
        tempStreak++;
      } else {
        longestStreak = Math.max(longestStreak, tempStreak);
        tempStreak = 1;
      }
    }
    longestStreak = Math.max(longestStreak, tempStreak);

    return { currentStreak, longestStreak };
  },
});
