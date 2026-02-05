import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { mockExercises } from "@/services/mockData";
import type { Exercise, MuscleGroup } from "@/schemas/exercise";
import type { WorkoutExercise } from "@/schemas/workout";

const muscleGroupOptions: { value: MuscleGroup; label: string }[] = [
  { value: "chest", label: "Chest" },
  { value: "back", label: "Back" },
  { value: "shoulders", label: "Shoulders" },
  { value: "biceps", label: "Biceps" },
  { value: "triceps", label: "Triceps" },
  { value: "legs", label: "Legs" },
  { value: "core", label: "Core" },
  { value: "other", label: "Other" },
];

const setTypeOptions = [
  { value: "normal", label: "Normal" },
  { value: "warmup", label: "Warmup" },
  { value: "dropset", label: "Dropset" },
  { value: "failure", label: "Failure" },
];

const addExerciseFormSchema = z.object({
  weight: z.number().min(0, "Weight must be 0 or greater"),
  reps: z.number().min(1, "Reps must be at least 1"),
  setType: z.enum(["normal", "warmup", "dropset", "failure"]),
});

type AddExerciseFormData = z.infer<typeof addExerciseFormSchema>;

interface AddExerciseModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddExercise: (exercise: WorkoutExercise) => void;
}

function AddExerciseModal({
  open,
  onOpenChange,
  onAddExercise,
}: AddExerciseModalProps) {
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(
    null,
  );

  const form = useForm<AddExerciseFormData>({
    resolver: zodResolver(addExerciseFormSchema),
    defaultValues: {
      weight: 20,
      reps: 10,
      setType: "normal",
    },
  });

  // Group exercises by muscle group
  const exercisesByMuscleGroup = mockExercises.reduce(
    (acc, exercise) => {
      if (!acc[exercise.muscleGroup]) {
        acc[exercise.muscleGroup] = [];
      }
      acc[exercise.muscleGroup].push(exercise);
      return acc;
    },
    {} as Record<string, Exercise[]>,
  );

  const muscleGroups = muscleGroupOptions.filter(
    (group) => exercisesByMuscleGroup[group.value]?.length,
  );

  const handleSubmit = (data: AddExerciseFormData) => {
    if (!selectedExercise) return;

    const newWorkoutExercise: WorkoutExercise = {
      id: `we-${crypto.randomUUID()}`,
      exerciseId: selectedExercise.id,
      exerciseName: selectedExercise.name,
      muscleGroup: selectedExercise.muscleGroup,
      order: 0, // Will be set by parent
      sets: [
        {
          setNumber: 1,
          weight: data.weight,
          reps: data.reps,
          setType: data.setType,
        },
      ],
    };

    onAddExercise(newWorkoutExercise);
    handleClose();
  };

  const handleClose = () => {
    setSelectedExercise(null);
    form.reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Add Exercise to Workout</DialogTitle>
          <DialogDescription>
            {selectedExercise
              ? "Enter the details for your first set"
              : "Search and select an exercise to add to your workout"}
          </DialogDescription>
        </DialogHeader>

        {!selectedExercise ? (
          <>
            {/* Muscle Group Tabs */}
            <Tabs defaultValue={muscleGroups[0]?.value} className="w-full">
              <TabsList className="grid w-full grid-cols-4 lg:grid-cols-8 gap-y-2 mb-3 !h-auto">
                {muscleGroups.map((group) => (
                  <TabsTrigger
                    key={group.value}
                    value={group.value}
                    className="capitalize"
                  >
                    {group.label}
                  </TabsTrigger>
                ))}
              </TabsList>

              {muscleGroups.map((muscleGroup) => (
                <TabsContent
                  key={muscleGroup.value}
                  value={muscleGroup.value}
                  className="mt-2"
                >
                  <ScrollArea className="h-100 pr-2 [&_[data-slot=scroll-area-scrollbar]]:hidden">
                    <div className="space-y-2">
                      {exercisesByMuscleGroup[muscleGroup.value].map(
                        (exercise) => (
                          <button
                            key={exercise.id}
                            onClick={() => setSelectedExercise(exercise)}
                            className="w-full text-left p-3 rounded-lg border hover:bg-muted transition-colors"
                          >
                            <div>
                              <h4 className="font-medium">{exercise.name}</h4>
                            </div>
                          </button>
                        ),
                      )}
                    </div>
                  </ScrollArea>
                </TabsContent>
              ))}
            </Tabs>
          </>
        ) : (
          <>
            {/* Selected Exercise Details */}
            <div className="p-4 rounded-lg bg-muted">
              <div>
                <h3 className="font-semibold text-lg">
                  {selectedExercise.name}
                </h3>
              </div>
            </div>

            {/* First Set Form */}
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handleSubmit)}
                className="space-y-4"
              >
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="weight"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Weight (kg)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            step="0.5"
                            placeholder="20"
                            {...field}
                            onChange={(e) =>
                              field.onChange(Number(e.target.value))
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="reps"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Reps</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="10"
                            {...field}
                            onChange={(e) =>
                              field.onChange(Number(e.target.value))
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="setType"
                    render={({ field }) => (
                      <FormItem className="col-span-2">
                        <FormLabel>Set Type</FormLabel>
                        <FormControl>
                          <Select {...field}>
                            {setTypeOptions.map((option) => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <DialogFooter>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setSelectedExercise(null)}
                  >
                    Back
                  </Button>
                  <Button type="submit">Add Exercise</Button>
                </DialogFooter>
              </form>
            </Form>
          </>
        )}

        {!selectedExercise && (
          <DialogFooter>
            <Button variant="outline" onClick={handleClose}>
              Cancel
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}

export default AddExerciseModal;
