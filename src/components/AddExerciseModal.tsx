import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Plus, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog.tsx";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Label } from "@/components/ui/label.tsx";
import { ScrollArea } from "@/components/ui/scroll-area.tsx";
import { exerciseService } from "@/services/exerciseService.ts";
import type { Exercise, MuscleGroup } from "@/schemas/exercise.ts";
import type { SetType } from "@/schemas/workout.ts";

const muscleGroupOptions: { value: MuscleGroup; label: string }[] = [
  { value: "CHEST", label: "Chest" },
  { value: "BACK", label: "Back" },
  { value: "SHOULDERS", label: "Shoulders" },
  { value: "BICEPS", label: "Biceps" },
  { value: "TRICEPS", label: "Triceps" },
  { value: "LEGS", label: "Legs" },
  { value: "CORE", label: "Core" },
  { value: "OTHER", label: "Other" },
];

interface SetConfig {
  reps: number;
  weight: number;
  setType: SetType;
  notes: string;
}

interface AddExerciseModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddExercise: (exerciseId: string, sets: SetConfig[]) => void;
}

function AddExerciseModal({
  open,
  onOpenChange,
  onAddExercise,
}: AddExerciseModalProps) {
  const [selectedMuscleGroup, setSelectedMuscleGroup] =
    useState<MuscleGroup>("CHEST");
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(
    null,
  );
  const [sets, setSets] = useState<SetConfig[]>([
    { reps: 10, weight: 0, setType: "WORKING", notes: "" },
  ]);

  // Fetch exercises for the selected muscle group
  const { data: exercises = [] } = useQuery({
    queryKey: ["exercises", selectedMuscleGroup],
    queryFn: () =>
      exerciseService.getExercisesByMuscleGroup(selectedMuscleGroup),
    enabled: open,
  });

  const handleSelectExercise = (exercise: Exercise) => {
    setSelectedExercise(exercise);
  };

  const handleAddSet = () => {
    const lastSet = sets[sets.length - 1];
    setSets([
      ...sets,
      {
        reps: lastSet?.reps || 10,
        weight: lastSet?.weight || 0,
        setType: lastSet?.setType || "WORKING",
        notes: "",
      },
    ]);
  };

  const handleRemoveSet = (index: number) => {
    if (sets.length > 1) {
      setSets(sets.filter((_, idx) => idx !== index));
    }
  };

  const handleSetChange = (
    index: number,
    field: keyof SetConfig,
    value: string | number,
  ) => {
    setSets((prevSets) => {
      const newSets = [...prevSets];
      const currentSet = { ...newSets[index] };

      if (field === "weight" || field === "reps") {
        if (value === "" || value === null || value === undefined) {
          currentSet[field] = 0;
        } else {
          const numValue = Number(value);
          if (!isNaN(numValue) && numValue >= 0) {
            currentSet[field] = numValue;
          }
        }
      } else if (field === "setType") {
        currentSet.setType = value as SetType;
      } else if (field === "notes") {
        currentSet.notes = value as string;
      }

      newSets[index] = currentSet;
      return newSets;
    });
  };

  const handleConfirm = () => {
    if (selectedExercise) {
      onAddExercise(selectedExercise.id, sets);
      handleClose();
    }
  };

  const handleBack = () => {
    setSelectedExercise(null);
  };

  const handleClose = () => {
    setSelectedExercise(null);
    setSets([{ reps: 10, weight: 0, setType: "WORKING", notes: "" }]);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl lg:max-w-3xl xl:max-w-4xl">
        <DialogHeader>
          <DialogTitle>
            {selectedExercise ? "Configure Sets" : "Add Exercise to Workout"}
          </DialogTitle>
          <DialogDescription>
            {selectedExercise
              ? `Configure sets for ${selectedExercise.name}`
              : "Search and select an exercise to add to your workout"}
          </DialogDescription>
        </DialogHeader>

        {!selectedExercise ? (
          <>
            {/* Muscle Group Tabs */}
            <Tabs
              value={selectedMuscleGroup}
              onValueChange={(value) =>
                setSelectedMuscleGroup(value as MuscleGroup)
              }
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-4 md:grid-cols-6 xl:grid-cols-8 gap-1 mb-3 h-auto p-1 [&>*:nth-child(7)]:md:col-start-3 [&>*:nth-child(7)]:xl:col-auto">
                {muscleGroupOptions.map((group) => (
                  <TabsTrigger
                    key={group.value}
                    value={group.value}
                    className="capitalize"
                  >
                    {group.label}
                  </TabsTrigger>
                ))}
              </TabsList>

              {muscleGroupOptions.map((muscleGroup) => (
                <TabsContent
                  key={muscleGroup.value}
                  value={muscleGroup.value}
                  className="mt-2"
                >
                  <ScrollArea className="h-96 pr-2">
                    <div className="space-y-2">
                      {exercises.map((exercise) => (
                        <button
                          key={exercise.id}
                          onClick={() => handleSelectExercise(exercise)}
                          className="w-full text-left p-3 rounded-lg border hover:bg-muted transition-colors"
                        >
                          <div>
                            <h4 className="font-medium">{exercise.name}</h4>
                          </div>
                        </button>
                      ))}
                      {exercises.length === 0 && (
                        <div className="text-center py-8 text-muted-foreground">
                          No exercises found for this muscle group
                        </div>
                      )}
                    </div>
                  </ScrollArea>
                </TabsContent>
              ))}
            </Tabs>

            <DialogFooter>
              <Button variant="outline" onClick={handleClose}>
                Cancel
              </Button>
            </DialogFooter>
          </>
        ) : (
          <>
            {/* Set Configuration */}
            <ScrollArea className="h-96 pr-4">
              <div className="space-y-4">
                {sets.map((set, index) => (
                  <div
                    key={index}
                    className="p-4 border rounded-lg bg-card shadow-sm space-y-4"
                  >
                    <div className="flex items-center justify-between">
                      <Label className="font-bold text-base text-primary">
                        Set {index + 1}
                      </Label>
                      {sets.length > 1 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveSet(index)}
                          className="h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="flex flex-col gap-1.5">
                        <Label
                          htmlFor={`weight-${index}`}
                          className="text-xs font-semibold uppercase text-muted-foreground"
                        >
                          Weight (kg)
                        </Label>
                        <Input
                          id={`weight-${index}`}
                          type="number"
                          value={set.weight || ""}
                          onChange={(e) =>
                            handleSetChange(index, "weight", e.target.value)
                          }
                          min="0"
                          className="h-9 focus-visible:ring-offset-1"
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <Label
                          htmlFor={`reps-${index}`}
                          className="text-xs font-semibold uppercase text-muted-foreground"
                        >
                          Reps
                        </Label>
                        <Input
                          id={`reps-${index}`}
                          type="number"
                          value={set.reps || ""}
                          onChange={(e) =>
                            handleSetChange(index, "reps", e.target.value)
                          }
                          min="0"
                          className="h-9 focus-visible:ring-offset-1"
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <Label
                          htmlFor={`type-${index}`}
                          className="text-xs font-semibold uppercase text-muted-foreground"
                        >
                          Type
                        </Label>
                        <select
                          id={`type-${index}`}
                          value={set.setType}
                          onChange={(e) =>
                            handleSetChange(
                              index,
                              "setType",
                              e.target.value as SetType,
                            )
                          }
                          className="w-full h-9 rounded-md border border-input bg-background px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1 transition-shadow"
                        >
                          <option value="WARM_UP">Warm Up</option>
                          <option value="WORKING">Working</option>
                        </select>
                      </div>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <Label
                        htmlFor={`notes-${index}`}
                        className="text-xs font-semibold uppercase text-muted-foreground"
                      >
                        Notes
                      </Label>
                      <Input
                        id={`notes-${index}`}
                        type="text"
                        value={set.notes}
                        onChange={(e) =>
                          handleSetChange(index, "notes", e.target.value)
                        }
                        placeholder="Optional notes"
                        className="h-9 focus-visible:ring-offset-1"
                      />
                    </div>
                  </div>
                ))}

                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleAddSet}
                  className="w-fit gap-1 text-xs"
                >
                  <Plus className="w-3 h-3" />
                  Add Set
                </Button>
              </div>
            </ScrollArea>

            <DialogFooter className="gap-2">
              <Button variant="outline" onClick={handleBack}>
                Back
              </Button>
              <Button onClick={handleConfirm}>Add to Workout</Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

export default AddExerciseModal;
