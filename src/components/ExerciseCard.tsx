import { useState, useRef, useEffect } from "react";
import { Trash2, GripVertical, Plus, X } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card.tsx";
import { Badge } from "@/components/ui/badge.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Input } from "@/components/ui/input.tsx";
import type {
  WorkoutExerciseResponse,
  SetType,
  SetResponse,
} from "@/schemas/workout.ts";

interface ExerciseCardProps {
  exercise: WorkoutExerciseResponse;
  isEditing: boolean;
  onEdit: () => void;
  onSave: (updatedSets: SetResponse[]) => void;
  onDelete?: () => void;
}

const setTypeColors: Record<SetType, string> = {
  WARM_UP: "bg-secondary/10 text-secondary",
  WORKING: "bg-primary/10 text-primary",
};

const setTypeLabels: Record<SetType, string> = {
  WARM_UP: "Warm Up",
  WORKING: "Working",
};

const setTypeOptions: SetType[] = ["WARM_UP", "WORKING"];

function ExerciseCard({
  exercise,
  isEditing,
  onEdit,
  onSave,
  onDelete,
}: ExerciseCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [localSets, setLocalSets] = useState<SetResponse[]>(exercise.sets);

  const handleInputChange = (
    setIndex: number,
    field: keyof SetResponse,
    value: string | number,
  ) => {
    setLocalSets((prevSets) => {
      const newSets = [...prevSets];
      const currentSet = { ...newSets[setIndex] };

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

      newSets[setIndex] = currentSet;
      return newSets;
    });
  };

  const handleAddSet = () => {
    const lastSet = localSets[localSets.length - 1];
    const newSet: SetResponse = {
      id: `temp-${Date.now()}`,
      reps: lastSet?.reps || 10,
      weight: lastSet?.weight || 0,
      setType: lastSet?.setType || "WORKING",
      notes: "",
    };
    setLocalSets([...localSets, newSet]);
  };

  const handleRemoveSet = (setIndex: number) => {
    if (localSets.length > 1) {
      setLocalSets(localSets.filter((_, idx) => idx !== setIndex));
    }
  };

  const handleSave = () => {
    onSave(localSets);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && isEditing) {
      handleSave();
    }
  };

  useEffect(() => {
    if (!isEditing) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (cardRef.current && !cardRef.current.contains(event.target as Node)) {
        onSave(localSets);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isEditing, localSets, onSave]);

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
            <CardTitle className="text-xl">{exercise.exercise.name}</CardTitle>
            <Badge variant="secondary" className="capitalize">
              {exercise.exercise.muscleGroup.toLowerCase()}
            </Badge>
          </div>
          {isEditing && onDelete && (
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
              className="h-8 w-8 p-0"
            >
              <Trash2 className="w-4 h-4 text-destructive" />
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {/* Header row */}
          <div
            className={`grid ${isEditing ? "grid-cols-13" : "grid-cols-12"} gap-2 text-sm font-medium text-muted-foreground pb-2 border-b`}
          >
            <div className="col-span-1">Set</div>
            <div className="col-span-3">Weight (kg)</div>
            <div className="col-span-2">Reps</div>
            <div className="col-span-3">Type</div>
            <div className="col-span-3">Notes</div>
            {isEditing && <div className="col-span-1"></div>}
          </div>

          {/* Sets */}
          {(isEditing ? localSets : exercise.sets).map((set, index) => (
            <div
              key={set.id}
              className={`grid ${isEditing ? "grid-cols-13" : "grid-cols-12"} gap-2 items-center text-base py-1.5 rounded px-1`}
              onClick={(e) => isEditing && e.stopPropagation()}
            >
              <div className="col-span-1 font-semibold text-muted-foreground">
                {index + 1}
              </div>

              {isEditing ? (
                <>
                  <div className="col-span-3">
                    <Input
                      type="number"
                      value={set.weight || ""}
                      onChange={(e) =>
                        handleInputChange(index, "weight", e.target.value)
                      }
                      className="h-7 text-sm focus-visible:ring-offset-1"
                      min="0"
                    />
                  </div>
                  <div className="col-span-2">
                    <Input
                      type="number"
                      value={set.reps || ""}
                      onChange={(e) =>
                        handleInputChange(index, "reps", e.target.value)
                      }
                      className="h-7 text-sm focus-visible:ring-offset-1"
                      min="0"
                    />
                  </div>
                  <div className="col-span-3">
                    <select
                      value={set.setType}
                      onChange={(e) =>
                        handleInputChange(
                          index,
                          "setType",
                          e.target.value as SetType,
                        )
                      }
                      className="h-7 w-full text-xs rounded-md border border-input bg-background px-2 py-1 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1 transition-shadow"
                    >
                      {setTypeOptions.map((type) => (
                        <option key={type} value={type}>
                          {setTypeLabels[type]}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="col-span-3">
                    <Input
                      type="text"
                      value={set.notes || ""}
                      onChange={(e) =>
                        handleInputChange(index, "notes", e.target.value)
                      }
                      placeholder="-"
                      className="h-7 text-xs focus-visible:ring-offset-1"
                    />
                  </div>
                  <div className="col-span-1 flex items-center justify-center">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveSet(index);
                      }}
                      className="h-7 w-7 p-0"
                      disabled={localSets.length === 1}
                    >
                      <X className="w-3 h-3" />
                    </Button>
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
                      {setTypeLabels[set.setType]}
                    </Badge>
                  </div>
                  <div className="col-span-3 text-xs text-muted-foreground truncate">
                    {set.notes || "-"}
                  </div>
                </>
              )}
            </div>
          ))}

          {/* Add Set Button */}
          {isEditing && (
            <Button
              variant="outline"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                handleAddSet();
              }}
              className="w-fit mt-2 gap-1 text-xs"
            >
              <Plus className="w-3 h-3" />
              Add Set
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default ExerciseCard;
