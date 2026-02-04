import { useState, useRef, useEffect } from "react";
import { Trash2, GripVertical } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { WorkoutExercise, SetType, ExerciseSet } from "@/schemas/workout";

interface ExerciseCardProps {
  exercise: WorkoutExercise;
  isEditing: boolean;
  onEdit: () => void;
  onSave: () => void;
  onDelete?: () => void;
  onUpdateSet?: (setNumber: number, updatedSet: Partial<ExerciseSet>) => void;
}

const setTypeColors: Record<SetType, string> = {
  normal: "bg-primary/10 text-primary",
  warmup: "bg-secondary/10 text-secondary",
  dropset: "bg-accent/10 text-accent",
  failure: "bg-destructive/10 text-destructive",
};

const setTypeOptions: SetType[] = ["normal", "warmup", "dropset", "failure"];

function ExerciseCard({
  exercise,
  isEditing,
  onEdit,
  onSave,
  onDelete,
  onUpdateSet,
}: ExerciseCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleInputChange = (
    setNumber: number,
    field: keyof ExerciseSet,
    value: string | number,
  ) => {
    if (!onUpdateSet) return;

    if (field === "weight" || field === "reps") {
      const numValue = Number(value);
      if (!isNaN(numValue) && numValue >= 0) {
        onUpdateSet(setNumber, { [field]: numValue });
      }
    } else if (field === "setType") {
      onUpdateSet(setNumber, { setType: value as SetType });
    } else if (field === "notes") {
      onUpdateSet(setNumber, { notes: value as string });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && isEditing) {
      onSave();
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isEditing &&
        cardRef.current &&
        !cardRef.current.contains(event.target as Node)
      ) {
        onSave();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isEditing, onSave]);

  return (
    <Card
      ref={cardRef}
      className={`transition-all ${isEditing ? "border-primary bg-primary/5 shadow-lg" : "hover:shadow-md cursor-pointer"}`}
      onClick={() => !isEditing && onEdit()}
      onKeyDown={handleKeyDown}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <GripVertical className="w-4 h-4 text-muted-foreground cursor-grab" />
            <CardTitle className="text-xl">{exercise.exerciseName}</CardTitle>
          </div>
          {isEditing && onDelete && (
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
              className="text-muted-foreground hover:text-destructive"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {/* Header row */}
          <div className="grid grid-cols-12 gap-2 text-sm font-medium text-muted-foreground pb-2 border-b">
            <div className="col-span-1">Set</div>
            <div className="col-span-3">Weight (kg)</div>
            <div className="col-span-2">Reps</div>
            <div className="col-span-3">Type</div>
            <div className="col-span-3">Notes</div>
          </div>

          {/* Sets */}
          {exercise.sets.map((set) => (
            <div
              key={set.setNumber}
              className="grid grid-cols-12 gap-2 items-center text-base py-1.5 rounded px-1"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="col-span-1 font-semibold text-muted-foreground">
                {set.setNumber}
              </div>

              {isEditing ? (
                <>
                  <div className="col-span-3">
                    <Input
                      type="number"
                      value={set.weight}
                      onChange={(e) =>
                        handleInputChange(
                          set.setNumber,
                          "weight",
                          e.target.value,
                        )
                      }
                      className="h-7 text-sm"
                      min="0"
                    />
                  </div>
                  <div className="col-span-2">
                    <Input
                      type="number"
                      value={set.reps}
                      onChange={(e) =>
                        handleInputChange(set.setNumber, "reps", e.target.value)
                      }
                      className="h-7 text-sm"
                      min="0"
                    />
                  </div>
                  <div className="col-span-3">
                    <select
                      value={set.setType}
                      onChange={(e) =>
                        handleInputChange(
                          set.setNumber,
                          "setType",
                          e.target.value as SetType,
                        )
                      }
                      className="h-7 w-full text-xs rounded-md border border-input bg-background px-2 py-1"
                    >
                      {setTypeOptions.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="col-span-3">
                    <Input
                      type="text"
                      value={set.notes || ""}
                      onChange={(e) =>
                        handleInputChange(
                          set.setNumber,
                          "notes",
                          e.target.value,
                        )
                      }
                      placeholder="-"
                      className="h-7 text-xs"
                    />
                  </div>
                </>
              ) : (
                <>
                  <div className="col-span-3 font-medium">{set.weight}</div>
                  <div className="col-span-2">{set.reps}</div>
                  <div className="col-span-3">
                    <Badge
                      variant="secondary"
                      className={setTypeColors[set.setType]}
                    >
                      {set.setType}
                    </Badge>
                  </div>
                  <div className="col-span-3 text-xs text-muted-foreground truncate">
                    {set.notes || "-"}
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export default ExerciseCard;
