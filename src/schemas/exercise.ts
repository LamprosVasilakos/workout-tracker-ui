import { z } from "zod";

export const muscleGroupSchema = z.enum([
  "chest",
  "back",
  "shoulders",
  "biceps",
  "triceps",
  "legs",
  "core",
  "other",
]);

export const exerciseSchema = z.object({
  id: z.string(),
  name: z.string(),
  muscleGroup: muscleGroupSchema,
});

// TypeScript types
export type MuscleGroup = z.infer<typeof muscleGroupSchema>;
export type Exercise = z.infer<typeof exerciseSchema>;
