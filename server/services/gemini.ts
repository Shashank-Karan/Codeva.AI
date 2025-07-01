import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ 
  apiKey: process.env.GEMINI_API_KEY || "AIzaSyCOHtgPm3N4ICQBZjhkfY6Wc50j-Uquc8Q"
});

export interface CodeAnalysisResult {
  explanation: string;
  flowchart: string;
  visualFlowchart: FlowchartData;
  lineByLineAnalysis: Array<{
    line: number;
    content: string;
    explanation: string;
  }>;
}

export interface FlowchartData {
  nodes: Array<{
    id: string;
    type: 'start' | 'process' | 'decision' | 'end' | 'input' | 'output';
    label: string;
    x: number;
    y: number;
  }>;
  edges: Array<{
    from: string;
    to: string;
    label?: string;
  }>;
}

export interface DebugResult {
  issues: Array<{
    type: string;
    message: string;
    line?: number;
    severity: "error" | "warning" | "info";
  }>;
  fixedCode: string;
  explanation: string;
}

export async function analyzeCode(code: string, language: string): Promise<CodeAnalysisResult> {
  try {
    const systemPrompt = `You are a code analysis expert. Analyze the provided ${language} code and provide:
1. A clear explanation of what the code does
2. A textual flowchart description (use arrows and boxes in text format)
3. A visual flowchart with nodes and edges for diagram rendering
4. Line-by-line analysis with explanations

For the visual flowchart, create nodes with these types:
- "start": Entry point (oval shape)
- "process": Processing step (rectangle)
- "decision": Conditional logic (diamond)
- "end": Exit point (oval shape)  
- "input": User input (parallelogram)
- "output": Display output (parallelogram)

Position nodes with x,y coordinates for proper layout (0-1000 range).

Respond with JSON in this format:
{
  "explanation": "Clear explanation of the code",
  "flowchart": "Textual flowchart with boxes and arrows",
  "visualFlowchart": {
    "nodes": [
      {
        "id": "node1",
        "type": "start",
        "label": "Start",
        "x": 500,
        "y": 50
      }
    ],
    "edges": [
      {
        "from": "node1", 
        "to": "node2",
        "label": "next"
      }
    ]
  },
  "lineByLineAnalysis": [
    {
      "line": 1,
      "content": "actual line content",
      "explanation": "what this line does"
    }
  ]
}`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-pro",
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: "application/json",
        responseSchema: {
          type: "object",
          properties: {
            explanation: { type: "string" },
            flowchart: { type: "string" },
            visualFlowchart: {
              type: "object",
              properties: {
                nodes: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      id: { type: "string" },
                      type: { type: "string", enum: ["start", "process", "decision", "end", "input", "output"] },
                      label: { type: "string" },
                      x: { type: "number" },
                      y: { type: "number" }
                    },
                    required: ["id", "type", "label", "x", "y"]
                  }
                },
                edges: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      from: { type: "string" },
                      to: { type: "string" },
                      label: { type: "string" }
                    },
                    required: ["from", "to"]
                  }
                }
              },
              required: ["nodes", "edges"]
            },
            lineByLineAnalysis: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  line: { type: "number" },
                  content: { type: "string" },
                  explanation: { type: "string" },
                },
                required: ["line", "content", "explanation"],
              },
            },
          },
          required: ["explanation", "flowchart", "visualFlowchart", "lineByLineAnalysis"],
        },
      },
      contents: `Analyze this ${language} code:\n\n${code}`,
    });

    const rawJson = response.text;
    if (rawJson) {
      const data: CodeAnalysisResult = JSON.parse(rawJson);
      return data;
    } else {
      throw new Error("Empty response from model");
    }
  } catch (error) {
    throw new Error(`Failed to analyze code: ${error}`);
  }
}

export async function debugCode(code: string, language: string): Promise<DebugResult> {
  try {
    const systemPrompt = `You are a code debugging expert. Analyze the provided ${language} code and:
1. Identify any issues, errors, or potential problems
2. Provide a fixed version of the code
3. Explain the issues and fixes in detail

Respond with JSON in this format:
{
  "issues": [
    {
      "type": "error/warning/info",
      "message": "description of the issue",
      "line": 5,
      "severity": "error"
    }
  ],
  "fixedCode": "corrected version of the code",
  "explanation": "detailed explanation of issues and fixes"
}`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-pro",
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: "application/json",
        responseSchema: {
          type: "object",
          properties: {
            issues: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  type: { type: "string" },
                  message: { type: "string" },
                  line: { type: "number" },
                  severity: { type: "string", enum: ["error", "warning", "info"] },
                },
                required: ["type", "message", "severity"],
              },
            },
            fixedCode: { type: "string" },
            explanation: { type: "string" },
          },
          required: ["issues", "fixedCode", "explanation"],
        },
      },
      contents: `Debug this ${language} code:\n\n${code}`,
    });

    const rawJson = response.text;
    if (rawJson) {
      const data: DebugResult = JSON.parse(rawJson);
      return data;
    } else {
      throw new Error("Empty response from model");
    }
  } catch (error) {
    throw new Error(`Failed to debug code: ${error}`);
  }
}
