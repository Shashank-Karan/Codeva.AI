import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, Play, Pause, RotateCcw, Settings } from "lucide-react";
import AppNavigation from "@/components/AppNavigation";

export default function Timer() {
  const [time, setTime] = useState(25 * 60); // 25 minutes in seconds
  const [isRunning, setIsRunning] = useState(false);
  const [mode, setMode] = useState<'work' | 'break'>('work');

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning && time > 0) {
      interval = setInterval(() => {
        setTime(time - 1);
      }, 1000);
    } else if (time === 0) {
      setIsRunning(false);
      // Switch modes when timer reaches 0
      if (mode === 'work') {
        setMode('break');
        setTime(5 * 60); // 5 minute break
      } else {
        setMode('work');
        setTime(25 * 60); // 25 minute work session
      }
    }
    return () => clearInterval(interval);
  }, [isRunning, time, mode]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const resetTimer = () => {
    setIsRunning(false);
    setTime(mode === 'work' ? 25 * 60 : 5 * 60);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
      <AppNavigation />
      
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">
            Pomodoro Timer
          </h1>
          <p className="text-gray-300 text-lg">
            Stay focused with the Pomodoro Technique
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Timer Card */}
          <Card className="bg-slate-800/40 border-slate-700/50 backdrop-blur-sm">
            <CardHeader className="text-center">
              <CardTitle className="text-white text-2xl flex items-center justify-center gap-2">
                <Clock className="h-6 w-6" />
                {mode === 'work' ? 'Work Session' : 'Break Time'}
              </CardTitle>
              <CardDescription className="text-gray-300">
                {mode === 'work' ? 'Focus on your coding task' : 'Take a well-deserved break'}
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <div className="mb-8">
                <div className="text-6xl font-mono font-bold text-white mb-4">
                  {formatTime(time)}
                </div>
                <div className="flex justify-center gap-4">
                  <Button
                    onClick={() => setIsRunning(!isRunning)}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    {isRunning ? <Pause className="h-4 w-4 mr-2" /> : <Play className="h-4 w-4 mr-2" />}
                    {isRunning ? 'Pause' : 'Start'}
                  </Button>
                  <Button
                    onClick={resetTimer}
                    variant="outline"
                    className="border-slate-600 text-gray-300 hover:bg-slate-700"
                  >
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Reset
                  </Button>
                </div>
              </div>
              
              <div className="flex justify-center gap-2">
                <Button
                  onClick={() => {
                    setMode('work');
                    setTime(25 * 60);
                    setIsRunning(false);
                  }}
                  variant={mode === 'work' ? 'default' : 'outline'}
                  size="sm"
                  className={mode === 'work' ? 'bg-blue-600 hover:bg-blue-700' : 'border-slate-600 text-gray-300'}
                >
                  Work (25m)
                </Button>
                <Button
                  onClick={() => {
                    setMode('break');
                    setTime(5 * 60);
                    setIsRunning(false);
                  }}
                  variant={mode === 'break' ? 'default' : 'outline'}
                  size="sm"
                  className={mode === 'break' ? 'bg-green-600 hover:bg-green-700' : 'border-slate-600 text-gray-300'}
                >
                  Break (5m)
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Statistics Card */}
          <Card className="bg-slate-800/40 border-slate-700/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white text-xl flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Pomodoro Stats
              </CardTitle>
              <CardDescription className="text-gray-300">
                Your productivity insights
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Sessions Today</span>
                  <span className="text-white font-semibold">0</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Focus Time</span>
                  <span className="text-white font-semibold">0 min</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Streak</span>
                  <span className="text-white font-semibold">0 days</span>
                </div>
                <div className="pt-4 border-t border-slate-700">
                  <p className="text-sm text-gray-400">
                    The Pomodoro Technique helps you maintain focus by working in 25-minute intervals followed by 5-minute breaks.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}