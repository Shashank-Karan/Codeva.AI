import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Delete, RotateCcw, History } from "lucide-react";
import AppNavigation from "@/components/AppNavigation";

export default function Calculator() {
  const [display, setDisplay] = useState('0');
  const [previousValue, setPreviousValue] = useState<number | null>(null);
  const [operation, setOperation] = useState<string | null>(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);
  const [history, setHistory] = useState<string[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  // Handle keyboard input
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      const key = event.key;
      
      if (key >= '0' && key <= '9') {
        inputDigit(key);
      } else if (key === '.') {
        inputDot();
      } else if (key === '+' || key === '-' || key === '*' || key === '/') {
        performOperation(key);
      } else if (key === 'Enter' || key === '=') {
        performOperation('=');
      } else if (key === 'Escape' || key === 'c' || key === 'C') {
        clear();
      } else if (key === 'Backspace') {
        backspace();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [display, operation, previousValue, waitingForOperand]);

  const inputDigit = (digit: string) => {
    if (waitingForOperand) {
      setDisplay(digit);
      setWaitingForOperand(false);
    } else {
      setDisplay(display === '0' ? digit : display + digit);
    }
  };

  const inputDot = () => {
    if (waitingForOperand) {
      setDisplay('0.');
      setWaitingForOperand(false);
    } else if (display.indexOf('.') === -1) {
      setDisplay(display + '.');
    }
  };

  const clear = () => {
    setDisplay('0');
    setPreviousValue(null);
    setOperation(null);
    setWaitingForOperand(false);
  };

  const backspace = () => {
    if (display.length > 1) {
      setDisplay(display.slice(0, -1));
    } else {
      setDisplay('0');
    }
  };

  const performOperation = (nextOperation: string) => {
    const inputValue = parseFloat(display);

    if (previousValue === null) {
      setPreviousValue(inputValue);
    } else if (operation) {
      const currentValue = previousValue || 0;
      const result = calculate(currentValue, inputValue, operation);
      
      const calculation = `${formatNumber(currentValue)} ${getOperationSymbol(operation)} ${formatNumber(inputValue)} = ${formatNumber(result)}`;
      setHistory(prev => [calculation, ...prev.slice(0, 19)]);
      
      setPreviousValue(result);
      setDisplay(formatNumber(result));
    }

    setWaitingForOperand(true);
    setOperation(nextOperation);
  };

  const calculate = (firstValue: number, secondValue: number, operation: string) => {
    switch (operation) {
      case '+':
        return firstValue + secondValue;
      case '-':
        return firstValue - secondValue;
      case '*':
        return firstValue * secondValue;
      case '/':
        return secondValue !== 0 ? firstValue / secondValue : 0;
      case '=':
        return secondValue;
      default:
        return secondValue;
    }
  };

  const getOperationSymbol = (op: string) => {
    switch (op) {
      case '+': return '+';
      case '-': return '-';
      case '*': return '×';
      case '/': return '÷';
      default: return op;
    }
  };

  const formatNumber = (num: number) => {
    if (num === Math.floor(num)) {
      return num.toString();
    }
    return parseFloat(num.toFixed(10)).toString();
  };

  // Number conversion functions
  const getCurrentNumber = () => parseFloat(display) || 0;
  
  const convertToBase = (num: number, base: number) => {
    if (isNaN(num) || !isFinite(num)) return '0';
    const intNum = Math.floor(Math.abs(num));
    return intNum.toString(base).toUpperCase();
  };

  const convertFromBase = (value: string, fromBase: number) => {
    try {
      const num = parseInt(value, fromBase);
      return isNaN(num) ? 0 : num;
    } catch {
      return 0;
    }
  };

  const formatBytes = (bytes: number) => {
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    if (bytes === 0) return '0 Bytes';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return parseFloat((bytes / Math.pow(1024, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
      <AppNavigation />
      
      <div className="container mx-auto px-4 py-4 sm:py-8">
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
            Calculator
          </h1>
          <p className="text-gray-300 text-sm sm:text-base">
            Powerful calculator with real-time calculations
          </p>
        </div>

        <div className="max-w-7xl mx-auto">
          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-white/10 mb-6 rounded-xl p-1">
              <TabsTrigger 
                value="basic" 
                className="text-white data-[state=active]:bg-blue-500 data-[state=active]:text-white rounded-lg py-2 px-4 transition-all"
              >
                Basic
              </TabsTrigger>
              <TabsTrigger 
                value="programmer" 
                className="text-white data-[state=active]:bg-blue-500 data-[state=active]:text-white rounded-lg py-2 px-4 transition-all"
              >
                Programmer
              </TabsTrigger>
              <TabsTrigger 
                value="converter" 
                className="text-white data-[state=active]:bg-blue-500 data-[state=active]:text-white rounded-lg py-2 px-4 transition-all"
              >
                Converter
              </TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="space-y-6">
              <div className="grid gap-6 lg:grid-cols-3">
                {/* Calculator */}
                <div className="lg:col-span-2">
                  <Card className="bg-white/10 border-white/20 backdrop-blur-sm rounded-2xl shadow-2xl">
                    <CardContent className="p-4 sm:p-6">
                      {/* Display */}
                      <div className="bg-black/30 rounded-xl p-4 sm:p-6 mb-4 sm:mb-6">
                        <div className="text-right">
                          {operation && previousValue !== null && (
                            <div className="text-gray-400 text-sm sm:text-base mb-1">
                              {formatNumber(previousValue)} {getOperationSymbol(operation)}
                            </div>
                          )}
                          <div className="text-white text-2xl sm:text-4xl font-mono font-bold min-h-[40px] sm:min-h-[60px] flex items-center justify-end break-all">
                            {display}
                          </div>
                        </div>
                      </div>
                      
                      {/* Buttons */}
                      <div className="grid grid-cols-4 gap-2 sm:gap-3">
                        <Button 
                          onClick={clear} 
                          className="h-12 sm:h-16 bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl text-sm sm:text-lg transition-all active:scale-95"
                        >
                          AC
                        </Button>
                        <Button 
                          onClick={backspace} 
                          className="h-12 sm:h-16 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl transition-all active:scale-95"
                        >
                          <Delete className="h-4 w-4 sm:h-6 sm:w-6" />
                        </Button>
                        <Button 
                          onClick={() => performOperation('/')} 
                          className="h-12 sm:h-16 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-xl text-lg sm:text-2xl transition-all active:scale-95"
                        >
                          ÷
                        </Button>
                        <Button 
                          onClick={() => performOperation('*')} 
                          className="h-12 sm:h-16 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-xl text-lg sm:text-2xl transition-all active:scale-95"
                        >
                          ×
                        </Button>
                        
                        {/* Number buttons */}
                        {[7, 8, 9].map(num => (
                          <Button 
                            key={num}
                            onClick={() => inputDigit(num.toString())} 
                            className="h-12 sm:h-16 bg-gray-600 hover:bg-gray-700 text-white font-bold rounded-xl text-lg sm:text-2xl transition-all active:scale-95"
                          >
                            {num}
                          </Button>
                        ))}
                        <Button 
                          onClick={() => performOperation('-')} 
                          className="h-12 sm:h-16 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-xl text-lg sm:text-2xl transition-all active:scale-95"
                        >
                          -
                        </Button>
                        
                        {[4, 5, 6].map(num => (
                          <Button 
                            key={num}
                            onClick={() => inputDigit(num.toString())} 
                            className="h-12 sm:h-16 bg-gray-600 hover:bg-gray-700 text-white font-bold rounded-xl text-lg sm:text-2xl transition-all active:scale-95"
                          >
                            {num}
                          </Button>
                        ))}
                        <Button 
                          onClick={() => performOperation('+')} 
                          className="h-12 sm:h-16 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-xl text-lg sm:text-2xl transition-all active:scale-95"
                        >
                          +
                        </Button>
                        
                        {[1, 2, 3].map(num => (
                          <Button 
                            key={num}
                            onClick={() => inputDigit(num.toString())} 
                            className="h-12 sm:h-16 bg-gray-600 hover:bg-gray-700 text-white font-bold rounded-xl text-lg sm:text-2xl transition-all active:scale-95"
                          >
                            {num}
                          </Button>
                        ))}
                        <Button 
                          onClick={() => performOperation('=')} 
                          className="h-12 sm:h-16 bg-green-500 hover:bg-green-600 text-white font-bold rounded-xl text-lg sm:text-2xl row-span-2 transition-all active:scale-95"
                        >
                          =
                        </Button>
                        
                        <Button 
                          onClick={() => inputDigit('0')} 
                          className="h-12 sm:h-16 bg-gray-600 hover:bg-gray-700 text-white font-bold rounded-xl text-lg sm:text-2xl col-span-2 transition-all active:scale-95"
                        >
                          0
                        </Button>
                        <Button 
                          onClick={inputDot} 
                          className="h-12 sm:h-16 bg-gray-600 hover:bg-gray-700 text-white font-bold rounded-xl text-lg sm:text-2xl transition-all active:scale-95"
                        >
                          .
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* History Panel */}
                <div className="lg:col-span-1">
                  <Card className="bg-white/10 border-white/20 backdrop-blur-sm rounded-2xl shadow-2xl h-full">
                    <CardContent className="p-4 sm:p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-white text-lg sm:text-xl font-bold flex items-center gap-2">
                          <History className="h-5 w-5" />
                          History
                        </h3>
                        {history.length > 0 && (
                          <Button 
                            onClick={() => setHistory([])} 
                            variant="ghost"
                            size="sm"
                            className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                          >
                            <RotateCcw className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                      
                      <div className="space-y-2 max-h-96 overflow-y-auto pr-2">
                        {history.length === 0 ? (
                          <div className="text-center py-8 text-gray-400">
                            <History className="h-12 w-12 mx-auto mb-4 opacity-50" />
                            <p>No calculations yet</p>
                            <p className="text-sm mt-2">Start calculating to see history</p>
                          </div>
                        ) : (
                          history.map((calc, index) => (
                            <div 
                              key={index} 
                              className="bg-black/20 rounded-lg p-3 hover:bg-black/30 transition-colors cursor-pointer"
                              onClick={() => {
                                const result = calc.split(' = ')[1];
                                if (result) {
                                  setDisplay(result);
                                  setPreviousValue(null);
                                  setOperation(null);
                                  setWaitingForOperand(false);
                                }
                              }}
                            >
                              <p className="text-white font-mono text-sm break-all">{calc}</p>
                            </div>
                          ))
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="programmer" className="space-y-6">
              <Card className="bg-white/10 border-white/20 backdrop-blur-sm rounded-2xl shadow-2xl">
                <CardContent className="p-4 sm:p-6">
                  <div className="grid gap-6 lg:grid-cols-2">
                    {/* Current Value Display */}
                    <div className="space-y-4">
                      <h3 className="text-white text-xl sm:text-2xl font-bold">Current Value</h3>
                      <div className="bg-black/30 rounded-xl p-4 sm:p-6">
                        <div className="text-white text-2xl sm:text-3xl font-mono text-center font-bold">
                          {display}
                        </div>
                      </div>
                      
                      {/* Base Conversions */}
                      <div className="space-y-3">
                        <div className="bg-black/20 rounded-lg p-3 sm:p-4">
                          <label className="text-green-400 text-sm font-medium block mb-2">Binary</label>
                          <div className="text-white font-mono text-base sm:text-lg break-all">
                            {convertToBase(getCurrentNumber(), 2)}
                          </div>
                        </div>
                        <div className="bg-black/20 rounded-lg p-3 sm:p-4">
                          <label className="text-blue-400 text-sm font-medium block mb-2">Hexadecimal</label>
                          <div className="text-white font-mono text-base sm:text-lg break-all">
                            0x{convertToBase(getCurrentNumber(), 16)}
                          </div>
                        </div>
                        <div className="bg-black/20 rounded-lg p-3 sm:p-4">
                          <label className="text-purple-400 text-sm font-medium block mb-2">Octal</label>
                          <div className="text-white font-mono text-base sm:text-lg break-all">
                            {convertToBase(getCurrentNumber(), 8)}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Input Methods */}
                    <div className="space-y-4">
                      <h3 className="text-white text-xl sm:text-2xl font-bold">Input Methods</h3>
                      
                      {/* Hex Input */}
                      <div>
                        <label className="text-gray-300 text-sm font-medium block mb-2">Hex Input</label>
                        <div className="grid grid-cols-3 gap-2 sm:gap-3">
                          {['A', 'B', 'C', 'D', 'E', 'F'].map(hex => (
                            <Button
                              key={hex}
                              onClick={() => inputDigit(hex)}
                              className="h-10 sm:h-12 bg-gray-600 hover:bg-gray-700 text-white font-bold rounded-xl transition-all active:scale-95"
                            >
                              {hex}
                            </Button>
                          ))}
                        </div>
                      </div>
                      
                      {/* Bitwise Operations */}
                      <div>
                        <label className="text-gray-300 text-sm font-medium block mb-2">Bitwise Operations</label>
                        <div className="grid grid-cols-2 gap-2 sm:gap-3">
                          <Button 
                            onClick={() => {
                              const num = getCurrentNumber();
                              setDisplay(String(num & 0xFF));
                            }}
                            className="h-10 sm:h-12 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-xl transition-all active:scale-95"
                          >
                            AND
                          </Button>
                          <Button 
                            onClick={() => {
                              const num = getCurrentNumber();
                              setDisplay(String(num | 0xFF));
                            }}
                            className="h-10 sm:h-12 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-xl transition-all active:scale-95"
                          >
                            OR
                          </Button>
                          <Button 
                            onClick={() => {
                              const num = getCurrentNumber();
                              setDisplay(String(num ^ 0xFF));
                            }}
                            className="h-10 sm:h-12 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-xl transition-all active:scale-95"
                          >
                            XOR
                          </Button>
                          <Button 
                            onClick={() => {
                              const num = getCurrentNumber();
                              setDisplay(String(~num & 0xFF));
                            }}
                            className="h-10 sm:h-12 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-xl transition-all active:scale-95"
                          >
                            NOT
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="converter" className="space-y-6">
              <div className="grid gap-6 lg:grid-cols-2">
                {/* Number Base Converter */}
                <Card className="bg-white/10 border-white/20 backdrop-blur-sm rounded-2xl shadow-2xl">
                  <CardContent className="p-4 sm:p-6">
                    <h3 className="text-white text-xl sm:text-2xl font-bold mb-4">Number Base Converter</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="text-gray-300 text-sm font-medium block mb-2">Decimal</label>
                        <Input
                          type="number"
                          value={display}
                          onChange={(e) => setDisplay(e.target.value || '0')}
                          className="bg-black/30 border-white/20 text-white font-mono text-base sm:text-lg rounded-xl h-12 sm:h-14"
                          placeholder="Enter decimal number"
                        />
                      </div>
                      <div>
                        <label className="text-green-400 text-sm font-medium block mb-2">Binary</label>
                        <div className="bg-black/30 border border-white/20 rounded-xl p-3 sm:p-4 text-white font-mono text-base sm:text-lg h-12 sm:h-14 flex items-center break-all">
                          {convertToBase(getCurrentNumber(), 2)}
                        </div>
                      </div>
                      <div>
                        <label className="text-blue-400 text-sm font-medium block mb-2">Hexadecimal</label>
                        <div className="bg-black/30 border border-white/20 rounded-xl p-3 sm:p-4 text-white font-mono text-base sm:text-lg h-12 sm:h-14 flex items-center break-all">
                          0x{convertToBase(getCurrentNumber(), 16)}
                        </div>
                      </div>
                      <div>
                        <label className="text-purple-400 text-sm font-medium block mb-2">Octal</label>
                        <div className="bg-black/30 border border-white/20 rounded-xl p-3 sm:p-4 text-white font-mono text-base sm:text-lg h-12 sm:h-14 flex items-center break-all">
                          {convertToBase(getCurrentNumber(), 8)}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                {/* Unit Converter */}
                <Card className="bg-white/10 border-white/20 backdrop-blur-sm rounded-2xl shadow-2xl">
                  <CardContent className="p-4 sm:p-6">
                    <h3 className="text-white text-xl sm:text-2xl font-bold mb-4">Unit Converter</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="text-gray-300 text-sm font-medium block mb-2">Bytes</label>
                        <Input
                          type="number"
                          value={display}
                          onChange={(e) => setDisplay(e.target.value || '0')}
                          className="bg-black/30 border-white/20 text-white font-mono text-base sm:text-lg rounded-xl h-12 sm:h-14"
                          placeholder="Enter bytes"
                        />
                      </div>
                      <div>
                        <label className="text-cyan-400 text-sm font-medium block mb-2">Kilobytes</label>
                        <div className="bg-black/30 border border-white/20 rounded-xl p-3 sm:p-4 text-white font-mono text-base sm:text-lg h-12 sm:h-14 flex items-center">
                          {(getCurrentNumber() / 1024).toFixed(2)} KB
                        </div>
                      </div>
                      <div>
                        <label className="text-yellow-400 text-sm font-medium block mb-2">Megabytes</label>
                        <div className="bg-black/30 border border-white/20 rounded-xl p-3 sm:p-4 text-white font-mono text-base sm:text-lg h-12 sm:h-14 flex items-center">
                          {(getCurrentNumber() / (1024 * 1024)).toFixed(2)} MB
                        </div>
                      </div>
                      <div>
                        <label className="text-pink-400 text-sm font-medium block mb-2">Gigabytes</label>
                        <div className="bg-black/30 border border-white/20 rounded-xl p-3 sm:p-4 text-white font-mono text-base sm:text-lg h-12 sm:h-14 flex items-center">
                          {(getCurrentNumber() / (1024 * 1024 * 1024)).toFixed(6)} GB
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}