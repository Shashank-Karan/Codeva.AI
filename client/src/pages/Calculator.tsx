import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calculator as CalcIcon, Binary, Hash, Code2, Delete } from "lucide-react";
import AppNavigation from "@/components/AppNavigation";

export default function Calculator() {
  const [display, setDisplay] = useState('0');
  const [previousValue, setPreviousValue] = useState<number | null>(null);
  const [operation, setOperation] = useState<string | null>(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);
  const [history, setHistory] = useState<string[]>([]);

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

  const clearEntry = () => {
    setDisplay('0');
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
      
      const calculation = `${currentValue} ${operation} ${inputValue} = ${result}`;
      setHistory(prev => [calculation, ...prev.slice(0, 9)]);
      
      setPreviousValue(result);
      setDisplay(String(result));
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

  const convertNumber = (num: number, base: number) => {
    if (isNaN(num) || !isFinite(num)) return '0';
    const intNum = Math.floor(Math.abs(num));
    return intNum.toString(base).toUpperCase();
  };

  const convertFromBase = (value: string, fromBase: number) => {
    const num = parseInt(value, fromBase);
    return isNaN(num) ? 0 : num;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
      <AppNavigation />
      
      <div className="max-w-7xl mx-auto px-4 py-4 sm:py-8">
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Developer Calculator
          </h1>
          <p className="text-gray-300 text-base sm:text-lg">
            Mathematical and programming calculations
          </p>
        </div>

        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-slate-800/40 mb-6">
            <TabsTrigger value="basic" className="text-white data-[state=active]:bg-blue-600">Basic</TabsTrigger>
            <TabsTrigger value="programmer" className="text-white data-[state=active]:bg-blue-600">Programmer</TabsTrigger>
            <TabsTrigger value="converter" className="text-white data-[state=active]:bg-blue-600">Converter</TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="space-y-4">
            <div className="grid gap-6 lg:grid-cols-2">
              <Card className="bg-slate-800/40 border-slate-700/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white text-xl flex items-center gap-2">
                    <CalcIcon className="h-5 w-5" />
                    Basic Calculator
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-600">
                      <div className="text-right text-3xl font-mono text-white mb-2 min-h-[40px] flex items-center justify-end">
                        {display}
                      </div>
                      {operation && previousValue !== null && (
                        <div className="text-right text-sm text-gray-400">
                          {previousValue} {operation}
                        </div>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-4 gap-3">
                      <Button onClick={clear} variant="outline" className="h-12 border-red-600 text-red-400 hover:bg-red-600/20">
                        AC
                      </Button>
                      <Button onClick={clearEntry} variant="outline" className="h-12 border-orange-600 text-orange-400 hover:bg-orange-600/20">
                        CE
                      </Button>
                      <Button onClick={backspace} variant="outline" className="h-12 border-slate-600 text-gray-300 hover:bg-slate-600/20">
                        <Delete className="h-4 w-4" />
                      </Button>
                      <Button onClick={() => performOperation('/')} variant="outline" className="h-12 border-blue-600 text-blue-400 hover:bg-blue-600/20">
                        ÷
                      </Button>
                      
                      <Button onClick={() => inputDigit('7')} className="h-12 bg-slate-700 hover:bg-slate-600 text-white font-semibold">
                        7
                      </Button>
                      <Button onClick={() => inputDigit('8')} className="h-12 bg-slate-700 hover:bg-slate-600 text-white font-semibold">
                        8
                      </Button>
                      <Button onClick={() => inputDigit('9')} className="h-12 bg-slate-700 hover:bg-slate-600 text-white font-semibold">
                        9
                      </Button>
                      <Button onClick={() => performOperation('*')} variant="outline" className="h-12 border-blue-600 text-blue-400 hover:bg-blue-600/20">
                        ×
                      </Button>
                      
                      <Button onClick={() => inputDigit('4')} className="h-12 bg-slate-700 hover:bg-slate-600 text-white font-semibold">
                        4
                      </Button>
                      <Button onClick={() => inputDigit('5')} className="h-12 bg-slate-700 hover:bg-slate-600 text-white font-semibold">
                        5
                      </Button>
                      <Button onClick={() => inputDigit('6')} className="h-12 bg-slate-700 hover:bg-slate-600 text-white font-semibold">
                        6
                      </Button>
                      <Button onClick={() => performOperation('-')} variant="outline" className="h-12 border-blue-600 text-blue-400 hover:bg-blue-600/20">
                        -
                      </Button>
                      
                      <Button onClick={() => inputDigit('1')} className="h-12 bg-slate-700 hover:bg-slate-600 text-white font-semibold">
                        1
                      </Button>
                      <Button onClick={() => inputDigit('2')} className="h-12 bg-slate-700 hover:bg-slate-600 text-white font-semibold">
                        2
                      </Button>
                      <Button onClick={() => inputDigit('3')} className="h-12 bg-slate-700 hover:bg-slate-600 text-white font-semibold">
                        3
                      </Button>
                      <Button onClick={() => performOperation('+')} variant="outline" className="h-12 border-blue-600 text-blue-400 hover:bg-blue-600/20">
                        +
                      </Button>
                      
                      <Button onClick={() => inputDigit('0')} className="h-12 bg-slate-700 hover:bg-slate-600 text-white font-semibold col-span-2">
                        0
                      </Button>
                      <Button onClick={inputDot} className="h-12 bg-slate-700 hover:bg-slate-600 text-white font-semibold">
                        .
                      </Button>
                      <Button onClick={() => performOperation('=')} className="h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold">
                        =
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* History Panel */}
              <Card className="bg-slate-800/40 border-slate-700/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white text-lg">Calculation History</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="max-h-96 overflow-y-auto space-y-2">
                    {history.length === 0 ? (
                      <p className="text-gray-400 text-center py-8">No calculations yet</p>
                    ) : (
                      history.map((calc, index) => (
                        <div key={index} className="p-3 bg-slate-900/50 rounded-lg border border-slate-600/50">
                          <p className="text-white font-mono text-sm">{calc}</p>
                        </div>
                      ))
                    )}
                  </div>
                  {history.length > 0 && (
                    <Button 
                      onClick={() => setHistory([])} 
                      variant="outline" 
                      className="w-full mt-4 border-slate-600 text-gray-300 hover:bg-slate-600/20"
                    >
                      Clear History
                    </Button>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="programmer" className="space-y-4">
            <Card className="bg-slate-800/40 border-slate-700/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white text-xl flex items-center gap-2">
                  <Binary className="h-5 w-5" />
                  Programmer Calculator
                </CardTitle>
                <CardDescription className="text-gray-300">
                  Binary, hexadecimal, and bitwise operations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm text-gray-300 mb-2 block">Current Value</label>
                      <Input
                        value={display}
                        readOnly
                        className="bg-slate-900/50 border-slate-600 text-white font-mono text-lg"
                      />
                    </div>
                    <div className="space-y-3">
                      <div>
                        <label className="text-sm text-gray-300 mb-2 block">Binary</label>
                        <Input
                          value={convertNumber(parseFloat(display) || 0, 2)}
                          readOnly
                          className="bg-slate-900/50 border-slate-600 text-green-400 font-mono"
                        />
                      </div>
                      <div>
                        <label className="text-sm text-gray-300 mb-2 block">Hexadecimal</label>
                        <Input
                          value={convertNumber(parseFloat(display) || 0, 16)}
                          readOnly
                          className="bg-slate-900/50 border-slate-600 text-blue-400 font-mono"
                        />
                      </div>
                      <div>
                        <label className="text-sm text-gray-300 mb-2 block">Octal</label>
                        <Input
                          value={convertNumber(parseFloat(display) || 0, 8)}
                          readOnly
                          className="bg-slate-900/50 border-slate-600 text-purple-400 font-mono"
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm text-gray-300 mb-2 block">Bitwise Operations</label>
                      <div className="grid grid-cols-2 gap-2">
                        <Button variant="outline" className="border-slate-600 text-gray-300 hover:bg-slate-600/20">
                          AND
                        </Button>
                        <Button variant="outline" className="border-slate-600 text-gray-300 hover:bg-slate-600/20">
                          OR
                        </Button>
                        <Button variant="outline" className="border-slate-600 text-gray-300 hover:bg-slate-600/20">
                          XOR
                        </Button>
                        <Button variant="outline" className="border-slate-600 text-gray-300 hover:bg-slate-600/20">
                          NOT
                        </Button>
                        <Button variant="outline" className="border-slate-600 text-gray-300 hover:bg-slate-600/20">
                          LSH
                        </Button>
                        <Button variant="outline" className="border-slate-600 text-gray-300 hover:bg-slate-600/20">
                          RSH
                        </Button>
                      </div>
                    </div>
                    
                    <div>
                      <label className="text-sm text-gray-300 mb-2 block">Hex Input</label>
                      <div className="grid grid-cols-4 gap-2">
                        {['A', 'B', 'C', 'D', 'E', 'F'].map(hex => (
                          <Button
                            key={hex}
                            onClick={() => inputDigit(hex)}
                            className="h-10 bg-slate-700 hover:bg-slate-600 text-white font-semibold"
                          >
                            {hex}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="converter" className="space-y-4">
            <div className="grid gap-6 md:grid-cols-2">
              <Card className="bg-slate-800/40 border-slate-700/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white text-lg flex items-center gap-2">
                    <Hash className="h-5 w-5" />
                    Number Base Converter
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm text-gray-300 mb-2 block">Decimal</label>
                      <Input
                        value={display}
                        onChange={(e) => setDisplay(e.target.value)}
                        className="bg-slate-900/50 border-slate-600 text-white font-mono"
                      />
                    </div>
                    <div>
                      <label className="text-sm text-gray-300 mb-2 block">Binary</label>
                      <Input
                        value={convertNumber(parseFloat(display) || 0, 2)}
                        readOnly
                        className="bg-slate-900/50 border-slate-600 text-green-400 font-mono"
                      />
                    </div>
                    <div>
                      <label className="text-sm text-gray-300 mb-2 block">Hexadecimal</label>
                      <Input
                        value={convertNumber(parseFloat(display) || 0, 16)}
                        readOnly
                        className="bg-slate-900/50 border-slate-600 text-blue-400 font-mono"
                      />
                    </div>
                    <div>
                      <label className="text-sm text-gray-300 mb-2 block">Octal</label>
                      <Input
                        value={convertNumber(parseFloat(display) || 0, 8)}
                        readOnly
                        className="bg-slate-900/50 border-slate-600 text-purple-400 font-mono"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-slate-800/40 border-slate-700/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white text-lg flex items-center gap-2">
                    <Code2 className="h-5 w-5" />
                    Developer Units
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm text-gray-300 mb-2 block">Bytes</label>
                      <Input
                        value={display}
                        onChange={(e) => setDisplay(e.target.value)}
                        className="bg-slate-900/50 border-slate-600 text-white font-mono"
                      />
                    </div>
                    <div>
                      <label className="text-sm text-gray-300 mb-2 block">Kilobytes</label>
                      <Input
                        value={((parseFloat(display) || 0) / 1024).toFixed(2)}
                        readOnly
                        className="bg-slate-900/50 border-slate-600 text-cyan-400 font-mono"
                      />
                    </div>
                    <div>
                      <label className="text-sm text-gray-300 mb-2 block">Megabytes</label>
                      <Input
                        value={((parseFloat(display) || 0) / (1024 * 1024)).toFixed(2)}
                        readOnly
                        className="bg-slate-900/50 border-slate-600 text-yellow-400 font-mono"
                      />
                    </div>
                    <div>
                      <label className="text-sm text-gray-300 mb-2 block">Gigabytes</label>
                      <Input
                        value={((parseFloat(display) || 0) / (1024 * 1024 * 1024)).toFixed(2)}
                        readOnly
                        className="bg-slate-900/50 border-slate-600 text-pink-400 font-mono"
                      />
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