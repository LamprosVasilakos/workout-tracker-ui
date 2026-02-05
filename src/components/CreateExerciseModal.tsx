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
import { Select } from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { muscleGroupSchema, type MuscleGroup } from "@/schemas/exercise";
import type { Exercise } from "@/schemas/exercise";

const createExerciseFormSchema = z.object({
  name: z.string().min(1, "Exercise name is required"),
  muscleGroup: muscleGroupSchema,
});

type CreateExerciseFormData = z.infer<typeof createExerciseFormSchema>;

interface CreateExerciseModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateExercise: (exercise: Omit<Exercise, "id">) => void;
}

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

function CreateExerciseModal({
  open,
  onOpenChange,
  onCreateExercise,
}: CreateExerciseModalProps) {
  const form = useForm<CreateExerciseFormData>({
    resolver: zodResolver(createExerciseFormSchema),
    defaultValues: {
      name: "",
      muscleGroup: "chest",
    },
  });

  const handleSubmit = (data: CreateExerciseFormData) => {
    onCreateExercise({
      name: data.name,
      muscleGroup: data.muscleGroup,
    });
    handleClose();
  };

  const handleClose = () => {
    form.reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Create New Exercise</DialogTitle>
          <DialogDescription>
            Add a new exercise to your library
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-6"
          >
            {/* Exercise Name */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Exercise Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g. Bench Press"
                      {...field}
                      autoFocus
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Muscle Group Selection */}
            <FormField
              control={form.control}
              name="muscleGroup"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Muscle Group</FormLabel>
                  <FormControl>
                    <Select {...field}>
                      {muscleGroups.map((group) => (
                        <option key={group.value} value={group.value}>
                          {group.label}
                        </option>
                      ))}
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button type="submit">Create Exercise</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export default CreateExerciseModal;
