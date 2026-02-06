import { api } from "./api.ts";
import type {
  Exercise,
  MuscleGroup,
  CreateExerciseInput,
  UpdateExerciseInput,
} from "../schemas/exercise.ts";

export const exerciseService = {
  /**
   * Create a new exercise
   */
  async createExercise(data: CreateExerciseInput): Promise<Exercise> {
    const response = await api.post<Exercise>("/exercises", data);
    return response.data;
  },

  /**
   * Get a specific exercise by ID
   */
  async getExercise(id: string): Promise<Exercise> {
    const response = await api.get<Exercise>(`/exercises/${id}`);
    return response.data;
  },

  /**
   * Get all exercises for a specific muscle group
   */
  async getExercisesByMuscleGroup(
    muscleGroup: MuscleGroup,
  ): Promise<Exercise[]> {
    const response = await api.get<Exercise[]>("/exercises", {
      params: { muscleGroup },
    });
    return response.data;
  },

  /**
   * Update an existing exercise
   */
  async updateExercise(
    id: string,
    data: UpdateExerciseInput,
  ): Promise<Exercise> {
    const response = await api.put<Exercise>(`/exercises/${id}`, data);
    return response.data;
  },

  /**
   * Delete an exercise
   */
  async deleteExercise(id: string): Promise<void> {
    await api.delete(`/exercises/${id}`);
  },
};
