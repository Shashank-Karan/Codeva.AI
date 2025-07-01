import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ 
  apiKey: process.env.GEMINI_API_KEY || "AIzaSyCOHtgPm3N4ICQBZjhkfY6Wc50j-Uquc8Q"
});

export interface CodeAnalysisResult {
  explanation: string;
  flowchart: string;
  lineByLineAnalysis: Array<{
    line: number;
    content: string;
    explanation: string;
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
3. Line-by-line analysis with explanations

Respond with JSON in this format:
{
  "explanation": "Clear explanation of the code",
  "flowchart": "Textual flowchart with boxes and arrows",
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
          required: ["explanation", "flowchart", "lineByLineAnalysis"],
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
