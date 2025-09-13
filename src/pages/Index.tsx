import { useState, useEffect } from "react";
import { MoodSelector } from "@/components/MoodSelector";
import { MoodTrends } from "@/components/MoodTrends";
import { WellnessRecommendations } from "@/components/WellnessRecommendations";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface MoodEntry {
  emoji: string;
  label: string;
  value: number;
  timestamp: Date;
}

const Index = () => {
  const [moodHistory, setMoodHistory] = useState<MoodEntry[]>([]);
  const [todaysMood, setTodaysMood] = useState<number | undefined>();
  const [showMoodSelector, setShowMoodSelector] = useState(true);

  // Load mood history from localStorage
  useEffect(() => {
    const stored = localStorage.getItem("moodHistory");
    if (stored) {
      const parsed = JSON.parse(stored).map((entry: any) => ({
        ...entry,
        timestamp: new Date(entry.timestamp)
      }));
      setMoodHistory(parsed);
      
      // Check if user has already logged mood today
      const today = new Date().toDateString();
      const todayEntry = parsed.find((entry: MoodEntry) => 
        entry.timestamp.toDateString() === today
      );
      if (todayEntry) {
        setTodaysMood(todayEntry.value);
        setShowMoodSelector(false);
      }
    }
  }, []);

  // Save mood history to localStorage
  useEffect(() => {
    localStorage.setItem("moodHistory", JSON.stringify(moodHistory));
  }, [moodHistory]);

  const handleMoodSelect = (mood: MoodEntry) => {
    const today = new Date().toDateString();
    
    // Remove any existing entry for today
    const filteredHistory = moodHistory.filter(
      entry => entry.timestamp.toDateString() !== today
    );
    
    // Add new entry
    const newHistory = [...filteredHistory, mood];
    setMoodHistory(newHistory);
    setTodaysMood(mood.value);
    setShowMoodSelector(false);
  };

  const handleNewCheckIn = () => {
    setShowMoodSelector(true);
  };

  // Prepare chart data
  const chartData = moodHistory
    .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime())
    .map(entry => ({
      date: entry.timestamp.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      mood: entry.value,
      label: entry.label
    }));

  const getWelcomeMessage = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  const getStreakCount = () => {
    const today = new Date();
    let streak = 0;
    for (let i = 0; i < 30; i++) {
      const checkDate = new Date(today);
      checkDate.setDate(today.getDate() - i);
      const hasEntry = moodHistory.some(entry => 
        entry.timestamp.toDateString() === checkDate.toDateString()
      );
      if (hasEntry) {
        streak++;
      } else {
        break;
      }
    }
    return streak;
  };

  return (
    <div className="min-h-screen bg-gradient-calm">
      {/* Header */}
      <div className="bg-gradient-wellness shadow-wellness">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-white">
            <h1 className="text-4xl font-bold mb-2 animate-fade-in">
              Student Wellness Monitor
            </h1>
            <p className="text-lg opacity-90 animate-fade-in" style={{ animationDelay: "200ms" }}>
              {getWelcomeMessage()}! Track your mental health journey with care.
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="p-6 text-center shadow-card animate-fade-in">
            <div className="text-3xl font-bold text-primary mb-2">{getStreakCount()}</div>
            <div className="text-sm text-muted-foreground">Day Streak</div>
          </Card>
          
          <Card className="p-6 text-center shadow-card animate-fade-in" style={{ animationDelay: "100ms" }}>
            <div className="text-3xl font-bold text-secondary mb-2">{moodHistory.length}</div>
            <div className="text-sm text-muted-foreground">Total Check-ins</div>
          </Card>
          
          <Card className="p-6 text-center shadow-card animate-fade-in" style={{ animationDelay: "200ms" }}>
            <div className="text-3xl mb-2">
              {todaysMood ? (
                moodHistory.find(m => m.value === todaysMood)?.emoji || "😊"
              ) : "🤔"}
            </div>
            <div className="text-sm text-muted-foreground">Today's Mood</div>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column */}
          <div className="space-y-8">
            {/* Mood Check-in */}
            {showMoodSelector ? (
              <MoodSelector onMoodSelect={handleMoodSelect} selectedMood={todaysMood} />
            ) : (
              <Card className="p-6 bg-gradient-wellness shadow-wellness animate-fade-in text-center text-white">
                <div className="text-6xl mb-4 animate-gentle-bounce">
                  {moodHistory.find(m => m.value === todaysMood)?.emoji}
                </div>
                <h3 className="text-xl font-semibold mb-2">
                  You're feeling {moodHistory.find(m => m.value === todaysMood)?.label.toLowerCase()} today
                </h3>
                <p className="opacity-90 mb-6">
                  Thank you for checking in! Come back tomorrow to continue your wellness journey.
                </p>
                <Button 
                  variant="secondary" 
                  onClick={handleNewCheckIn}
                  className="bg-white/20 text-white border-white/30 hover:bg-white/30"
                >
                  Update Check-in
                </Button>
              </Card>
            )}

            {/* Wellness Recommendations */}
            <WellnessRecommendations currentMood={todaysMood} />
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            {/* Mood Trends */}
            <MoodTrends moodData={chartData} />

            {/* Quick Actions */}
            <Card className="p-6 shadow-card animate-fade-in">
              <h3 className="text-xl font-semibold mb-4">Quick Actions</h3>
              <div className="grid grid-cols-2 gap-3">
                <Button variant="outline" className="h-auto py-4 flex flex-col gap-2">
                  <span className="text-2xl">🧘‍♀️</span>
                  <span className="text-sm">Meditate</span>
                </Button>
                <Button variant="outline" className="h-auto py-4 flex flex-col gap-2">
                  <span className="text-2xl">📖</span>
                  <span className="text-sm">Journal</span>
                </Button>
                <Button variant="outline" className="h-auto py-4 flex flex-col gap-2">
                  <span className="text-2xl">🏃‍♀️</span>
                  <span className="text-sm">Exercise</span>
                </Button>
                <Button variant="outline" className="h-auto py-4 flex flex-col gap-2">
                  <span className="text-2xl">🌱</span>
                  <span className="text-sm">Resources</span>
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;