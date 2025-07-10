import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Puzzle, Trophy, Clock, Star, Brain, Code, Target } from "lucide-react";
import AppNavigation from "@/components/AppNavigation";

export default function Puzzles() {
  const puzzles = [
    {
      title: "Array Rotation",
      description: "Rotate an array to the right by k steps",
      difficulty: "Easy",
      timeLimit: "15 min",
      points: 50,
      category: "Arrays",
      solved: false
    },
    {
      title: "Binary Tree Traversal",
      description: "Implement inorder, preorder, and postorder traversal",
      difficulty: "Medium",
      timeLimit: "30 min",
      points: 100,
      category: "Trees",
      solved: true
    },
    {
      title: "Dynamic Programming",
      description: "Solve the classic coin change problem",
      difficulty: "Hard",
      timeLimit: "45 min",
      points: 200,
      category: "DP",
      solved: false
    },
    {
      title: "Graph Algorithms",
      description: "Find shortest path using Dijkstra's algorithm",
      difficulty: "Hard",
      timeLimit: "60 min",
      points: 250,
      category: "Graphs",
      solved: false
    },
    {
      title: "String Manipulation",
      description: "Implement string compression algorithm",
      difficulty: "Easy",
      timeLimit: "20 min",
      points: 75,
      category: "Strings",
      solved: true
    },
    {
      title: "System Design",
      description: "Design a URL shortener service",
      difficulty: "Expert",
      timeLimit: "90 min",
      points: 400,
      category: "Design",
      solved: false
    }
  ];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-600';
      case 'Medium': return 'bg-yellow-600';
      case 'Hard': return 'bg-red-600';
      case 'Expert': return 'bg-purple-600';
      default: return 'bg-gray-600';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Arrays': return Code;
      case 'Trees': return Target;
      case 'DP': return Brain;
      case 'Graphs': return Puzzle;
      case 'Strings': return Code;
      case 'Design': return Star;
      default: return Code;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
      <AppNavigation />
      
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">
            Code Puzzles
          </h1>
          <p className="text-gray-300 text-lg">
            Challenge yourself with programming puzzles
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-4 mb-8">
          <Card className="bg-slate-800/40 border-slate-700/50 backdrop-blur-sm">
            <CardContent className="p-6 text-center">
              <Trophy className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">2</div>
              <div className="text-sm text-gray-300">Solved</div>
            </CardContent>
          </Card>
          <Card className="bg-slate-800/40 border-slate-700/50 backdrop-blur-sm">
            <CardContent className="p-6 text-center">
              <Star className="h-8 w-8 text-blue-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">125</div>
              <div className="text-sm text-gray-300">Points</div>
            </CardContent>
          </Card>
          <Card className="bg-slate-800/40 border-slate-700/50 backdrop-blur-sm">
            <CardContent className="p-6 text-center">
              <Clock className="h-8 w-8 text-green-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">35</div>
              <div className="text-sm text-gray-300">Min Saved</div>
            </CardContent>
          </Card>
          <Card className="bg-slate-800/40 border-slate-700/50 backdrop-blur-sm">
            <CardContent className="p-6 text-center">
              <Brain className="h-8 w-8 text-purple-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">6</div>
              <div className="text-sm text-gray-300">Total</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {puzzles.map((puzzle, index) => {
            const CategoryIcon = getCategoryIcon(puzzle.category);
            return (
              <Card key={index} className="bg-slate-800/40 border-slate-700/50 backdrop-blur-sm hover:bg-slate-800/60 transition-all duration-300 group">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-white text-lg flex items-center gap-2">
                        <CategoryIcon className="h-5 w-5 text-blue-400" />
                        {puzzle.title}
                      </CardTitle>
                      <CardDescription className="text-gray-300 mt-2">
                        {puzzle.description}
                      </CardDescription>
                    </div>
                    {puzzle.solved && (
                      <Trophy className="h-5 w-5 text-yellow-500" />
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex flex-wrap gap-2">
                      <Badge className={`${getDifficultyColor(puzzle.difficulty)} text-white`}>
                        {puzzle.difficulty}
                      </Badge>
                      <Badge variant="outline" className="border-slate-600 text-gray-300">
                        {puzzle.category}
                      </Badge>
                    </div>
                    
                    <div className="flex justify-between items-center text-sm">
                      <div className="flex items-center gap-1 text-gray-300">
                        <Clock className="h-4 w-4" />
                        {puzzle.timeLimit}
                      </div>
                      <div className="flex items-center gap-1 text-gray-300">
                        <Star className="h-4 w-4" />
                        {puzzle.points} pts
                      </div>
                    </div>
                    
                    <Button 
                      className={`w-full ${
                        puzzle.solved 
                          ? 'bg-green-600 hover:bg-green-700' 
                          : 'bg-blue-600 hover:bg-blue-700'
                      } text-white`}
                    >
                      {puzzle.solved ? 'Solve Again' : 'Start Puzzle'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="mt-12 text-center">
          <Card className="bg-slate-800/40 border-slate-700/50 backdrop-blur-sm max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="text-white text-xl flex items-center justify-center gap-2">
                <Puzzle className="h-6 w-6" />
                Daily Challenge
              </CardTitle>
              <CardDescription className="text-gray-300">
                Complete today's puzzle to earn bonus points and maintain your streak!
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-center">
                  <div className="text-sm text-gray-400">Today's Challenge</div>
                  <div className="text-lg font-semibold text-white">Two Sum Problem</div>
                  <div className="text-sm text-gray-300 mt-1">Find two numbers that add up to target</div>
                </div>
                <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white">
                  Start Daily Challenge
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}