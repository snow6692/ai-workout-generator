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
