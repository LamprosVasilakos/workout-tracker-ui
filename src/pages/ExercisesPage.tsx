import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CreateExerciseModal from "@/components/CreateExerciseModal";
import { mockExercises } from "@/services/mockData";
import type { MuscleGroup, Exercise } from "@/schemas/exercise";

const muscleGroups: { value: MuscleGroup; label: string }[] = [
  { value: "chest", label: "Chest" },
  { value: "back", label: "Back" },
  { value: "shoulders", label: "Shoulders" },
  { value: "biceps", label: "Biceps" },
  { value: "triceps", label: "Triceps" },
  { value: "legs", label: "Legs" },
  { value: "core", label: "Core" },
  { value: "other", label: "Other" },
];

function ExercisesPage() {
  const navigate = useNavigate();
  const [selectedMuscleGroup, setSelectedMuscleGroup] =
    useState<MuscleGroup>("chest");
  const [exercises, setExercises] = useState<Exercise[]>(mockExercises);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const filteredExercises = exercises.filter(
    (exercise) => exercise.muscleGroup === selectedMuscleGroup,
  );

  const handleCreateExercise = (newExercise: Omit<Exercise, "id">) => {
    const exercise: Exercise = {
      ...newExercise,
      id: crypto.randomUUID(),
    };
    setExercises((prev) => [...prev, exercise]);
  };

  const handleDeleteExercise = (exerciseId: string) => {
    if (
      confirm(
        "Are you sure you want to delete this exercise? This action cannot be undone.",
      )
    ) {
      setExercises((prev) => prev.filter((ex) => ex.id !== exerciseId));
    }
  };

  const handleAddExercise = (exerciseId: string) => {
    console.log("Adding exercise:", exerciseId);
    // In real app, this would add to current workout
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              onClick={() => navigate("/workouts")}
              className="gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
            <div className="flex-1">
              <h1 className="text-2xl font-bold">Exercise Library</h1>
              <p className="text-sm text-muted-foreground">
                Choose exercises to add to your workout
              </p>
            </div>
            <Button
              onClick={() => setIsCreateModalOpen(true)}
              className="gap-2"
            >
              <Plus className="w-4 h-4" />
              Create Exercise
            </Button>
          </div>
        </div>
      </header>
      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        <Tabs
          value={selectedMuscleGroup}
          onValueChange={(value) =>
            setSelectedMuscleGroup(value as MuscleGroup)
          }
        >
          {/* Muscle Group Tabs */}
          <TabsList className="grid w-full grid-cols-4 lg:grid-cols-8 gap-y-2 mb-6 !h-auto">
            {muscleGroups.map((group) => (
              <TabsTrigger key={group.value} value={group.value}>
                {group.label}
              </TabsTrigger>
            ))}
          </TabsList>

          {/* Exercise Cards */}
          {muscleGroups.map((group) => (
            <TabsContent key={group.value} value={group.value} className="mt-2">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredExercises.map((exercise) => (
                  <Card
                    key={exercise.id}
                    className="hover:shadow-md transition-all cursor-pointer group"
                    onClick={() => handleAddExercise(exercise.id)}
                  >
                    <CardHeader>
                      <div className="flex items-start justify-between gap-2">
                        <CardTitle className="text-lg flex-1">
                          {exercise.name}
                        </CardTitle>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-8 w-8 p-0"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteExercise(exercise.id);
                          }}
                        >
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      </div>
                    </CardHeader>
                  </Card>
                ))}
              </div>

              {filteredExercises.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">
                    No exercises found for this muscle group
                  </p>
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </main>
      {/* Create Exercise Modal */}
      <CreateExerciseModal
        open={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
        onCreateExercise={handleCreateExercise}
      />{" "}
    </div>
  );
}

export default ExercisesPage;
