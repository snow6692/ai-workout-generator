import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    name: v.string(),
    email: v.string(),
    image: v.optional(v.string()),
    clerkId: v.string(),
  }).index("by_clerk_id", ["clerkId"]),

  plans: defineTable({
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
    isActive: v.boolean(),
  })
    .index("by_user_id", ["userId"])
    .index("by_active", ["isActive"]),

  progress_logs: defineTable({
    userId: v.string(),
    date: v.string(), // ISO string, e.g., "2025-05-08T15:00:00Z"
    weight: v.optional(v.number()), // in kg 
    measurements: v.optional(
      v.object({
        waist: v.optional(v.number()), // in cm 
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
          weightUsed: v.optional(v.number()), // weight lifted, if applicable
        })
      )
    ),
  })
    .index("by_userId", ["userId"])
    .index("by_userId_date", ["userId", "date"]), // For efficient date-based queries
});
