import { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  Puzzle, 
  Trophy, 
  Clock, 
  Star, 
  Brain, 
  Code, 
  Target, 
  Play,
  Check,
  X,
  RefreshCw,
  Lightbulb,
  Timer,
  Award,
  ChevronRight,
  Home,
  BookOpen,
  Users,
  Zap
} from "lucide-react";
import AppNavigation from "@/components/AppNavigation";
import { useToast } from "@/hooks/use-toast";

interface PuzzleData {
  id: number;
  title: string;
  description: string;
  difficulty: "Easy" | "Medium" | "Hard" | "Expert";
  timeLimit: string;
  points: number;
  category: string;
  solved: boolean;
  code?: string;
  testCases?: { input: string; output: string }[];
  solution?: string;
  hints?: string[];
  content?: {
    problem: string;
    examples: { input: string; output: string; explanation: string }[];
    constraints: string[];
  };
}

interface QuizQuestion {
  question: string;
  options: string[];
  correct: number;
  explanation: string;
}

export default function Puzzles() {
  const [selectedPuzzle, setSelectedPuzzle] = useState<PuzzleData | null>(null);
  const [userCode, setUserCode] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [testResults, setTestResults] = useState<{ passed: boolean; message: string }[]>([]);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [showHints, setShowHints] = useState(false);
  const [currentHint, setCurrentHint] = useState(0);
  const [userStats, setUserStats] = useState({
    solved: 2,
    points: 325,
    timesSaved: 45,
    streak: 3
  });
  const [quizAnswer, setQuizAnswer] = useState('');
  const [showQuizResult, setShowQuizResult] = useState(false);
  const [quizCorrect, setQuizCorrect] = useState(false);
  const { toast } = useToast();
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const puzzles: PuzzleData[] = [
    {
      id: 1,
      title: "Array Rotation",
      description: "Rotate an array to the right by k steps",
      difficulty: "Easy",
      timeLimit: "15 min",
      points: 50,
      category: "Arrays",
      solved: false,
      code: `function rotateArray(nums, k) {
  // Your solution here
  
}`,
      testCases: [
        { input: "[1,2,3,4,5,6,7], 3", output: "[5,6,7,1,2,3,4]" },
        { input: "[-1,-100,3,99], 2", output: "[3,99,-1,-100]" }
      ],
      solution: `function rotateArray(nums, k) {
  k = k % nums.length;
  return nums.slice(-k).concat(nums.slice(0, -k));
}`,
      hints: [
        "Think about how array slicing works",
        "Consider using modulo operator for k",
        "You can concatenate array slices"
      ],
      content: {
        problem: "Given an array, rotate the array to the right by k steps, where k is non-negative.",
        examples: [
          {
            input: "nums = [1,2,3,4,5,6,7], k = 3",
            output: "[5,6,7,1,2,3,4]",
            explanation: "rotate 1 step to the right: [7,1,2,3,4,5,6], rotate 2 steps to the right: [6,7,1,2,3,4,5], rotate 3 steps to the right: [5,6,7,1,2,3,4]"
          }
        ],
        constraints: ["1 <= nums.length <= 10^5", "0 <= k <= 10^5"]
      }
    },
    {
      id: 2,
      title: "Binary Tree Traversal",
      description: "Implement inorder, preorder, and postorder traversal",
      difficulty: "Medium",
      timeLimit: "30 min",
      points: 100,
      category: "Trees",
      solved: true,
      code: `function inorderTraversal(root) {
  // Your solution here
  
}`,
      testCases: [
        { input: "[1,null,2,3]", output: "[1,3,2]" },
        { input: "[]", output: "[]" }
      ],
      solution: `function inorderTraversal(root) {
  const result = [];
  
  function traverse(node) {
    if (node) {
      traverse(node.left);
      result.push(node.val);
      traverse(node.right);
    }
  }
  
  traverse(root);
  return result;
}`,
      hints: [
        "Use recursion or iteration",
        "Inorder: left, root, right",
        "Consider using a stack for iterative approach"
      ],
      content: {
        problem: "Given the root of a binary tree, return the inorder traversal of its nodes' values.",
        examples: [
          {
            input: "root = [1,null,2,3]",
            output: "[1,3,2]",
            explanation: "The inorder traversal visits nodes in the order: left subtree, root, right subtree"
          }
        ],
        constraints: ["The number of nodes in the tree is in the range [0, 100]", "-100 <= Node.val <= 100"]
      }
    },
    {
      id: 3,
      title: "Dynamic Programming",
      description: "Solve the classic coin change problem",
      difficulty: "Hard",
      timeLimit: "45 min",
      points: 200,
      category: "DP",
      solved: false,
      code: `function coinChange(coins, amount) {
  // Your solution here
  
}`,
      testCases: [
        { input: "[1,3,4], 6", output: "2" },
        { input: "[2], 3", output: "-1" }
      ],
      solution: `function coinChange(coins, amount) {
  const dp = new Array(amount + 1).fill(Infinity);
  dp[0] = 0;
  
  for (let i = 1; i <= amount; i++) {
    for (const coin of coins) {
      if (coin <= i) {
        dp[i] = Math.min(dp[i], dp[i - coin] + 1);
      }
    }
  }
  
  return dp[amount] === Infinity ? -1 : dp[amount];
}`,
      hints: [
        "Use dynamic programming with bottom-up approach",
        "Create a dp array to store minimum coins needed",
        "For each amount, try all possible coins"
      ],
      content: {
        problem: "You are given an integer array coins representing coins of different denominations and an integer amount representing a total amount of money. Return the fewest number of coins that you need to make up that amount.",
        examples: [
          {
            input: "coins = [1,3,4], amount = 6",
            output: "2",
            explanation: "The answer is 2 because 6 = 3 + 3"
          }
        ],
        constraints: ["1 <= coins.length <= 12", "1 <= coins[i] <= 2^31 - 1", "0 <= amount <= 10^4"]
      }
    },
    {
      id: 4,
      title: "Graph Algorithms",
      description: "Find shortest path using Dijkstra's algorithm",
      difficulty: "Hard",
      timeLimit: "60 min",
      points: 250,
      category: "Graphs",
      solved: false,
      code: `function dijkstra(graph, start) {
  // Your solution here
  
}`,
      testCases: [
        { input: "[[0,4,0,0],[4,0,8,0],[0,8,0,9],[0,0,9,0]], 0", output: "[0,4,12,21]" }
      ],
      solution: `function dijkstra(graph, start) {
  const n = graph.length;
  const dist = new Array(n).fill(Infinity);
  const visited = new Array(n).fill(false);
  
  dist[start] = 0;
  
  for (let i = 0; i < n; i++) {
    let u = -1;
    for (let j = 0; j < n; j++) {
      if (!visited[j] && (u === -1 || dist[j] < dist[u])) {
        u = j;
      }
    }
    
    visited[u] = true;
    
    for (let v = 0; v < n; v++) {
      if (graph[u][v] && dist[u] + graph[u][v] < dist[v]) {
        dist[v] = dist[u] + graph[u][v];
      }
    }
  }
  
  return dist;
}`,
      hints: [
        "Use a priority queue or find minimum distance vertex",
        "Keep track of visited vertices",
        "Update distances to adjacent vertices"
      ],
      content: {
        problem: "Implement Dijkstra's algorithm to find the shortest path from a source vertex to all other vertices in a weighted graph.",
        examples: [
          {
            input: "graph = [[0,4,0,0],[4,0,8,0],[0,8,0,9],[0,0,9,0]], start = 0",
            output: "[0,4,12,21]",
            explanation: "Shortest distances from vertex 0 to all other vertices"
          }
        ],
        constraints: ["Graph is represented as adjacency matrix", "All edge weights are positive"]
      }
    },
    {
      id: 5,
      title: "String Manipulation",
      description: "Implement string compression algorithm",
      difficulty: "Easy",
      timeLimit: "20 min",
      points: 75,
      category: "Strings",
      solved: true,
      code: `function compress(chars) {
  // Your solution here
  
}`,
      testCases: [
        { input: "['a','a','b','b','c','c','c']", output: "6" },
        { input: "['a']", output: "1" }
      ],
      solution: `function compress(chars) {
  let write = 0;
  let i = 0;
  
  while (i < chars.length) {
    let char = chars[i];
    let count = 0;
    
    while (i < chars.length && chars[i] === char) {
      count++;
      i++;
    }
    
    chars[write++] = char;
    
    if (count > 1) {
      const countStr = count.toString();
      for (let j = 0; j < countStr.length; j++) {
        chars[write++] = countStr[j];
      }
    }
  }
  
  return write;
}`,
      hints: [
        "Use two pointers approach",
        "Count consecutive characters",
        "Handle single character case"
      ],
      content: {
        problem: "Given an array of characters chars, compress it using the following algorithm: Begin with an empty string s. For each group of consecutive repeating characters in chars, if the group's length is 1, append the character to s. Otherwise, append the character followed by the group's length.",
        examples: [
          {
            input: "chars = ['a','a','b','b','c','c','c']",
            output: "6",
            explanation: "The groups are 'aa', 'bb', and 'ccc'. This compresses to 'a2b2c3'."
          }
        ],
        constraints: ["1 <= chars.length <= 2000", "chars[i] is a lowercase English letter, uppercase English letter, digit, or symbol"]
      }
    },
    {
      id: 6,
      title: "System Design",
      description: "Design a URL shortener service",
      difficulty: "Expert",
      timeLimit: "90 min",
      points: 400,
      category: "Design",
      solved: false,
      code: `class URLShortener {
  constructor() {
    // Your implementation here
  }
  
  encode(longUrl) {
    // Your solution here
  }
  
  decode(shortUrl) {
    // Your solution here
  }
}`,
      testCases: [
        { input: "encode('https://leetcode.com/problems/design-tinyurl')", output: "http://tinyurl.com/4e9iAk" },
        { input: "decode('http://tinyurl.com/4e9iAk')", output: "https://leetcode.com/problems/design-tinyurl" }
      ],
      solution: `class URLShortener {
  constructor() {
    this.urlMap = new Map();
    this.reverseMap = new Map();
    this.baseUrl = "http://tinyurl.com/";
    this.counter = 0;
  }
  
  encode(longUrl) {
    if (this.reverseMap.has(longUrl)) {
      return this.reverseMap.get(longUrl);
    }
    
    const shortCode = this.base62Encode(this.counter++);
    const shortUrl = this.baseUrl + shortCode;
    
    this.urlMap.set(shortUrl, longUrl);
    this.reverseMap.set(longUrl, shortUrl);
    
    return shortUrl;
  }
  
  decode(shortUrl) {
    return this.urlMap.get(shortUrl) || '';
  }
  
  base62Encode(num) {
    const chars = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let result = "";
    
    while (num > 0) {
      result = chars[num % 62] + result;
      num = Math.floor(num / 62);
    }
    
    return result || "0";
  }
}`,
      hints: [
        "Use hash maps for bidirectional mapping",
        "Consider base62 encoding for short URLs",
        "Handle collision resolution"
      ],
      content: {
        problem: "Design a URL shortener service like TinyURL that can encode a URL to a shortened URL and decode a shortened URL to its original URL.",
        examples: [
          {
            input: "url = 'https://leetcode.com/problems/design-tinyurl'",
            output: "http://tinyurl.com/4e9iAk",
            explanation: "The shortened URL should be able to decode back to the original URL"
          }
        ],
        constraints: ["The shortened URL should be as short as possible", "The system should handle large scale"]
      }
    }
  ];

  const dailyQuiz: QuizQuestion = {
    question: "What is the time complexity of QuickSort in the average case?",
    options: ["O(n)", "O(n log n)", "O(n²)", "O(log n)"],
    correct: 1,
    explanation: "QuickSort has O(n log n) average time complexity because it divides the array in half on average and processes each element once at each level."
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-500 hover:bg-green-600';
      case 'Medium': return 'bg-yellow-500 hover:bg-yellow-600';
      case 'Hard': return 'bg-red-500 hover:bg-red-600';
      case 'Expert': return 'bg-purple-500 hover:bg-purple-600';
      default: return 'bg-gray-500 hover:bg-gray-600';
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

  const startTimer = (minutes: number) => {
    const totalSeconds = minutes * 60;
    setTimeLeft(totalSeconds);
    setIsTimerActive(true);
    
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          setIsTimerActive(false);
          toast({
            title: "Time's up!",
            description: "You can still continue working on the puzzle.",
            variant: "destructive"
          });
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const stopTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setIsTimerActive(false);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const runCode = async () => {
    if (!selectedPuzzle) return;
    
    setIsRunning(true);
    
    // Simulate code execution
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Simple test case validation
    const results = selectedPuzzle.testCases?.map(testCase => {
      const passed = Math.random() > 0.3; // Simulate random success
      return {
        passed,
        message: passed ? `Test case passed: ${testCase.input} → ${testCase.output}` : `Test case failed: ${testCase.input}`
      };
    }) || [];
    
    setTestResults(results);
    setIsRunning(false);
    
    const allPassed = results.every(r => r.passed);
    if (allPassed) {
      setUserStats(prev => ({ ...prev, solved: prev.solved + 1, points: prev.points + selectedPuzzle.points }));
      toast({
        title: "Congratulations!",
        description: `You solved the puzzle and earned ${selectedPuzzle.points} points!`,
        variant: "default"
      });
      stopTimer();
    }
  };

  const handleQuizSubmit = () => {
    const correct = parseInt(quizAnswer) === dailyQuiz.correct;
    setQuizCorrect(correct);
    setShowQuizResult(true);
    
    if (correct) {
      setUserStats(prev => ({ ...prev, points: prev.points + 25, streak: prev.streak + 1 }));
      toast({
        title: "Correct!",
        description: "You earned 25 bonus points!",
        variant: "default"
      });
    }
  };

  const startPuzzle = (puzzle: PuzzleData) => {
    setSelectedPuzzle(puzzle);
    setUserCode(puzzle.code || '');
    setTestResults([]);
    setShowHints(false);
    setCurrentHint(0);
    const minutes = parseInt(puzzle.timeLimit.split(' ')[0]);
    startTimer(minutes);
  };

  const closePuzzle = () => {
    setSelectedPuzzle(null);
    stopTimer();
    setTimeLeft(0);
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
      <AppNavigation />
      
      <div className="container mx-auto px-4 py-6">
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
            Code Puzzles
          </h1>
          <p className="text-gray-300 text-sm sm:text-base">
            Challenge yourself with programming puzzles and improve your coding skills
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
            <CardContent className="p-4 text-center">
              <Trophy className="h-6 w-6 text-yellow-400 mx-auto mb-2" />
              <div className="text-xl font-bold text-white">{userStats.solved}</div>
              <div className="text-xs text-gray-300">Solved</div>
            </CardContent>
          </Card>
          <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
            <CardContent className="p-4 text-center">
              <Star className="h-6 w-6 text-blue-400 mx-auto mb-2" />
              <div className="text-xl font-bold text-white">{userStats.points}</div>
              <div className="text-xs text-gray-300">Points</div>
            </CardContent>
          </Card>
          <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
            <CardContent className="p-4 text-center">
              <Clock className="h-6 w-6 text-green-400 mx-auto mb-2" />
              <div className="text-xl font-bold text-white">{userStats.timesSaved}</div>
              <div className="text-xs text-gray-300">Min Saved</div>
            </CardContent>
          </Card>
          <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
            <CardContent className="p-4 text-center">
              <Zap className="h-6 w-6 text-purple-400 mx-auto mb-2" />
              <div className="text-xl font-bold text-white">{userStats.streak}</div>
              <div className="text-xs text-gray-300">Streak</div>
            </CardContent>
          </Card>
        </div>

        {/* Puzzle Grid */}
        <div className="grid gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
          {puzzles.map((puzzle) => {
            const CategoryIcon = getCategoryIcon(puzzle.category);
            return (
              <Card key={puzzle.id} className="bg-white/10 border-white/20 backdrop-blur-sm hover:bg-white/15 transition-all duration-300 group">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <CardTitle className="text-white text-lg flex items-center gap-2">
                        <CategoryIcon className="h-5 w-5 text-blue-400" />
                        {puzzle.title}
                        {puzzle.solved && <Trophy className="h-4 w-4 text-yellow-400" />}
                      </CardTitle>
                      <CardDescription className="text-gray-300 mt-1 text-sm">
                        {puzzle.description}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex flex-wrap gap-2">
                    <Badge className={`${getDifficultyColor(puzzle.difficulty)} text-white text-xs`}>
                      {puzzle.difficulty}
                    </Badge>
                    <Badge variant="outline" className="border-white/20 text-gray-300 text-xs">
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
                    onClick={() => startPuzzle(puzzle)}
                    className={`w-full ${
                      puzzle.solved 
                        ? 'bg-green-500 hover:bg-green-600' 
                        : 'bg-blue-500 hover:bg-blue-600'
                    } text-white transition-all`}
                  >
                    <Play className="h-4 w-4 mr-2" />
                    {puzzle.solved ? 'Solve Again' : 'Start Puzzle'}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Daily Challenge */}
        <Card className="bg-white/10 border-white/20 backdrop-blur-sm max-w-2xl mx-auto">
          <CardHeader className="text-center">
            <CardTitle className="text-white text-xl flex items-center justify-center gap-2">
              <Award className="h-6 w-6 text-purple-400" />
              Daily Challenge
            </CardTitle>
            <CardDescription className="text-gray-300">
              Answer today's quiz question to earn bonus points!
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center">
              <div className="text-white font-medium mb-4">{dailyQuiz.question}</div>
              <RadioGroup value={quizAnswer} onValueChange={setQuizAnswer} className="space-y-3">
                {dailyQuiz.options.map((option, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                    <Label htmlFor={`option-${index}`} className="text-gray-300 cursor-pointer">
                      {option}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
            
            {!showQuizResult ? (
              <Button 
                onClick={handleQuizSubmit}
                disabled={!quizAnswer}
                className="w-full bg-purple-500 hover:bg-purple-600 text-white"
              >
                Submit Answer
              </Button>
            ) : (
              <div className={`p-4 rounded-lg ${quizCorrect ? 'bg-green-500/20 border border-green-500/50' : 'bg-red-500/20 border border-red-500/50'}`}>
                <div className="flex items-center gap-2 mb-2">
                  {quizCorrect ? (
                    <Check className="h-5 w-5 text-green-400" />
                  ) : (
                    <X className="h-5 w-5 text-red-400" />
                  )}
                  <span className="text-white font-medium">
                    {quizCorrect ? 'Correct!' : 'Incorrect'}
                  </span>
                </div>
                <p className="text-gray-300 text-sm">{dailyQuiz.explanation}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Puzzle Modal */}
      {selectedPuzzle && (
        <Dialog open={!!selectedPuzzle} onOpenChange={closePuzzle}>
          <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto bg-slate-900 border-slate-700">
            <DialogHeader>
              <DialogTitle className="text-white text-xl flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Code className="h-5 w-5" />
                  {selectedPuzzle.title}
                </span>
                <div className="flex items-center gap-4">
                  {isTimerActive && (
                    <div className="flex items-center gap-2 text-yellow-400">
                      <Timer className="h-4 w-4" />
                      {formatTime(timeLeft)}
                    </div>
                  )}
                  <Badge className={getDifficultyColor(selectedPuzzle.difficulty)}>
                    {selectedPuzzle.difficulty}
                  </Badge>
                </div>
              </DialogTitle>
            </DialogHeader>

            <div className="grid gap-6 lg:grid-cols-2">
              {/* Problem Description */}
              <div className="space-y-4">
                <Card className="bg-slate-800/50 border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-white text-lg">Problem</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-gray-300 text-sm">{selectedPuzzle.content?.problem}</p>
                    
                    {selectedPuzzle.content?.examples && (
                      <div>
                        <h4 className="text-white font-medium mb-2">Examples:</h4>
                        {selectedPuzzle.content.examples.map((example, index) => (
                          <div key={index} className="bg-slate-900/60 p-3 rounded-lg text-sm">
                            <div className="text-blue-400">Input: {example.input}</div>
                            <div className="text-green-400">Output: {example.output}</div>
                            <div className="text-gray-400 mt-1">{example.explanation}</div>
                          </div>
                        ))}
                      </div>
                    )}
                    
                    {selectedPuzzle.content?.constraints && (
                      <div>
                        <h4 className="text-white font-medium mb-2">Constraints:</h4>
                        <ul className="text-gray-300 text-sm space-y-1">
                          {selectedPuzzle.content.constraints.map((constraint, index) => (
                            <li key={index}>• {constraint}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Test Cases */}
                <Card className="bg-slate-800/50 border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-white text-lg">Test Cases</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {selectedPuzzle.testCases?.map((testCase, index) => (
                        <div key={index} className="bg-slate-900/60 p-3 rounded-lg text-sm">
                          <div className="text-blue-400">Input: {testCase.input}</div>
                          <div className="text-green-400">Expected: {testCase.output}</div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Hints */}
                <Card className="bg-slate-800/50 border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-white text-lg flex items-center justify-between">
                      <span>Hints</span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowHints(!showHints)}
                        className="border-slate-600"
                      >
                        <Lightbulb className="h-4 w-4" />
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  {showHints && (
                    <CardContent>
                      <div className="space-y-2">
                        {selectedPuzzle.hints?.slice(0, currentHint + 1).map((hint, index) => (
                          <div key={index} className="bg-yellow-500/10 border border-yellow-500/20 p-3 rounded-lg">
                            <p className="text-yellow-200 text-sm">{hint}</p>
                          </div>
                        ))}
                        {selectedPuzzle.hints && currentHint < selectedPuzzle.hints.length - 1 && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCurrentHint(prev => prev + 1)}
                            className="border-slate-600 text-gray-300"
                          >
                            Show Next Hint
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  )}
                </Card>
              </div>

              {/* Code Editor */}
              <div className="space-y-4">
                <Card className="bg-slate-800/50 border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-white text-lg">Code Editor</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Textarea
                      value={userCode}
                      onChange={(e) => setUserCode(e.target.value)}
                      placeholder="Write your solution here..."
                      className="min-h-[300px] bg-slate-900/60 border-slate-600 text-gray-300 font-mono text-sm resize-none"
                    />
                    <div className="flex gap-2 mt-4">
                      <Button
                        onClick={runCode}
                        disabled={isRunning}
                        className="bg-green-500 hover:bg-green-600 text-white"
                      >
                        {isRunning ? (
                          <>
                            <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                            Running...
                          </>
                        ) : (
                          <>
                            <Play className="h-4 w-4 mr-2" />
                            Run Code
                          </>
                        )}
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => setUserCode(selectedPuzzle.code || '')}
                        className="border-slate-600 text-gray-300"
                      >
                        Reset
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Test Results */}
                {testResults.length > 0 && (
                  <Card className="bg-slate-800/50 border-slate-700">
                    <CardHeader>
                      <CardTitle className="text-white text-lg">Test Results</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {testResults.map((result, index) => (
                          <div 
                            key={index} 
                            className={`p-3 rounded-lg flex items-center gap-2 ${
                              result.passed 
                                ? 'bg-green-500/20 border border-green-500/50' 
                                : 'bg-red-500/20 border border-red-500/50'
                            }`}
                          >
                            {result.passed ? (
                              <Check className="h-4 w-4 text-green-400" />
                            ) : (
                              <X className="h-4 w-4 text-red-400" />
                            )}
                            <span className="text-gray-300 text-sm">{result.message}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}