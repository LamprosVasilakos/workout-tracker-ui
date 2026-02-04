import type { Exercise } from "@/schemas/exercise";

export const mockExercises: Exercise[] = [
  // Chest
  {
    id: "1",
    name: "Bench Press",
    muscleGroup: "chest",
    description: "Barbell bench press",
  },
  {
    id: "2",
    name: "Incline Dumbbell Press",
    muscleGroup: "chest",
    description: "Incline press with dumbbells",
  },
  {
    id: "3",
    name: "Cable Flyes",
    muscleGroup: "chest",
    description: "Cable chest flyes",
  },
  {
    id: "4",
    name: "Push-ups",
    muscleGroup: "chest",
    description: "Bodyweight push-ups",
  },

  // Back
  {
    id: "5",
    name: "Deadlift",
    muscleGroup: "back",
    description: "Conventional deadlift",
  },
  {
    id: "6",
    name: "Pull-ups",
    muscleGroup: "back",
    description: "Wide grip pull-ups",
  },
  {
    id: "7",
    name: "Barbell Row",
    muscleGroup: "back",
    description: "Bent over barbell row",
  },
  {
    id: "8",
    name: "Lat Pulldown",
    muscleGroup: "back",
    description: "Cable lat pulldown",
  },

  // Shoulders
  {
    id: "9",
    name: "Overhead Press",
    muscleGroup: "shoulders",
    description: "Standing barbell press",
  },
  {
    id: "10",
    name: "Lateral Raises",
    muscleGroup: "shoulders",
    description: "Dumbbell lateral raises",
  },
  {
    id: "11",
    name: "Face Pulls",
    muscleGroup: "shoulders",
    description: "Cable face pulls",
  },
  {
    id: "12",
    name: "Arnold Press",
    muscleGroup: "shoulders",
    description: "Seated Arnold press",
  },

  // Biceps
  {
    id: "13",
    name: "Barbell Curl",
    muscleGroup: "biceps",
    description: "Standing barbell curl",
  },
  {
    id: "14",
    name: "Hammer Curls",
    muscleGroup: "biceps",
    description: "Dumbbell hammer curls",
  },
  {
    id: "15",
    name: "Preacher Curl",
    muscleGroup: "biceps",
    description: "EZ bar preacher curl",
  },

  // Triceps
  {
    id: "16",
    name: "Close Grip Bench",
    muscleGroup: "triceps",
    description: "Close grip bench press",
  },
  {
    id: "17",
    name: "Tricep Dips",
    muscleGroup: "triceps",
    description: "Parallel bar dips",
  },
  {
    id: "18",
    name: "Overhead Extension",
    muscleGroup: "triceps",
    description: "Dumbbell overhead extension",
  },

  // Legs
  { id: "19", name: "Squat", muscleGroup: "legs", description: "Back squat" },
  {
    id: "20",
    name: "Romanian Deadlift",
    muscleGroup: "legs",
    description: "RDL for hamstrings",
  },
  {
    id: "21",
    name: "Leg Press",
    muscleGroup: "legs",
    description: "Machine leg press",
  },
  {
    id: "22",
    name: "Leg Curl",
    muscleGroup: "legs",
    description: "Lying leg curl",
  },
  {
    id: "23",
    name: "Calf Raises",
    muscleGroup: "legs",
    description: "Standing calf raises",
  },

  // Abs
  {
    id: "24",
    name: "Hanging Leg Raises",
    muscleGroup: "abs",
    description: "Hanging knee/leg raises",
  },
  {
    id: "25",
    name: "Plank",
    muscleGroup: "abs",
    description: "Front plank hold",
  },
  {
    id: "26",
    name: "Cable Crunches",
    muscleGroup: "abs",
    description: "Kneeling cable crunches",
  },

  // Cardio
  {
    id: "27",
    name: "Running",
    muscleGroup: "cardio",
    description: "Outdoor or treadmill running",
  },
  {
    id: "28",
    name: "Cycling",
    muscleGroup: "cardio",
    description: "Stationary or outdoor cycling",
  },
  {
    id: "29",
    name: "Rowing",
    muscleGroup: "cardio",
    description: "Rowing machine",
  },
];
