import { z } from "zod";

export const muscleGroupSchema = z.enum([
  "chest",
  "back",
  "shoulders",
  "biceps",
  "triceps",
  "legs",
  "abs",
  "cardio",
]);

export const exerciseSchema = z.object({
  id: z.string(),
  name: z.string(),
  muscleGroup: muscleGroupSchema,
  description: z.string().optional(),
});

// TypeScript types
export type MuscleGroup = z.infer<typeof muscleGroupSchema>;
export type Exercise = z.infer<typeof exerciseSchema>;
