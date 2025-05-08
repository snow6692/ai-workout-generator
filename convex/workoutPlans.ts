import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const createOrUpdatePlan = mutation({
  args: {
    userId: v.string(),
    name: v.string(),
    workoutPlan: v.object({
      schedule: v.array(v.string()),
      exercises: v.array(
        v.object({
          day: v.string(),
          routines: v.array(
            v.object({
              name: v.string(),
              sets: v.optional(v.number()),
              reps: v.optional(v.number()),
              duration: v.optional(v.string()),
              description: v.optional(v.string()),
              exercises: v.optional(v.array(v.string())),
            })
          ),
        })
      ),
    }),
    dietPlan: v.object({
      dailyCalories: v.number(),
      meals: v.array(
        v.object({
          name: v.string(),
          foods: v.array(v.string()),
        })
      ),
    }),
  },
  handler: async (ctx, args) => {
    const existingPlan = await ctx.db
      .query("plans")
      .withIndex("by_user_id", (q) => q.eq("userId", args.userId))
      .filter((q) => q.eq(q.field("isActive"), true))
      .first();

    if (existingPlan) {
      await ctx.db.patch(existingPlan._id, {
        name: args.name,
        workoutPlan: args.workoutPlan,
        dietPlan: args.dietPlan,
        isActive: true,
      });
    } else {
      await ctx.db.insert("plans", {
        userId: args.userId,
        name: args.name,
        workoutPlan: args.workoutPlan,
        dietPlan: args.dietPlan,
        isActive: true,
      });
    }
  },
});

export const getActivePlan = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("plans")
      .withIndex("by_user_id", (q) => q.eq("userId", args.userId))
      .filter((q) => q.eq(q.field("isActive"), true))
      .first();
  },
});
