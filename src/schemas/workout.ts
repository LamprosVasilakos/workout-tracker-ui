import { z } from "zod";

export const setTypeSchema = z.enum(["normal", "warmup", "dropset", "failure"]);

export const exerciseSetSchema = z.object({
  setNumber: z.number().min(1),
  weight: z.number().min(0),
  reps: z.number().min(0),
  setType: setTypeSchema,
  notes: z.string().optional(),
});

export const workoutExerciseSchema = z.object({
  id: z.string(),
  exerciseId: z.string(),
  exerciseName: z.string(),
  sets: z.array(exerciseSetSchema),
  order: z.number(),
});

export const workoutSchema = z.object({
  id: z.string(),
  date: z.string(), // ISO date string
  exercises: z.array(workoutExerciseSchema),
  createdAt: z.string(),
  updatedAt: z.string(),
});

// TypeScript types
export type SetType = z.infer<typeof setTypeSchema>;
export type ExerciseSet = z.infer<typeof exerciseSetSchema>;
export type WorkoutExercise = z.infer<typeof workoutExerciseSchema>;
export type Workout = z.infer<typeof workoutSchema>;
