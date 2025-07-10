import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calculator as CalcIcon, Binary, Hash, Code2 } from "lucide-react";
import AppNavigation from "@/components/AppNavigation";

export default function Calculator() {
  const [display, setDisplay] = useState('0');
  const [operation, setOperation] = useState<string | null>(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);
  const [value, setValue] = useState<number | null>(null);

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
    setOperation(null);
    setWaitingForOperand(false);
    setValue(null);
  };

  const performOperation = (nextOperation: string) => {
    const inputValue = parseFloat(display);

    if (value === null) {
      setValue(inputValue);
    } else if (operation) {
      const currentValue = value || 0;
      const result = calculate(currentValue, inputValue, operation);

      setValue(result);
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
        return firstValue / secondValue;
      case '=':
        return secondValue;
      default:
        return secondValue;
    }
  };

  const convertToBinary = (num: number) => {
    return num.toString(2);
  };

  const convertToHex = (num: number) => {
    return num.toString(16).toUpperCase();
  };

  const convertToOctal = (num: number) => {
    return num.toString(8);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
      <AppNavigation />
      
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">
            Developer Calculator
          </h1>
          <p className="text-gray-300 text-lg">
            Mathematical and programming calculations
          </p>
        </div>

        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-slate-800/40">
            <TabsTrigger value="basic" className="text-white">Basic</TabsTrigger>
            <TabsTrigger value="programmer" className="text-white">Programmer</TabsTrigger>
            <TabsTrigger value="converter" className="text-white">Converter</TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="space-y-4">
            <Card className="bg-slate-800/40 border-slate-700/50 backdrop-blur-sm max-w-md mx-auto">
              <CardHeader>
                <CardTitle className="text-white text-xl flex items-center gap-2">
                  <CalcIcon className="h-5 w-5" />
                  Basic Calculator
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Input
                    value={display}
                    readOnly
                    className="text-right text-2xl font-mono bg-slate-900/50 border-slate-600 text-white"
                  />
                  
                  <div className="grid grid-cols-4 gap-2">
                    <Button onClick={clear} variant="outline" className="border-slate-600 text-gray-300">
                      AC
                    </Button>
                    <Button onClick={() => performOperation('/')} variant="outline" className="border-slate-600 text-gray-300">
                      ÷
                    </Button>
                    <Button onClick={() => performOperation('*')} variant="outline" className="border-slate-600 text-gray-300">
                      ×
                    </Button>
                    <Button onClick={() => performOperation('-')} variant="outline" className="border-slate-600 text-gray-300">
                      -
                    </Button>
                    
                    <Button onClick={() => inputDigit('7')} className="bg-slate-700 hover:bg-slate-600 text-white">
                      7
                    </Button>
                    <Button onClick={() => inputDigit('8')} className="bg-slate-700 hover:bg-slate-600 text-white">
                      8
                    </Button>
                    <Button onClick={() => inputDigit('9')} className="bg-slate-700 hover:bg-slate-600 text-white">
                      9
                    </Button>
                    <Button onClick={() => performOperation('+')} variant="outline" className="border-slate-600 text-gray-300 row-span-2">
                      +
                    </Button>
                    
                    <Button onClick={() => inputDigit('4')} className="bg-slate-700 hover:bg-slate-600 text-white">
                      4
                    </Button>
                    <Button onClick={() => inputDigit('5')} className="bg-slate-700 hover:bg-slate-600 text-white">
                      5
                    </Button>
                    <Button onClick={() => inputDigit('6')} className="bg-slate-700 hover:bg-slate-600 text-white">
                      6
                    </Button>
                    
                    <Button onClick={() => inputDigit('1')} className="bg-slate-700 hover:bg-slate-600 text-white">
                      1
                    </Button>
                    <Button onClick={() => inputDigit('2')} className="bg-slate-700 hover:bg-slate-600 text-white">
                      2
                    </Button>
                    <Button onClick={() => inputDigit('3')} className="bg-slate-700 hover:bg-slate-600 text-white">
                      3
                    </Button>
                    <Button onClick={() => performOperation('=')} className="bg-blue-600 hover:bg-blue-700 text-white row-span-2">
                      =
                    </Button>
                    
                    <Button onClick={() => inputDigit('0')} className="bg-slate-700 hover:bg-slate-600 text-white col-span-2">
                      0
                    </Button>
                    <Button onClick={inputDot} className="bg-slate-700 hover:bg-slate-600 text-white">
                      .
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
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
                <div className="text-center text-gray-300">
                  <p>Programming calculator features coming soon...</p>
                  <p className="text-sm mt-2">Will include bitwise operations, binary/hex conversions, and more.</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="converter" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
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
                        readOnly
                        className="bg-slate-900/50 border-slate-600 text-white"
                      />
                    </div>
                    <div>
                      <label className="text-sm text-gray-300 mb-2 block">Binary</label>
                      <Input
                        value={convertToBinary(parseFloat(display) || 0)}
                        readOnly
                        className="bg-slate-900/50 border-slate-600 text-white font-mono"
                      />
                    </div>
                    <div>
                      <label className="text-sm text-gray-300 mb-2 block">Hexadecimal</label>
                      <Input
                        value={convertToHex(parseFloat(display) || 0)}
                        readOnly
                        className="bg-slate-900/50 border-slate-600 text-white font-mono"
                      />
                    </div>
                    <div>
                      <label className="text-sm text-gray-300 mb-2 block">Octal</label>
                      <Input
                        value={convertToOctal(parseFloat(display) || 0)}
                        readOnly
                        className="bg-slate-900/50 border-slate-600 text-white font-mono"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-slate-800/40 border-slate-700/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white text-lg flex items-center gap-2">
                    <Code2 className="h-5 w-5" />
                    Unit Converter
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center text-gray-300">
                    <p>Unit conversion features coming soon...</p>
                    <p className="text-sm mt-2">Will include bytes, time, and other developer-relevant units.</p>
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