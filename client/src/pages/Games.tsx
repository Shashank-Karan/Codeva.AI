import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { 
  Bug, 
  Eye, 
  Code, 
  Target, 
  Trophy, 
  CheckCircle, 
  XCircle, 
  ArrowRight,
  Gamepad2,
  Zap,
  Brain
} from "lucide-react";
import AppNavigation from "@/components/AppNavigation";
import { useToast } from "@/hooks/use-toast";

// Game types and interfaces
interface GameResult {
  correct: boolean;
  explanation: string;
}

interface FixTheBugGame {
  id: number;
  title: string;
  description: string;
  buggyCode: string;
  correctCode: string;
  hint: string;
  language: string;
}

interface PredictOutputGame {
  id: number;
  title: string;
  code: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  language: string;
}

interface DragDropGame {
  id: number;
  title: string;
  description: string;
  shuffledLines: string[];
  correctOrder: string[];
  language: string;
}

interface FillBlankGame {
  id: number;
  title: string;
  codeTemplate: string;
  missingWord: string;
  hint: string;
  language: string;
}

interface SpotErrorGame {
  id: number;
  title: string;
  codeLines: string[];
  errorLineIndex: number;
  explanation: string;
  language: string;
}

// Sample game data
const fixTheBugGames: FixTheBugGame[] = [
  {
    id: 1,
    title: "Missing Colon in If Statement",
    description: "Fix the syntax error in this Python if statement",
    buggyCode: `name = "Alice"
if name == "Alice"
    print("Hello Alice!")`,
    correctCode: `name = "Alice"
if name == "Alice":
    print("Hello Alice!")`,
    hint: "Python if statements need a colon (:) at the end",
    language: "python"
  },
  {
    id: 2,
    title: "Indentation Error",
    description: "Fix the indentation in this Python function",
    buggyCode: `def greet(name):
print(f"Hello {name}!")
return "Done"`,
    correctCode: `def greet(name):
    print(f"Hello {name}!")
    return "Done"`,
    hint: "Python uses indentation to define code blocks",
    language: "python"
  }
];

const predictOutputGames: PredictOutputGame[] = [
  {
    id: 1,
    title: "List Slicing",
    code: `numbers = [1, 2, 3, 4, 5]
print(numbers[1:4])`,
    options: ["[1, 2, 3]", "[2, 3, 4]", "[1, 2, 3, 4]", "[2, 3, 4, 5]"],
    correctAnswer: 1,
    explanation: "List slicing [1:4] starts at index 1 and goes up to (but not including) index 4",
    language: "python"
  },
  {
    id: 2,
    title: "String Concatenation",
    code: `x = "Hello"
y = "World"
print(x + " " + y)`,
    options: ["HelloWorld", "Hello World", "Hello+World", "Error"],
    correctAnswer: 1,
    explanation: "String concatenation with + joins the strings together",
    language: "python"
  }
];

const dragDropGames: DragDropGame[] = [
  {
    id: 1,
    title: "Function Definition Order",
    description: "Arrange these lines to create a proper function that calculates area",
    shuffledLines: [
      "    return length * width",
      "    area = length * width",
      "def calculate_area(length, width):",
      "    print(f\"Area is: {area}\")"
    ],
    correctOrder: [
      "def calculate_area(length, width):",
      "    area = length * width", 
      "    print(f\"Area is: {area}\")",
      "    return length * width"
    ],
    language: "python"
  }
];

const fillBlankGames: FillBlankGame[] = [
  {
    id: 1,
    title: "For Loop Range",
    codeTemplate: `for i in _____(5):
    print(i)`,
    missingWord: "range",
    hint: "Function used to generate a sequence of numbers",
    language: "python"
  },
  {
    id: 2,
    title: "Conditional Statement",
    codeTemplate: `age = 18
___ age >= 18:
    print("You can vote!")`,
    missingWord: "if",
    hint: "Keyword used for conditional statements",
    language: "python"
  }
];

