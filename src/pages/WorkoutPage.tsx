import { useState, useMemo, useRef, useEffect } from "react";
import { format, startOfMonth, endOfMonth } from "date-fns";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, LogOut, Dumbbell } from "lucide-react";
import { Button } from "@/components/ui/button.tsx";
import { Card } from "@/components/ui/card.tsx";
import { ScrollArea } from "@/components/ui/scroll-area.tsx";
import WorkoutCalendar from "@/components/WorkoutCalendar.tsx";
import ExerciseCard from "@/components/ExerciseCard.tsx";
import AddExerciseModal from "@/components/AddExerciseModal.tsx";
import { workoutService } from "@/services/workoutService.ts";
import { useAuth } from "@/hooks/useAuth.ts";
import type {
  WorkoutExerciseResponse,
  SetResponse,
  CreateWorkoutInput,
} from "@/schemas/workout.ts";

function WorkoutPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { logout } = useAuth();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    new Date(),
  );
  const [editingExerciseId, setEditingExerciseId] = useState<string | null>(
    null,
  );
  const [isAddExerciseModalOpen, setIsAddExerciseModalOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  // Calculate date range for the current month view
  const dateRange = useMemo(() => {
    if (!selectedDate) return { startDate: "", endDate: "" };
    const start = startOfMonth(selectedDate);
    const end = endOfMonth(selectedDate);
    return {
      startDate: format(start, "yyyy-MM-dd"),
      endDate: format(end, "yyyy-MM-dd"),
    };
  }, [selectedDate]);

  // Fetch workout summaries for calendar highlighting
  const { data: workoutSummaries = [] } = useQuery({
    queryKey: ["workouts", "summaries", dateRange.startDate, dateRange.endDate],
    queryFn: () =>
      workoutService.getWorkouts(dateRange.startDate, dateRange.endDate),
    enabled: !!dateRange.startDate && !!dateRange.endDate,
  });

  // Fetch full workout details for selected date
  const selectedDateString = selectedDate
    ? format(selectedDate, "yyyy-MM-dd")
    : "";
  const selectedWorkoutSummary = workoutSummaries.find(
    (w) => w.date === selectedDateString,
  );

  const { data: selectedWorkout } = useQuery({
    queryKey: ["workouts", selectedWorkoutSummary?.id],
    queryFn: () => workoutService.getWorkout(selectedWorkoutSummary!.id),
    enabled: !!selectedWorkoutSummary?.id,
  });

  // Create/update workout mutation
  const createWorkoutMutation = useMutation({
    mutationFn: (data: CreateWorkoutInput) => {
      if (selectedWorkout) {
        return workoutService.updateWorkout(selectedWorkout.id, data);
      }
      return workoutService.createWorkout(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workouts"] });
    },
  });

  // Delete workout mutation
  const deleteWorkoutMutation = useMutation({
    mutationFn: (id: string) => workoutService.deleteWorkout(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workouts"] });
    },
  });

  // Track scroll position to show/hide separator
  useEffect(() => {
    const scrollElement = scrollAreaRef.current?.querySelector(
      "[data-radix-scroll-area-viewport]",
    ) as HTMLElement;

    if (!scrollElement) return;

    const handleScroll = () => {
      setIsScrolled(scrollElement.scrollTop > 10);
    };

    scrollElement.addEventListener("scroll", handleScroll);
    return () => scrollElement.removeEventListener("scroll", handleScroll);
  }, []);

  // Get workout dates for calendar highlighting
  const workoutDates = useMemo(
    () => workoutSummaries.map((w) => w.date),
    [workoutSummaries],
  );

  const handleDeleteExercise = (exerciseId: string) => {
    if (!selectedWorkout) return;

    const updatedExercises = selectedWorkout.workoutExercises.filter(
      (ex) => ex.id !== exerciseId,
    );

    // If no exercises left, delete the workout
    if (updatedExercises.length === 0) {
      deleteWorkoutMutation.mutate(selectedWorkout.id);
      return;
    }

    // Otherwise update the workout
    const workoutData: CreateWorkoutInput = {
      date: selectedWorkout.date,
      workoutExercises: updatedExercises.map((ex, index) => ({
        exerciseId: ex.exercise.id,
        exerciseOrder: index + 1,
        sets: ex.sets.map((set) => ({
          reps: set.reps,
          weight: set.weight,
          notes: set.notes || undefined,
          setType: set.setType,
        })),
      })),
    };

    createWorkoutMutation.mutate(workoutData);
  };

  const handleAddExercise = (
    exerciseId: string,
    sets: Array<{
      reps: number;
      weight: number;
      setType: "WARM_UP" | "WORKING";
      notes: string;
    }>,
  ) => {
    if (!selectedDate) return;

    const dateString = format(selectedDate, "yyyy-MM-dd");
    const newExercise = {
      exerciseId,
      exerciseOrder: (selectedWorkout?.workoutExercises.length || 0) + 1,
      sets: sets.map((set) => ({
        reps: set.reps,
        weight: set.weight,
        setType: set.setType,
        notes: set.notes || undefined,
      })),
    };

    const workoutData: CreateWorkoutInput = {
      date: dateString,
      workoutExercises: selectedWorkout
        ? [
            ...selectedWorkout.workoutExercises.map((ex, index) => ({
              exerciseId: ex.exercise.id,
              exerciseOrder: index + 1,
              sets: ex.sets.map((set) => ({
                reps: set.reps,
                weight: set.weight,
                notes: set.notes || undefined,
                setType: set.setType,
              })),
            })),
            newExercise,
          ]
        : [newExercise],
    };

    createWorkoutMutation.mutate(workoutData);
  };

  const handleUpdateSet = (exerciseId: string, updatedSets: SetResponse[]) => {
    if (!selectedWorkout) return;

    const workoutData: CreateWorkoutInput = {
      date: selectedWorkout.date,
      workoutExercises: selectedWorkout.workoutExercises.map((ex, index) => ({
        exerciseId: ex.exercise.id,
        exerciseOrder: index + 1,
        sets:
          ex.id === exerciseId
            ? updatedSets.map((set) => ({
                reps: set.reps,
                weight: set.weight,
                notes: set.notes || undefined,
                setType: set.setType,
              }))
            : ex.sets.map((set) => ({
                reps: set.reps,
                weight: set.weight,
                notes: set.notes || undefined,
                setType: set.setType,
              })),
      })),
    };

    createWorkoutMutation.mutate(workoutData);
  };

  const handleLogout = () => {
    logout();
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
          <div className="lg:col-span-7 h-full flex flex-col min-h-0">
            <Card className="h-full flex flex-col overflow-hidden">
              {/* Header - Sticky */}
              <div className="px-6 pt-6 pb-3 shrink-0 bg-card z-10">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-3xl font-bold">
                      {selectedDate
                        ? format(selectedDate, "EEEE, MMMM d, yyyy")
                        : "Select a date"}
                    </h2>
                    {selectedWorkout && (
                      <p className="text-base text-muted-foreground mt-1">
                        {selectedWorkout.workoutExercises.length} exercise
                        {selectedWorkout.workoutExercises.length !== 1
                          ? "s"
                          : ""}
                      </p>
                    )}
                  </div>
                  {selectedWorkout && (
                    <Button
                      variant="outline"
                      className="gap-2"
                      onClick={() => setIsAddExerciseModalOpen(true)}
                    >
                      <Plus className="w-4 h-4" />
                      Add Exercise
                    </Button>
                  )}
                </div>
              </div>

              {/* Separator - Visible only when scrolled */}
              <div
                className={`border-b border-border transition-opacity duration-200 ${
                  isScrolled ? "opacity-100" : "opacity-0"
                }`}
              />

              {/* Exercises List - Scrollable */}
              <ScrollArea ref={scrollAreaRef} className="flex-1 min-h-0">
                <div className="px-6 pb-6 pt-3">
                  {selectedWorkout ? (
                    <div className="space-y-4">
                      {selectedWorkout.workoutExercises.map((exercise) => (
                        <ExerciseCard
                          key={exercise.id}
                          exercise={exercise}
                          isEditing={editingExerciseId === exercise.id}
                          onEdit={() => setEditingExerciseId(exercise.id)}
                          onSave={(updatedSets) => {
                            handleUpdateSet(exercise.id, updatedSets);
                            setEditingExerciseId(null);
                          }}
                          onDelete={() => handleDeleteExercise(exercise.id)}
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
                      <Button
                        className="gap-2"
                        onClick={() => setIsAddExerciseModalOpen(true)}
                      >
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

      {/* Add Exercise Modal */}
      <AddExerciseModal
        open={isAddExerciseModalOpen}
        onOpenChange={setIsAddExerciseModalOpen}
        onAddExercise={handleAddExercise}
      />
    </div>
  );
}

export default WorkoutPage;
