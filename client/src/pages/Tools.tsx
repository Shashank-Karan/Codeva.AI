import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Zap, Code, FileText, Link, Hash, Palette, Database, Terminal } from "lucide-react";
import AppNavigation from "@/components/AppNavigation";

export default function Tools() {
  const tools = [
    {
      name: "JSON Formatter",
      description: "Format and validate JSON data",
      icon: FileText,
      comingSoon: true
    },
    {
      name: "URL Encoder/Decoder",
      description: "Encode and decode URLs",
      icon: Link,
      comingSoon: true
    },
    {
      name: "Hash Generator",
      description: "Generate MD5, SHA1, SHA256 hashes",
      icon: Hash,
      comingSoon: true
    },
    {
      name: "Color Picker",
      description: "Pick colors and get hex/rgb values",
      icon: Palette,
      comingSoon: true
    },
    {
      name: "SQL Formatter",
      description: "Format and beautify SQL queries",
      icon: Database,
      comingSoon: true
    },
    {
      name: "Code Formatter",
      description: "Format code in various languages",
      icon: Code,
      comingSoon: true
    },
    {
      name: "Terminal Emulator",
      description: "Basic terminal commands",
      icon: Terminal,
      comingSoon: true
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
      <AppNavigation />
      
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">
            Developer Tools
          </h1>
          <p className="text-gray-300 text-lg">
            Essential utilities for developers
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {tools.map((tool, index) => {
            const Icon = tool.icon;
            return (
              <Card key={index} className="bg-slate-800/40 border-slate-700/50 backdrop-blur-sm hover:bg-slate-800/60 transition-all duration-300 group">
                <CardHeader>
                  <CardTitle className="text-white text-lg flex items-center gap-3">
                    <div className="p-2 bg-blue-600/20 rounded-lg group-hover:bg-blue-600/30 transition-colors">
                      <Icon className="h-5 w-5 text-blue-400" />
                    </div>
                    {tool.name}
                  </CardTitle>
                  <CardDescription className="text-gray-300">
                    {tool.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button 
                    disabled={tool.comingSoon}
                    className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
                  >
                    {tool.comingSoon ? 'Coming Soon' : 'Open Tool'}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="mt-12 text-center">
          <Card className="bg-slate-800/40 border-slate-700/50 backdrop-blur-sm max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="text-white text-xl flex items-center justify-center gap-2">
                <Zap className="h-6 w-6" />
                Request a Tool
              </CardTitle>
              <CardDescription className="text-gray-300">
                Need a specific developer tool? Let us know and we'll add it to the collection!
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="bg-purple-600 hover:bg-purple-700 text-white">
                Suggest a Tool
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}