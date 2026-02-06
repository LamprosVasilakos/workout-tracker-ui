import { api } from "./api.ts";
import type {
  CreateWorkoutInput,
  WorkoutResponse,
  WorkoutSummaryResponse,
} from "../schemas/workout.ts";

export const workoutService = {
  /**
   * Create a new workout
   */
  async createWorkout(data: CreateWorkoutInput): Promise<WorkoutResponse> {
    const response = await api.post<WorkoutResponse>("/workouts", data);
    return response.data;
  },

  /**
   * Get full workout details by ID
   */
  async getWorkout(id: string): Promise<WorkoutResponse> {
    const response = await api.get<WorkoutResponse>(`/workouts/${id}`);
    return response.data;
  },

  /**
   * Get workout summaries within a date range
   */
  async getWorkouts(
    startDate: string,
    endDate: string,
  ): Promise<WorkoutSummaryResponse[]> {
    const response = await api.get<WorkoutSummaryResponse[]>("/workouts", {
      params: { startDate, endDate },
    });
    return response.data;
  },

  /**
   * Update an existing workout
   */
  async updateWorkout(
    id: string,
    data: CreateWorkoutInput,
  ): Promise<WorkoutResponse> {
    const response = await api.put<WorkoutResponse>(`/workouts/${id}`, data);
    return response.data;
  },

  /**
   * Delete a workout
   */
  async deleteWorkout(id: string): Promise<void> {
    await api.delete(`/workouts/${id}`);
  },
};
