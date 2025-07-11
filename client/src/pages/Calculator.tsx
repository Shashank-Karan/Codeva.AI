import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calculator as CalcIcon, Delete } from "lucide-react";
import AppNavigation from "@/components/AppNavigation";

export default function Calculator() {
  const [display, setDisplay] = useState('0');
  const [previousValue, setPreviousValue] = useState<number | null>(null);
  const [operation, setOperation] = useState<string | null>(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);
  const [history, setHistory] = useState<string[]>([]);

  // Basic Calculator Functions
  const inputDigit = (digit: string) => {
    if (waitingForOperand) {
      setDisplay(String(digit));
      setWaitingForOperand(false);
    } else {
      setDisplay(display === '0' ? String(digit) : display + digit);
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
      
      const calculation = `${currentValue} ${getOperationSymbol(operation)} ${inputValue} = ${result}`;
      setHistory(prev => [calculation, ...prev.slice(0, 9)]);
      
      setPreviousValue(result);
      setDisplay(String(result));
    }

    setWaitingForOperand(true);
    setOperation(nextOperation);
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

  // Number base conversion functions
  const convertToBase = (num: number, base: number) => {
    if (isNaN(num) || !isFinite(num)) return '0';
    const intNum = Math.floor(Math.abs(num));
    return intNum.toString(base).toUpperCase();
  };

  const getCurrentNumber = () => {
    return parseFloat(display) || 0;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
      <AppNavigation />
      
      <div className="container mx-auto px-4 py-6">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            Calculator
          </h1>
          <p className="text-gray-300">
            Simple and powerful calculator for all your needs
          </p>
        </div>

        <Tabs defaultValue="basic" className="w-full max-w-6xl mx-auto">
          <TabsList className="grid w-full grid-cols-3 bg-white/10 mb-8 rounded-xl">
            <TabsTrigger 
              value="basic" 
              className="text-white data-[state=active]:bg-blue-500 data-[state=active]:text-white rounded-lg"
            >
              Basic
            </TabsTrigger>
            <TabsTrigger 
              value="programmer" 
              className="text-white data-[state=active]:bg-blue-500 data-[state=active]:text-white rounded-lg"
            >
              Programmer
            </TabsTrigger>
            <TabsTrigger 
              value="converter" 
              className="text-white data-[state=active]:bg-blue-500 data-[state=active]:text-white rounded-lg"
            >
              Converter
            </TabsTrigger>
          </TabsList>

          <TabsContent value="basic">
            <div className="max-w-md mx-auto">
              <Card className="bg-white/10 border-white/20 backdrop-blur-sm rounded-2xl shadow-2xl">
                <CardContent className="p-6">
                  {/* Display */}
                  <div className="bg-black/30 rounded-xl p-4 mb-6">
                    <div className="text-right">
                      {operation && previousValue !== null && (
                        <div className="text-gray-400 text-sm mb-1">
                          {previousValue} {getOperationSymbol(operation)}
                        </div>
                      )}
                      <div className="text-white text-3xl font-mono font-bold min-h-[40px] flex items-center justify-end">
                        {display}
                      </div>
                    </div>
                  </div>
                  
                  {/* Button Grid */}
                  <div className="grid grid-cols-4 gap-3">
                    <Button 
                      onClick={clear} 
                      className="h-14 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-xl text-lg"
                    >
                      AC
                    </Button>
                    <Button 
                      onClick={backspace} 
                      className="h-14 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-xl text-lg"
                    >
                      <Delete className="h-5 w-5" />
                    </Button>
                    <Button 
                      onClick={() => performOperation('/')} 
                      className="h-14 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-xl text-xl"
                    >
                      ÷
                    </Button>
                    <Button 
                      onClick={() => performOperation('*')} 
                      className="h-14 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-xl text-xl"
                    >
                      ×
                    </Button>
                    
                    <Button 
                      onClick={() => inputDigit('7')} 
                      className="h-14 bg-gray-600 hover:bg-gray-700 text-white font-semibold rounded-xl text-xl"
                    >
                      7
                    </Button>
                    <Button 
                      onClick={() => inputDigit('8')} 
                      className="h-14 bg-gray-600 hover:bg-gray-700 text-white font-semibold rounded-xl text-xl"
                    >
                      8
                    </Button>
                    <Button 
                      onClick={() => inputDigit('9')} 
                      className="h-14 bg-gray-600 hover:bg-gray-700 text-white font-semibold rounded-xl text-xl"
                    >
                      9
                    </Button>
                    <Button 
                      onClick={() => performOperation('-')} 
                      className="h-14 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-xl text-xl"
                    >
                      -
                    </Button>
                    
                    <Button 
                      onClick={() => inputDigit('4')} 
                      className="h-14 bg-gray-600 hover:bg-gray-700 text-white font-semibold rounded-xl text-xl"
                    >
                      4
                    </Button>
                    <Button 
                      onClick={() => inputDigit('5')} 
                      className="h-14 bg-gray-600 hover:bg-gray-700 text-white font-semibold rounded-xl text-xl"
                    >
                      5
                    </Button>
                    <Button 
                      onClick={() => inputDigit('6')} 
                      className="h-14 bg-gray-600 hover:bg-gray-700 text-white font-semibold rounded-xl text-xl"
                    >
                      6
                    </Button>
                    <Button 
                      onClick={() => performOperation('+')} 
                      className="h-14 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-xl text-xl"
                    >
                      +
                    </Button>
                    
                    <Button 
                      onClick={() => inputDigit('1')} 
                      className="h-14 bg-gray-600 hover:bg-gray-700 text-white font-semibold rounded-xl text-xl"
                    >
                      1
                    </Button>
                    <Button 
                      onClick={() => inputDigit('2')} 
                      className="h-14 bg-gray-600 hover:bg-gray-700 text-white font-semibold rounded-xl text-xl"
                    >
                      2
                    </Button>
                    <Button 
                      onClick={() => inputDigit('3')} 
                      className="h-14 bg-gray-600 hover:bg-gray-700 text-white font-semibold rounded-xl text-xl"
                    >
                      3
                    </Button>
                    <Button 
                      onClick={() => performOperation('=')} 
                      className="h-14 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-xl text-xl row-span-2"
                    >
                      =
                    </Button>
                    
                    <Button 
                      onClick={() => inputDigit('0')} 
                      className="h-14 bg-gray-600 hover:bg-gray-700 text-white font-semibold rounded-xl text-xl col-span-2"
                    >
                      0
                    </Button>
                    <Button 
                      onClick={inputDot} 
                      className="h-14 bg-gray-600 hover:bg-gray-700 text-white font-semibold rounded-xl text-xl"
                    >
                      .
                    </Button>
                  </div>

                  {/* History */}
                  {history.length > 0 && (
                    <div className="mt-6 bg-black/20 rounded-xl p-4">
                      <h3 className="text-white font-semibold mb-3">History</h3>
                      <div className="space-y-2 max-h-32 overflow-y-auto">
                        {history.slice(0, 5).map((calc, index) => (
                          <div key={index} className="text-gray-300 font-mono text-sm">
                            {calc}
                          </div>
                        ))}
                      </div>
                      <Button 
                        onClick={() => setHistory([])} 
                        className="mt-3 bg-red-500/20 hover:bg-red-500/30 text-red-300 border-red-500/50"
                        variant="outline"
                        size="sm"
                      >
                        Clear History
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="programmer">
            <Card className="bg-white/10 border-white/20 backdrop-blur-sm rounded-2xl shadow-2xl">
              <CardContent className="p-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-4">
                    <h3 className="text-white text-xl font-semibold">Current Value</h3>
                    <div className="bg-black/30 rounded-xl p-4">
                      <div className="text-white text-2xl font-mono text-center">
                        {display}
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="bg-black/20 rounded-lg p-3">
                        <label className="text-green-400 text-sm font-medium block mb-1">Binary</label>
                        <div className="text-white font-mono text-lg">
                          {convertToBase(getCurrentNumber(), 2)}
                        </div>
                      </div>
                      <div className="bg-black/20 rounded-lg p-3">
                        <label className="text-blue-400 text-sm font-medium block mb-1">Hexadecimal</label>
                        <div className="text-white font-mono text-lg">
                          {convertToBase(getCurrentNumber(), 16)}
                        </div>
                      </div>
                      <div className="bg-black/20 rounded-lg p-3">
                        <label className="text-purple-400 text-sm font-medium block mb-1">Octal</label>
                        <div className="text-white font-mono text-lg">
                          {convertToBase(getCurrentNumber(), 8)}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="text-white text-xl font-semibold">Hex Input</h3>
                    <div className="grid grid-cols-3 gap-3">
                      {['A', 'B', 'C', 'D', 'E', 'F'].map(hex => (
                        <Button
                          key={hex}
                          onClick={() => inputDigit(hex)}
                          className="h-12 bg-gray-600 hover:bg-gray-700 text-white font-semibold rounded-xl"
                        >
                          {hex}
                        </Button>
                      ))}
                    </div>
                    
                    <h3 className="text-white text-xl font-semibold mt-6">Operations</h3>
                    <div className="grid grid-cols-2 gap-3">
                      <Button 
                        onClick={() => {
                          const num = getCurrentNumber();
                          setDisplay(String(num & 0xFFFF));
                        }}
                        className="h-12 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-xl"
                      >
                        AND
                      </Button>
                      <Button 
                        onClick={() => {
                          const num = getCurrentNumber();
                          setDisplay(String(num | 0xFFFF));
                        }}
                        className="h-12 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-xl"
                      >
                        OR
                      </Button>
                      <Button 
                        onClick={() => {
                          const num = getCurrentNumber();
                          setDisplay(String(num ^ 0xFFFF));
                        }}
                        className="h-12 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-xl"
                      >
                        XOR
                      </Button>
                      <Button 
                        onClick={() => {
                          const num = getCurrentNumber();
                          setDisplay(String(~num & 0xFFFF));
                        }}
                        className="h-12 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-xl"
                      >
                        NOT
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="converter">
            <div className="grid gap-6 md:grid-cols-2">
              <Card className="bg-white/10 border-white/20 backdrop-blur-sm rounded-2xl shadow-2xl">
                <CardContent className="p-6">
                  <h3 className="text-white text-xl font-semibold mb-4">Number Base Converter</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="text-gray-300 text-sm font-medium block mb-2">Decimal</label>
                      <Input
                        type="number"
                        value={display}
                        onChange={(e) => setDisplay(e.target.value || '0')}
                        className="bg-black/30 border-white/20 text-white font-mono text-lg rounded-xl h-12"
                        placeholder="Enter decimal number"
                      />
                    </div>
                    <div>
                      <label className="text-green-400 text-sm font-medium block mb-2">Binary</label>
                      <div className="bg-black/30 border border-white/20 rounded-xl p-3 text-white font-mono h-12 flex items-center">
                        {convertToBase(getCurrentNumber(), 2)}
                      </div>
                    </div>
                    <div>
                      <label className="text-blue-400 text-sm font-medium block mb-2">Hexadecimal</label>
                      <div className="bg-black/30 border border-white/20 rounded-xl p-3 text-white font-mono h-12 flex items-center">
                        {convertToBase(getCurrentNumber(), 16)}
                      </div>
                    </div>
                    <div>
                      <label className="text-purple-400 text-sm font-medium block mb-2">Octal</label>
                      <div className="bg-black/30 border border-white/20 rounded-xl p-3 text-white font-mono h-12 flex items-center">
                        {convertToBase(getCurrentNumber(), 8)}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-white/10 border-white/20 backdrop-blur-sm rounded-2xl shadow-2xl">
                <CardContent className="p-6">
                  <h3 className="text-white text-xl font-semibold mb-4">Unit Converter</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="text-gray-300 text-sm font-medium block mb-2">Bytes</label>
                      <Input
                        type="number"
                        value={display}
                        onChange={(e) => setDisplay(e.target.value || '0')}
                        className="bg-black/30 border-white/20 text-white font-mono text-lg rounded-xl h-12"
                        placeholder="Enter bytes"
                      />
                    </div>
                    <div>
                      <label className="text-cyan-400 text-sm font-medium block mb-2">Kilobytes</label>
                      <div className="bg-black/30 border border-white/20 rounded-xl p-3 text-white font-mono h-12 flex items-center">
                        {(getCurrentNumber() / 1024).toFixed(2)} KB
                      </div>
                    </div>
                    <div>
                      <label className="text-yellow-400 text-sm font-medium block mb-2">Megabytes</label>
                      <div className="bg-black/30 border border-white/20 rounded-xl p-3 text-white font-mono h-12 flex items-center">
                        {(getCurrentNumber() / (1024 * 1024)).toFixed(2)} MB
                      </div>
                    </div>
                    <div>
                      <label className="text-pink-400 text-sm font-medium block mb-2">Gigabytes</label>
                      <div className="bg-black/30 border border-white/20 rounded-xl p-3 text-white font-mono h-12 flex items-center">
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
  );
}