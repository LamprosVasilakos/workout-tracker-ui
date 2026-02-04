import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { mockExercises } from "@/services/mockData";
import type { MuscleGroup } from "@/schemas/exercise";

const muscleGroups: { value: MuscleGroup; label: string }[] = [
  { value: "chest", label: "Chest" },
  { value: "back", label: "Back" },
  { value: "shoulders", label: "Shoulders" },
  { value: "biceps", label: "Biceps" },
  { value: "triceps", label: "Triceps" },
  { value: "legs", label: "Legs" },
  { value: "abs", label: "Abs" },
  { value: "cardio", label: "Cardio" },
];

function ExercisesPage() {
  const navigate = useNavigate();
  const [selectedMuscleGroup, setSelectedMuscleGroup] =
    useState<MuscleGroup>("chest");

  const filteredExercises = mockExercises.filter(
    (exercise) => exercise.muscleGroup === selectedMuscleGroup,
  );

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
            <div>
              <h1 className="text-2xl font-bold">Exercise Library</h1>
              <p className="text-sm text-muted-foreground">
                Choose exercises to add to your workout
              </p>
            </div>
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
          <TabsList className="grid w-full grid-cols-4 lg:grid-cols-8 mb-6">
            {muscleGroups.map((group) => (
              <TabsTrigger key={group.value} value={group.value}>
                {group.label}
              </TabsTrigger>
            ))}
          </TabsList>

          {/* Exercise Cards */}
          {muscleGroups.map((group) => (
            <TabsContent key={group.value} value={group.value}>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredExercises.map((exercise) => (
                  <Card
                    key={exercise.id}
                    className="hover:shadow-md transition-all cursor-pointer"
                    onClick={() => handleAddExercise(exercise.id)}
                  >
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="space-y-1 flex-1">
                          <CardTitle className="text-lg">
                            {exercise.name}
                          </CardTitle>
                          <Badge variant="secondary" className="text-xs">
                            {group.label}
                          </Badge>
                        </div>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="shrink-0 h-8 w-8 p-0"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAddExercise(exercise.id);
                          }}
                        >
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardHeader>
                    {exercise.description && (
                      <CardContent>
                        <CardDescription className="text-sm">
                          {exercise.description}
                        </CardDescription>
                      </CardContent>
                    )}
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
    </div>
  );
}

export default ExercisesPage;
