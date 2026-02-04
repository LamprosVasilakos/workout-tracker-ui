import { useState, useMemo } from "react";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import { Plus, LogOut, Dumbbell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import WorkoutCalendar from "@/components/WorkoutCalendar";
import ExerciseCard from "@/components/ExerciseCard";
import type { Workout, ExerciseSet } from "@/schemas/workout";

// Mock workout data
const mockWorkouts: Workout[] = [
  {
    id: "w1",
    date: format(new Date(), "yyyy-MM-dd"),
    exercises: [
      {
        id: "we1",
        exerciseId: "1",
        exerciseName: "Bench Press",
        order: 1,
        sets: [
          {
            setNumber: 1,
            weight: 60,
            reps: 12,
            setType: "warmup",
            notes: "Easy warmup",
          },
          { setNumber: 2, weight: 80, reps: 10, setType: "normal" },
          { setNumber: 3, weight: 90, reps: 8, setType: "normal" },
          {
            setNumber: 4,
            weight: 95,
            reps: 6,
            setType: "normal",
            notes: "Felt strong",
          },
        ],
      },
      {
        id: "we2",
        exerciseId: "2",
        exerciseName: "Incline Dumbbell Press",
        order: 2,
        sets: [
          { setNumber: 1, weight: 25, reps: 12, setType: "normal" },
          { setNumber: 2, weight: 30, reps: 10, setType: "normal" },
          {
            setNumber: 3,
            weight: 30,
            reps: 8,
            setType: "dropset",
            notes: "Dropped to 20kg",
          },
        ],
      },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "w2",
    date: format(new Date(Date.now() - 86400000 * 2), "yyyy-MM-dd"), // 2 days ago
    exercises: [
      {
        id: "we3",
        exerciseId: "5",
        exerciseName: "Deadlift",
        order: 1,
        sets: [
          { setNumber: 1, weight: 100, reps: 8, setType: "normal" },
          { setNumber: 2, weight: 120, reps: 6, setType: "normal" },
          { setNumber: 3, weight: 140, reps: 4, setType: "normal" },
          {
            setNumber: 4,
            weight: 150,
            reps: 2,
            setType: "failure",
            notes: "Failed on 3rd rep",
          },
        ],
      },
    ],
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
];

function WorkoutPage() {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    new Date(),
  );
  const [workouts, setWorkouts] = useState<Workout[]>(mockWorkouts);
  const [editingExerciseId, setEditingExerciseId] = useState<string | null>(
    null,
  );

  // Get workout dates for calendar highlighting
  const workoutDates = useMemo(() => workouts.map((w) => w.date), [workouts]);

  // Get workout for selected date
  const selectedWorkout = useMemo(() => {
    if (!selectedDate) return null;
    const dateString = format(selectedDate, "yyyy-MM-dd");
    return workouts.find((w) => w.date === dateString) || null;
  }, [selectedDate, workouts]);

  const handleDeleteExercise = (exerciseId: string) => {
    if (!selectedWorkout) return;

    setWorkouts((prev) =>
      prev.map((workout) => {
        if (workout.id === selectedWorkout.id) {
          return {
            ...workout,
            exercises: workout.exercises.filter((ex) => ex.id !== exerciseId),
            updatedAt: new Date().toISOString(),
          };
        }
        return workout;
      }),
    );
  };

  const handleUpdateSet = (
    exerciseId: string,
    setNumber: number,
    updatedSet: Partial<ExerciseSet>,
  ) => {
    if (!selectedWorkout) return;

    setWorkouts((prev) =>
      prev.map((workout) => {
        if (workout.id === selectedWorkout.id) {
          return {
            ...workout,
            exercises: workout.exercises.map((exercise) => {
              if (exercise.id === exerciseId) {
                return {
                  ...exercise,
                  sets: exercise.sets.map((set) =>
                    set.setNumber === setNumber
                      ? { ...set, ...updatedSet }
                      : set,
                  ),
                };
              }
              return exercise;
            }),
            updatedAt: new Date().toISOString(),
          };
        }
        return workout;
      }),
    );
  };

  const handleLogout = () => {
    navigate("/login");
  };

  return (
    <div className="h-screen flex flex-col bg-background overflow-hidden">
      {/* Header */}
      <header className="border-b bg-card shrink-0">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary rounded-lg">
                <Dumbbell className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">Workout Tracker</h1>
                <p className="text-base text-muted-foreground">
                  Track your fitness journey
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={() => navigate("/exercises")}
                className="gap-2"
              >
                <Plus className="w-4 h-4" />
                Add Exercise
              </Button>
              <Button variant="ghost" onClick={handleLogout} className="gap-2">
                <LogOut className="w-4 h-4" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6 flex-1 overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full">
          {/* Left Column - Calendar */}
          <div className="lg:col-span-5">
            <WorkoutCalendar
              selectedDate={selectedDate}
              onDateSelect={setSelectedDate}
              workoutDates={workoutDates}
            />
          </div>

          {/* Right Column - Workout Exercises */}
          <div className="lg:col-span-7 h-full">
            <Card className="p-6 h-full flex flex-col">
              <div className="flex items-center justify-between mb-4 shrink-0">
                <div>
                  <h2 className="text-3xl font-bold">
                    {selectedDate
                      ? format(selectedDate, "EEEE, MMMM d, yyyy")
                      : "Select a date"}
                  </h2>
                  {selectedWorkout && (
                    <p className="text-base text-muted-foreground mt-1">
                      {selectedWorkout.exercises.length} exercise
                      {selectedWorkout.exercises.length !== 1 ? "s" : ""}
                    </p>
                  )}
                </div>
                {selectedWorkout && (
                  <Button variant="outline" className="gap-2">
                    <Plus className="w-4 h-4" />
                    Add Exercise
                  </Button>
                )}
              </div>

              {/* Exercises List - Scrollable */}
              <ScrollArea className="h-[calc(100vh-280px)] w-full">
                <div className="pr-4">
                  {selectedWorkout ? (
                    <div className="space-y-4">
                      {selectedWorkout.exercises.map((exercise) => (
                        <ExerciseCard
                          key={exercise.id}
                          exercise={exercise}
                          isEditing={editingExerciseId === exercise.id}
                          onEdit={() => setEditingExerciseId(exercise.id)}
                          onSave={() => setEditingExerciseId(null)}
                          onDelete={() => handleDeleteExercise(exercise.id)}
                          onUpdateSet={(setNumber, updatedSet) =>
                            handleUpdateSet(exercise.id, setNumber, updatedSet)
                          }
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                      <div className="p-4 bg-muted rounded-full mb-4">
                        <Dumbbell className="w-8 h-8 text-muted-foreground" />
                      </div>
                      <h3 className="text-lg font-semibold mb-2">
                        No workout logged
                      </h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Start tracking your exercises for this day
                      </p>
                      <Button className="gap-2">
                        <Plus className="w-4 h-4" />
                        Create Workout
                      </Button>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}

export default WorkoutPage;
