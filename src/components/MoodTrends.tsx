import { Card } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface MoodEntry {
  date: string;
  mood: number;
  label: string;
}

interface MoodTrendsProps {
  moodData: MoodEntry[];
}

export function MoodTrends({ moodData }: MoodTrendsProps) {
  const getAverageMood = () => {
    if (moodData.length === 0) return 0;
    const sum = moodData.reduce((acc, entry) => acc + entry.mood, 0);
    return (sum / moodData.length).toFixed(1);
  };

  const getMoodTrend = () => {
    if (moodData.length < 2) return "neutral";
    const recent = moodData.slice(-3);
    const older = moodData.slice(-6, -3);
    
    if (recent.length === 0 || older.length === 0) return "neutral";
    
    const recentAvg = recent.reduce((acc, entry) => acc + entry.mood, 0) / recent.length;
    const olderAvg = older.reduce((acc, entry) => acc + entry.mood, 0) / older.length;
    
    if (recentAvg > olderAvg) return "improving";
    if (recentAvg < olderAvg) return "declining";
    return "stable";
  };

  const trendIcons = {
    improving: "📈",
    declining: "📉",
    stable: "➡️",
    neutral: "📊"
  };

  const trendColors = {
    improving: "text-wellness-positive",
    declining: "text-wellness-negative",
    stable: "text-wellness-neutral",
    neutral: "text-muted-foreground"
  };

  const trend = getMoodTrend();

  return (
    <Card className="p-6 shadow-card animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold">Mood Trends</h3>
        <div className="flex items-center gap-2">
          <span className="text-2xl">{trendIcons[trend]}</span>
          <span className={`text-sm font-medium ${trendColors[trend]}`}>
            {trend.charAt(0).toUpperCase() + trend.slice(1)}
          </span>
        </div>
      </div>

      {moodData.length > 0 ? (
        <>
          <div className="mb-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-gradient-calm rounded-lg">
                <div className="text-2xl font-bold text-primary">{getAverageMood()}</div>
                <div className="text-sm text-muted-foreground">Average Mood</div>
              </div>
              <div className="text-center p-4 bg-gradient-calm rounded-lg">
                <div className="text-2xl font-bold text-primary">{moodData.length}</div>
                <div className="text-sm text-muted-foreground">Total Check-ins</div>
              </div>
            </div>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={moodData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis 
                  dataKey="date" 
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                />
                <YAxis 
                  domain={[1, 5]} 
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                    boxShadow: "var(--shadow-card)"
                  }}
                  formatter={(value: number, name: string) => [
                    `${value} (${moodData.find(d => d.mood === value)?.label || ''})`,
                    "Mood"
                  ]}
                />
                <Line 
                  type="monotone" 
                  dataKey="mood" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={3}
                  dot={{ fill: "hsl(var(--primary))", strokeWidth: 2, r: 6 }}
                  activeDot={{ r: 8, stroke: "hsl(var(--primary))", strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </>
      ) : (
        <div className="text-center py-12">
          <div className="text-6xl mb-4 animate-wellness-pulse">📊</div>
          <h4 className="text-lg font-medium mb-2">No data yet</h4>
          <p className="text-muted-foreground">
            Start tracking your mood to see trends and insights over time.
          </p>
        </div>
      )}
    </Card>
  );
}