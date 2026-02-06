import { z } from "zod";

// Muscle Group enum - UPPERCASE to match API
export const muscleGroupSchema = z.enum([
  "CHEST",
  "BACK",
  "SHOULDERS",
  "BICEPS",
  "TRICEPS",
  "LEGS",
  "CORE",
  "OTHER",
]);

// API Request Schemas
export const createExerciseSchema = z.object({
  name: z
    .string()
    .min(3, "Name must be at least 3 characters")
    .max(50, "Name must be at most 50 characters"),
  muscleGroup: muscleGroupSchema,
});

export const updateExerciseSchema = z.object({
  name: z
    .string()
    .min(3, "Name must be at least 3 characters")
    .max(50, "Name must be at most 50 characters")
    .optional(),
  muscleGroup: muscleGroupSchema.optional(),
});

// API Response Type
export interface Exercise {
  id: string;
  name: string;
  muscleGroup: MuscleGroup;
}

// TypeScript types
export type MuscleGroup = z.infer<typeof muscleGroupSchema>;
export type CreateExerciseInput = z.infer<typeof createExerciseSchema>;
export type UpdateExerciseInput = z.infer<typeof updateExerciseSchema>;
