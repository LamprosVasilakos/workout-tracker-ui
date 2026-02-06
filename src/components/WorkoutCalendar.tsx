import { useState } from "react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar.tsx";
import { Card } from "@/components/ui/card.tsx";
import { Badge } from "@/components/ui/badge.tsx";

interface WorkoutCalendarProps {
  selectedDate: Date | undefined;
  onDateSelect: (date: Date | undefined) => void;
  workoutDates: string[]; // Array of ISO date strings
}

function WorkoutCalendar({
  selectedDate,
  onDateSelect,
  workoutDates,
}: WorkoutCalendarProps) {
  const [month, setMonth] = useState<Date>(new Date());

  // Check if a date has a workout
  const hasWorkout = (date: Date): boolean => {
    const dateString = format(date, "yyyy-MM-dd");
    return workoutDates.includes(dateString);
  };

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold">Workout Calendar</h2>
          <Badge variant="secondary" className="text-sm px-3 py-1">
            {workoutDates.length} workouts
          </Badge>
        </div>

        <Calendar
          mode="single"
          required
          selected={selectedDate}
          onSelect={onDateSelect}
          month={month}
          onMonthChange={setMonth}
          showOutsideDays={false}
          modifiers={{
            workout: (date) => hasWorkout(date),
          }}
          className="rounded-md w-full"
        />

        <div className="flex items-center gap-4 text-sm font-medium text-muted-foreground mt-4 flex-wrap">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-sm bg-accent"></div>
            <span>Logged Workout</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-sm bg-primary"></div>
            <span>Today / Selected Date</span>
          </div>
        </div>
      </div>
    </Card>
  );
}

export default WorkoutCalendar;
