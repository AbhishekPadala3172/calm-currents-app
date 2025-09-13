import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface Recommendation {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: string;
  duration: string;
  moodRange: number[];
}

const recommendations: Recommendation[] = [
  {
    id: "1",
    title: "Deep Breathing Exercise",
    description: "Take 5 minutes to practice deep breathing to reduce stress and anxiety.",
    icon: "🫁",
    category: "Mindfulness",
    duration: "5 min",
    moodRange: [1, 3]
  },
  {
    id: "2",
    title: "Gratitude Journaling",
    description: "Write down three things you're grateful for today.",
    icon: "📝",
    category: "Reflection",
    duration: "10 min",
    moodRange: [2, 4]
  },
  {
    id: "3",
    title: "Quick Walk Outside",
    description: "Get some fresh air and natural light with a brief outdoor walk.",
    icon: "🚶‍♀️",
    category: "Physical",
    duration: "15 min",
    moodRange: [1, 3]
  },
  {
    id: "4",
    title: "Listen to Music",
    description: "Play your favorite uplifting songs to boost your mood.",
    icon: "🎵",
    category: "Entertainment",
    duration: "10 min",
    moodRange: [2, 4]
  },
  {
    id: "5",
    title: "Progressive Muscle Relaxation",
    description: "Release tension by systematically relaxing different muscle groups.",
    icon: "💆‍♀️",
    category: "Relaxation",
    duration: "15 min",
    moodRange: [1, 3]
  },
  {
    id: "6",
    title: "Connect with a Friend",
    description: "Reach out to someone you care about for a quick chat.",
    icon: "💬",
    category: "Social",
    duration: "20 min",
    moodRange: [1, 4]
  },
  {
    id: "7",
    title: "Celebrate Small Wins",
    description: "Acknowledge and celebrate your recent accomplishments.",
    icon: "🎉",
    category: "Positivity",
    duration: "5 min",
    moodRange: [3, 5]
  },
  {
    id: "8",
    title: "Mindful Tea Break",
    description: "Prepare and enjoy a warm beverage mindfully.",
    icon: "🍵",
    category: "Mindfulness",
    duration: "10 min",
    moodRange: [2, 5]
  }
];

interface WellnessRecommendationsProps {
  currentMood?: number;
}

export function WellnessRecommendations({ currentMood }: WellnessRecommendationsProps) {
  const getFilteredRecommendations = () => {
    if (!currentMood) return recommendations.slice(0, 4);
    
    return recommendations
      .filter(rec => currentMood >= rec.moodRange[0] && currentMood <= rec.moodRange[1])
      .slice(0, 4);
  };

  const filteredRecommendations = getFilteredRecommendations();

  const categoryColors: Record<string, string> = {
    "Mindfulness": "bg-wellness-calm/20 text-wellness-calm",
    "Reflection": "bg-wellness-positive/20 text-wellness-positive",
    "Physical": "bg-wellness-negative/20 text-wellness-negative",
    "Entertainment": "bg-wellness-neutral/20 text-wellness-neutral",
    "Relaxation": "bg-primary/20 text-primary",
    "Social": "bg-secondary/20 text-secondary",
    "Positivity": "bg-accent/20 text-accent"
  };

  return (
    <Card className="p-6 shadow-card animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold">Wellness Recommendations</h3>
        {currentMood && (
          <Badge variant="secondary" className="bg-primary/10 text-primary">
            Personalized for you
          </Badge>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {filteredRecommendations.map((rec, index) => (
          <Card 
            key={rec.id} 
            className="p-4 hover:shadow-wellness transition-all duration-300 hover:scale-[1.02] cursor-pointer group"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="flex items-start gap-3">
              <div className="text-2xl group-hover:animate-gentle-bounce">
                {rec.icon}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h4 className="font-medium text-sm">{rec.title}</h4>
                  <Badge 
                    variant="secondary" 
                    className={`text-xs ${categoryColors[rec.category] || "bg-muted"}`}
                  >
                    {rec.duration}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  {rec.description}
                </p>
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="text-xs">
                    {rec.category}
                  </Badge>
                  <Button 
                    size="sm" 
                    variant="ghost"
                    className="text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    Try Now
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {!currentMood && (
        <div className="text-center mt-6 p-4 bg-gradient-calm rounded-lg">
          <p className="text-sm text-muted-foreground">
            💡 Check in with your mood to get personalized recommendations!
          </p>
        </div>
      )}
    </Card>
  );
}