const spotErrorGames: SpotErrorGame[] = [
  {
    id: 1,
    title: "Variable Name Error",
    codeLines: [
      "user_name = \"John\"",
      "user_age = 25", 
      "print(f\"Hello {username}!\")",
      "print(f\"You are {user_age} years old\")"
    ],
    errorLineIndex: 2,
    explanation: "Variable 'username' is not defined. It should be 'user_name' (with underscore)",
    language: "python"
  }
];

export default function Games() {
  const [activeGame, setActiveGame] = useState("fix-bug");
  const [currentFixBug, setCurrentFixBug] = useState(0);
  const [currentPredictOutput, setCurrentPredictOutput] = useState(0);
  const [currentDragDrop, setCurrentDragDrop] = useState(0);
  const [currentFillBlank, setCurrentFillBlank] = useState(0);
  const [currentSpotError, setCurrentSpotError] = useState(0);
  
  const [userCode, setUserCode] = useState("");
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [draggedLines, setDraggedLines] = useState<string[]>([]);
  const [fillAnswer, setFillAnswer] = useState("");
  const [selectedErrorLine, setSelectedErrorLine] = useState(-1);
  
  const [showResult, setShowResult] = useState(false);
  const [gameResult, setGameResult] = useState<GameResult>({ correct: false, explanation: "" });
  const [score, setScore] = useState(0);
  
  const { toast } = useToast();

  // Initialize drag and drop lines
  useEffect(() => {
    if (activeGame === "drag-drop") {
      setDraggedLines([...dragDropGames[currentDragDrop].shuffledLines]);
    }
  }, [activeGame, currentDragDrop]);

  // Fix the Bug game logic
  const checkFixBugAnswer = () => {
    const current = fixTheBugGames[currentFixBug];
    const isCorrect = userCode.trim() === current.correctCode.trim();
    
    setGameResult({
      correct: isCorrect,
      explanation: isCorrect ? "Great job! You fixed the bug correctly!" : `Not quite right. ${current.hint}`
    });
    setShowResult(true);
    
    if (isCorrect) {
      setScore(prev => prev + 10);
      toast({
        title: "Correct! 🎉",
        description: "You fixed the bug successfully!",
      });
    }
  };

  // Predict Output game logic
  const checkPredictAnswer = () => {
    const current = predictOutputGames[currentPredictOutput];
    const isCorrect = parseInt(selectedAnswer) === current.correctAnswer;
    
    setGameResult({
      correct: isCorrect,
      explanation: current.explanation
    });
    setShowResult(true);
    
    if (isCorrect) {
      setScore(prev => prev + 10);
      toast({
        title: "Correct! 🎉",
        description: "You predicted the output correctly!",
      });
    }
  };

  // Drag and Drop game logic
  const checkDragDropAnswer = () => {
    const current = dragDropGames[currentDragDrop];
    const isCorrect = JSON.stringify(draggedLines) === JSON.stringify(current.correctOrder);
    
    setGameResult({
      correct: isCorrect,
      explanation: isCorrect ? "Perfect! You arranged the code correctly!" : "Not quite right. Try to think about the logical flow of the function."
    });
    setShowResult(true);
    
    if (isCorrect) {
      setScore(prev => prev + 10);
      toast({
        title: "Correct! 🎉",
        description: "You arranged the code perfectly!",
      });
    }
  };

  const handleDragStart = (e: React.DragEvent, index: number) => {
    e.dataTransfer.setData("text/plain", index.toString());
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();
    const draggedIndex = parseInt(e.dataTransfer.getData("text/plain"));
    
    if (draggedIndex !== targetIndex) {
      const newLines = [...draggedLines];
      const [draggedLine] = newLines.splice(draggedIndex, 1);
      newLines.splice(targetIndex, 0, draggedLine);
      setDraggedLines(newLines);
    }
  };

  // Fill in the Blank game logic
  const checkFillBlankAnswer = () => {
    const current = fillBlankGames[currentFillBlank];
    const isCorrect = fillAnswer.toLowerCase().trim() === current.missingWord.toLowerCase();
    
    setGameResult({
      correct: isCorrect,
      explanation: isCorrect ? "Excellent! You filled in the correct keyword!" : `Not quite right. ${current.hint}`
    });
    setShowResult(true);
    
    if (isCorrect) {
      setScore(prev => prev + 10);
      toast({
        title: "Correct! 🎉",
        description: "You filled in the blank correctly!",
      });
    }
  };

  // Spot the Error game logic
  const checkSpotErrorAnswer = () => {
    const current = spotErrorGames[currentSpotError];
    const isCorrect = selectedErrorLine === current.errorLineIndex;
    
    setGameResult({
      correct: isCorrect,
      explanation: current.explanation
    });
    setShowResult(true);
    
    if (isCorrect) {
      setScore(prev => prev + 10);
      toast({
        title: "Correct! 🎉",
        description: "You spotted the error correctly!",
      });
    }
  };

  // Move to next question
  const nextQuestion = (gameType: string) => {
    setShowResult(false);
    setUserCode("");
    setSelectedAnswer("");
    setFillAnswer("");
    setSelectedErrorLine(-1);
    
    switch (gameType) {
      case "fix-bug":
        if (currentFixBug < fixTheBugGames.length - 1) {
          setCurrentFixBug(prev => prev + 1);
        }
        break;
      case "predict-output":
        if (currentPredictOutput < predictOutputGames.length - 1) {
          setCurrentPredictOutput(prev => prev + 1);
        }
        break;
      case "drag-drop":
        if (currentDragDrop < dragDropGames.length - 1) {
          setCurrentDragDrop(prev => prev + 1);
        }
        break;
      case "fill-blank":
        if (currentFillBlank < fillBlankGames.length - 1) {
          setCurrentFillBlank(prev => prev + 1);
        }
        break;
      case "spot-error":
        if (currentSpotError < spotErrorGames.length - 1) {
          setCurrentSpotError(prev => prev + 1);
        }
        break;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="h-full w-full bg-gradient-to-br from-blue-500/10 to-purple-500/10"></div>
      </div>

      {/* Floating game elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[15%] left-[8%] text-green-400/20 text-4xl animate-bounce select-none">
          🎮
        </div>
        <div className="absolute top-[70%] right-[10%] text-purple-400/20 text-3xl animate-bounce delay-300 select-none">
          🏆
        </div>
        <div className="absolute top-[40%] right-[15%] text-yellow-400/20 text-2xl animate-bounce delay-700 select-none">
          ⚡
        </div>
      </div>

      <AppNavigation />

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 lg:px-6 pt-6">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center px-4 py-2 bg-green-600/20 backdrop-blur-sm rounded-full text-green-300 text-sm mb-4 border border-green-500/20">
            <Gamepad2 className="h-4 w-4 mr-2" />
            Learning Through Play
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4">
            Code Learning Games
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-4">
            Master programming concepts through interactive games and challenges
          </p>
          <div className="flex items-center justify-center gap-4">
            <Badge variant="outline" className="bg-yellow-600/20 text-yellow-300 border-yellow-500/30">
              <Trophy className="h-4 w-4 mr-1" />
              Score: {score}
            </Badge>
          </div>
        </div>

        {/* Games Tabs */}
        <Tabs value={activeGame} onValueChange={setActiveGame} className="w-full">
          <TabsList className="grid w-full grid-cols-5 bg-slate-800/50 backdrop-blur-sm">
            <TabsTrigger value="fix-bug" className="data-[state=active]:bg-red-600">
              <Bug className="h-4 w-4 mr-2" />
              Fix Bug
            </TabsTrigger>
            <TabsTrigger value="predict-output" className="data-[state=active]:bg-blue-600">
              <Eye className="h-4 w-4 mr-2" />
              Predict
            </TabsTrigger>
            <TabsTrigger value="drag-drop" className="data-[state=active]:bg-green-600">
              <Code className="h-4 w-4 mr-2" />
              Drag & Drop
            </TabsTrigger>
            <TabsTrigger value="fill-blank" className="data-[state=active]:bg-purple-600">
              <Zap className="h-4 w-4 mr-2" />
              Fill Blank
            </TabsTrigger>
            <TabsTrigger value="spot-error" className="data-[state=active]:bg-orange-600">
              <Target className="h-4 w-4 mr-2" />
              Spot Error
            </TabsTrigger>
          </TabsList>

          {/* Fix the Bug Game */}
          <TabsContent value="fix-bug" className="space-y-6">
            <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Bug className="h-5 w-5 mr-2 text-red-400" />
                  {fixTheBugGames[currentFixBug]?.title}
                </CardTitle>
                <CardDescription className="text-gray-400">
                  {fixTheBugGames[currentFixBug]?.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-white mb-2 block">Buggy Code:</Label>
                  <div className="bg-slate-900/60 p-4 rounded-lg border border-slate-600">
                    <pre className="text-red-300 text-sm font-mono whitespace-pre-wrap">
                      {fixTheBugGames[currentFixBug]?.buggyCode}
                    </pre>
                  </div>
                </div>
                
                <div>
                  <Label className="text-white mb-2 block">Your Fix:</Label>
                  <Textarea
                    value={userCode}
                    onChange={(e) => setUserCode(e.target.value)}
                    placeholder="Enter the corrected code here..."
                    className="bg-slate-900/60 border-slate-600 text-white font-mono text-sm min-h-[120px]"
                  />
                </div>

                {showResult && (
                  <div className={`p-4 rounded-lg border ${gameResult.correct ? 'bg-green-900/40 border-green-600' : 'bg-red-900/40 border-red-600'}`}>
                    <div className="flex items-center gap-2 mb-2">
                      {gameResult.correct ? (
                        <CheckCircle className="h-5 w-5 text-green-400" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-400" />
                      )}
                      <span className={`font-semibold ${gameResult.correct ? 'text-green-300' : 'text-red-300'}`}>
                        {gameResult.correct ? 'Correct!' : 'Not quite right'}
                      </span>
                    </div>
                    <p className="text-gray-300">{gameResult.explanation}</p>
                  </div>
                )}

                <div className="flex gap-3">
                  <Button 
                    onClick={checkFixBugAnswer}
                    disabled={!userCode.trim() || showResult}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    Submit Fix
                  </Button>
                  {showResult && currentFixBug < fixTheBugGames.length - 1 && (
                    <Button 
                      onClick={() => nextQuestion("fix-bug")}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      Next Challenge <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Predict Output Game */}
          <TabsContent value="predict-output" className="space-y-6">
            <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Eye className="h-5 w-5 mr-2 text-blue-400" />
                  {predictOutputGames[currentPredictOutput]?.title}
                </CardTitle>
                <CardDescription className="text-gray-400">
                  What will this code output?
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-white mb-2 block">Code:</Label>
                  <div className="bg-slate-900/60 p-4 rounded-lg border border-slate-600">
                    <pre className="text-blue-300 text-sm font-mono whitespace-pre-wrap">
                      {predictOutputGames[currentPredictOutput]?.code}
                    </pre>
                  </div>
                </div>

                <div>
                  <Label className="text-white mb-2 block">Choose the correct output:</Label>
                  <RadioGroup value={selectedAnswer} onValueChange={setSelectedAnswer}>
                    {predictOutputGames[currentPredictOutput]?.options.map((option, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                        <Label htmlFor={`option-${index}`} className="text-gray-300 font-mono">
                          {option}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>

                {showResult && (
                  <div className={`p-4 rounded-lg border ${gameResult.correct ? 'bg-green-900/40 border-green-600' : 'bg-red-900/40 border-red-600'}`}>
                    <div className="flex items-center gap-2 mb-2">
                      {gameResult.correct ? (
                        <CheckCircle className="h-5 w-5 text-green-400" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-400" />
                      )}
                      <span className={`font-semibold ${gameResult.correct ? 'text-green-300' : 'text-red-300'}`}>
                        {gameResult.correct ? 'Correct!' : 'Not quite right'}
                      </span>
                    </div>
                    <p className="text-gray-300">{gameResult.explanation}</p>
                  </div>
                )}

                <div className="flex gap-3">
                  <Button 
                    onClick={checkPredictAnswer}
                    disabled={!selectedAnswer || showResult}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    Submit Answer
                  </Button>
                  {showResult && currentPredictOutput < predictOutputGames.length - 1 && (
                    <Button 
                      onClick={() => nextQuestion("predict-output")}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      Next Challenge <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Drag and Drop Game */}
          <TabsContent value="drag-drop" className="space-y-6">
            <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Code className="h-5 w-5 mr-2 text-green-400" />
                  {dragDropGames[currentDragDrop]?.title}
                </CardTitle>
                <CardDescription className="text-gray-400">
                  {dragDropGames[currentDragDrop]?.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-white mb-2 block">Drag and drop the lines to arrange them correctly:</Label>
                  <div className="bg-slate-900/60 p-4 rounded-lg border border-slate-600 space-y-2">
                    {draggedLines.map((line, index) => (
                      <div
                        key={index}
                        draggable
                        onDragStart={(e) => handleDragStart(e, index)}
                        onDragOver={handleDragOver}
                        onDrop={(e) => handleDrop(e, index)}
                        className="bg-slate-800/60 p-3 rounded border border-slate-600 cursor-move hover:bg-slate-700/60 transition-colors font-mono text-sm text-green-300 flex items-center"
                      >
                        <div className="w-6 h-6 bg-slate-600 rounded mr-3 flex items-center justify-center text-xs text-gray-400">
                          {index + 1}
                        </div>
                        <span className="select-none">{line}</span>
                      </div>
                    ))}
                  </div>
                  <p className="text-gray-400 text-sm mt-2">
                    Hint: Think about the logical flow of a function definition
                  </p>
                </div>

                {showResult && (
                  <div className={`p-4 rounded-lg border ${gameResult.correct ? 'bg-green-900/40 border-green-600' : 'bg-red-900/40 border-red-600'}`}>
                    <div className="flex items-center gap-2 mb-2">
                      {gameResult.correct ? (
                        <CheckCircle className="h-5 w-5 text-green-400" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-400" />
                      )}
                      <span className={`font-semibold ${gameResult.correct ? 'text-green-300' : 'text-red-300'}`}>
                        {gameResult.correct ? 'Correct!' : 'Not quite right'}
                      </span>
                    </div>
                    <p className="text-gray-300">{gameResult.explanation}</p>
                  </div>
                )}

                <div className="flex gap-3">
                  <Button 
                    onClick={checkDragDropAnswer}
                    disabled={showResult}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    Submit Order
                  </Button>
                  {showResult && currentDragDrop < dragDropGames.length - 1 && (
                    <Button 
                      onClick={() => nextQuestion("drag-drop")}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      Next Challenge <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Fill in the Blank Game */}
          <TabsContent value="fill-blank" className="space-y-6">
            <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Zap className="h-5 w-5 mr-2 text-purple-400" />
                  {fillBlankGames[currentFillBlank]?.title}
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Fill in the missing keyword to complete the code
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-white mb-2 block">Code with missing word:</Label>
                  <div className="bg-slate-900/60 p-4 rounded-lg border border-slate-600">
                    <pre className="text-purple-300 text-sm font-mono whitespace-pre-wrap">
                      {fillBlankGames[currentFillBlank]?.codeTemplate}
                    </pre>
                  </div>
                </div>

                <div>
                  <Label className="text-white mb-2 block">Missing word:</Label>
                  <Input
                    value={fillAnswer}
                    onChange={(e) => setFillAnswer(e.target.value)}
                    placeholder="Type the missing keyword..."
                    className="bg-slate-900/60 border-slate-600 text-white font-mono"
                  />
                  <p className="text-gray-400 text-sm mt-1">
                    Hint: {fillBlankGames[currentFillBlank]?.hint}
                  </p>
                </div>

                {showResult && (
                  <div className={`p-4 rounded-lg border ${gameResult.correct ? 'bg-green-900/40 border-green-600' : 'bg-red-900/40 border-red-600'}`}>
                    <div className="flex items-center gap-2 mb-2">
                      {gameResult.correct ? (
                        <CheckCircle className="h-5 w-5 text-green-400" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-400" />
                      )}
                      <span className={`font-semibold ${gameResult.correct ? 'text-green-300' : 'text-red-300'}`}>
                        {gameResult.correct ? 'Correct!' : 'Not quite right'}
                      </span>
                    </div>
                    <p className="text-gray-300">{gameResult.explanation}</p>
                  </div>
                )}

                <div className="flex gap-3">
                  <Button 
                    onClick={checkFillBlankAnswer}
                    disabled={!fillAnswer.trim() || showResult}
                    className="bg-purple-600 hover:bg-purple-700"
                  >
                    Submit Answer
                  </Button>
                  {showResult && currentFillBlank < fillBlankGames.length - 1 && (
                    <Button 
                      onClick={() => nextQuestion("fill-blank")}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      Next Challenge <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Spot the Error Game */}
          <TabsContent value="spot-error" className="space-y-6">
            <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Target className="h-5 w-5 mr-2 text-orange-400" />
                  {spotErrorGames[currentSpotError]?.title}
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Click on the line that contains the error
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-white mb-2 block">Code (click on the error line):</Label>
                  <div className="bg-slate-900/60 p-4 rounded-lg border border-slate-600">
                    {spotErrorGames[currentSpotError]?.codeLines.map((line, index) => (
                      <div
                        key={index}
                        onClick={() => setSelectedErrorLine(index)}
                        className={`p-2 rounded cursor-pointer font-mono text-sm transition-colors ${
                          selectedErrorLine === index 
                            ? 'bg-orange-600/40 border border-orange-500' 
                            : 'hover:bg-slate-700/50'
                        }`}
                      >
                        <span className="text-gray-500 mr-3">{index + 1}.</span>
                        <span className="text-orange-300">{line}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {showResult && (
                  <div className={`p-4 rounded-lg border ${gameResult.correct ? 'bg-green-900/40 border-green-600' : 'bg-red-900/40 border-red-600'}`}>
                    <div className="flex items-center gap-2 mb-2">
                      {gameResult.correct ? (
                        <CheckCircle className="h-5 w-5 text-green-400" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-400" />
                      )}
                      <span className={`font-semibold ${gameResult.correct ? 'text-green-300' : 'text-red-300'}`}>
                        {gameResult.correct ? 'Correct!' : 'Not quite right'}
                      </span>
                    </div>
                    <p className="text-gray-300">{gameResult.explanation}</p>
                  </div>
                )}

                <div className="flex gap-3">
                  <Button 
                    onClick={checkSpotErrorAnswer}
                    disabled={selectedErrorLine === -1 || showResult}
                    className="bg-orange-600 hover:bg-orange-700"
                  >
                    Submit Answer
                  </Button>
                  {showResult && currentSpotError < spotErrorGames.length - 1 && (
                    <Button 
                      onClick={() => nextQuestion("spot-error")}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      Next Challenge <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}