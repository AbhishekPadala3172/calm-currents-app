import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const moodOptions = [
  { emoji: "😊", label: "Great", value: 5, color: "wellness-positive" },
  { emoji: "🙂", label: "Good", value: 4, color: "wellness-positive" },
  { emoji: "😐", label: "Okay", value: 3, color: "wellness-neutral" },
  { emoji: "😔", label: "Low", value: 2, color: "wellness-negative" },
  { emoji: "😢", label: "Sad", value: 1, color: "wellness-negative" },
];

interface MoodSelectorProps {
  onMoodSelect: (mood: { emoji: string; label: string; value: number; timestamp: Date }) => void;
  selectedMood?: number;
}

export function MoodSelector({ onMoodSelect, selectedMood }: MoodSelectorProps) {
  const [hoveredMood, setHoveredMood] = useState<number | null>(null);

  const handleMoodSelect = (mood: typeof moodOptions[0]) => {
    onMoodSelect({
      emoji: mood.emoji,
      label: mood.label,
      value: mood.value,
      timestamp: new Date(),
    });
  };

  return (
    <Card className="p-6 bg-gradient-wellness shadow-wellness animate-fade-in">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          How are you feeling today?
        </h2>
        <p className="text-muted-foreground mt-2">Your feelings matter. Take a moment to check in with yourself.</p>
      </div>

      <div className="flex justify-center gap-4 flex-wrap">
        {moodOptions.map((mood) => (
          <Button
            key={mood.value}
            variant="ghost"
            size="lg"
            className={`
              h-20 w-20 rounded-full flex flex-col items-center justify-center
              transition-all duration-300 hover:scale-110 hover:shadow-glow
              ${selectedMood === mood.value ? "bg-primary/20 shadow-glow scale-105" : ""}
              ${hoveredMood === mood.value ? "animate-gentle-bounce" : ""}
            `}
            onMouseEnter={() => setHoveredMood(mood.value)}
            onMouseLeave={() => setHoveredMood(null)}
            onClick={() => handleMoodSelect(mood)}
          >
            <span className="text-3xl mb-1">{mood.emoji}</span>
            <span className="text-xs font-medium">{mood.label}</span>
          </Button>
        ))}
      </div>

      {selectedMood && (
        <div className="text-center mt-6 animate-fade-in">
          <p className="text-sm text-muted-foreground">
            Thank you for sharing. Your mood has been recorded for {new Date().toLocaleDateString()}.
          </p>
        </div>
      )}
    </Card>
  );
}