import { z } from "zod";
import { type Exercise } from "./exercise.ts";

// Set Type enum - matches API
export const setTypeSchema = z.enum(["WARM_UP", "WORKING"]);

// API Request Schemas
export const createSetSchema = z.object({
  reps: z.number().min(1, "Reps must be at least 1"),
  weight: z.number().min(0, "Weight must be at least 0"),
  notes: z.string().max(250, "Notes must be at most 250 characters").optional(),
  setType: setTypeSchema,
});

export const createWorkoutExerciseSchema = z.object({
  exerciseId: z.string(),
  exerciseOrder: z.number().int().min(1),
  sets: z.array(createSetSchema),
});

export const createWorkoutSchema = z.object({
  date: z.string(), // ISO 8601 date (YYYY-MM-DD)
  workoutExercises: z.array(createWorkoutExerciseSchema),
});

// API Response Types
export interface SetResponse {
  id: string;
  reps: number;
  weight: number;
  notes: string | null;
  setType: SetType;
}

export interface WorkoutExerciseResponse {
  id: string;
  exercise: Exercise;
  exerciseOrder: number;
  sets: SetResponse[];
}

export interface WorkoutResponse {
  id: string;
  date: string; // ISO 8601 date
  workoutExercises: WorkoutExerciseResponse[];
}

export interface WorkoutSummaryResponse {
  id: string;
  date: string; // ISO 8601 date
}

// TypeScript types for forms
export type SetType = z.infer<typeof setTypeSchema>;
export type CreateSetInput = z.infer<typeof createSetSchema>;
export type CreateWorkoutExerciseInput = z.infer<
  typeof createWorkoutExerciseSchema
>;
export type CreateWorkoutInput = z.infer<typeof createWorkoutSchema>;
