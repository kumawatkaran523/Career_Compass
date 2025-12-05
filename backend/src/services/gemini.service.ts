import { GoogleGenerativeAI } from "@google/generative-ai";
import { Roadmap, DURATION_TO_WEEKS } from "../types/roadmap.types";

class GeminiService {
  private genAI: GoogleGenerativeAI;

  constructor() {
    const apiKey = process.env.GEMINI_API_KEY;
    
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is not defined in environment variables");
    }
    
    console.log("Gemini API initialized");
    this.genAI = new GoogleGenerativeAI(apiKey);
  }

  private buildPrompt(
    technology: string,
    duration: string,
    difficulty: string,
    totalWeeks: number,
    estimatedHours: number
  ): string {
    return `You are an expert curriculum designer. Create a ${duration} learning roadmap for ${technology} at ${difficulty} level.

CRITICAL: You must return ONLY valid JSON with NO additional text, NO markdown formatting, NO explanations.

Required JSON structure:
{
  "technology": "${technology}",
  "duration": "${duration}",
  "difficulty": "${difficulty}",
  "totalWeeks": ${totalWeeks},
  "estimatedHours": ${estimatedHours},
  "weeks": [
    {
      "weekNumber": 1,
      "title": "Week 1 Title",
      "description": "What learner will master this week",
      "estimatedHours": 20,
      "topics": [
        {
          "id": "w1-t1",
          "title": "Topic 1",
          "duration": "3 hours",
          "type": "video",
          "resources": ["Resource A", "Resource B"]
        },
        {
          "id": "w1-t2",
          "title": "Topic 2",
          "duration": "5 hours",
          "type": "practice",
          "resources": ["Resource C", "Resource D"]
        },
        {
          "id": "w1-t3",
          "title": "Topic 3",
          "duration": "4 hours",
          "type": "reading",
          "resources": ["Resource E", "Resource F"]
        },
        {
          "id": "w1-t4",
          "title": "Topic 4",
          "duration": "8 hours",
          "type": "project",
          "resources": ["Resource G", "Resource H"]
        }
      ]
    }
  ]
}

Generate ${totalWeeks} weeks total. Each week must have exactly 4 topics with types: video, practice, reading, project.
Return ONLY the JSON object, nothing else.`;
  }

  private cleanResponse(text: string): string {
    // Remove markdown code blocks
    let cleaned = text.replace(/``````\n?/g, "");
    
    // Remove any text before first {
    const firstBrace = cleaned.indexOf("{");
    if (firstBrace > 0) {
      cleaned = cleaned.substring(firstBrace);
    }
    
    // Remove any text after last }
    const lastBrace = cleaned.lastIndexOf("}");
    if (lastBrace !== -1 && lastBrace < cleaned.length - 1) {
      cleaned = cleaned.substring(0, lastBrace + 1);
    }
    
    return cleaned.trim();
  }

  async generateRoadmap(
    technology: string,
    duration: string,
    difficulty: string
  ): Promise<Roadmap> {
    const totalWeeks = DURATION_TO_WEEKS[duration] || 4;
    const estimatedHours = totalWeeks * 20;

    console.log("Generating roadmap...");
    console.log("Parameters:", { technology, duration, difficulty, totalWeeks });

    try {
      const prompt = this.buildPrompt(
        technology,
        duration,
        difficulty,
        totalWeeks,
        estimatedHours
      );

      const model = this.genAI.getGenerativeModel({
        model: "gemini-2.0-flash",
        generationConfig: {
          temperature: 0.7,
          topP: 0.95,
          topK: 40,
          maxOutputTokens: 8192,
          responseMimeType: "application/json", // Force JSON response
        },
      });

      const result = await model.generateContent(prompt);
      const response = result.response;
      let text = response.text();

      console.log("Raw response length:", text.length);
      console.log("First 200 chars:", text.substring(0, 200));

      // Clean the response
      text = this.cleanResponse(text);

      console.log("Cleaned response length:", text.length);
      console.log("First 200 chars:", text.substring(0, 200));

      // Parse JSON
      let roadmap: Roadmap;
      try {
        roadmap = JSON.parse(text);
      } catch (parseError: any) {
        console.error("JSON Parse Error:", parseError.message);
        console.error("Failed text:", text);
        throw new Error(`Failed to parse AI response: ${parseError.message}`);
      }

      // Validate structure
      if (!roadmap.weeks || !Array.isArray(roadmap.weeks)) {
        console.error("Invalid structure:", roadmap);
        throw new Error("Invalid roadmap structure: missing weeks array");
      }

      if (roadmap.weeks.length === 0) {
        throw new Error("Roadmap has no weeks");
      }

      // Ensure proper IDs and structure
      roadmap.weeks.forEach((week, weekIdx) => {
        if (!week.topics || !Array.isArray(week.topics)) {
          week.topics = [];
        }
        
        week.topics.forEach((topic, topicIdx) => {
          if (!topic.id) {
            topic.id = `w${weekIdx + 1}-t${topicIdx + 1}`;
          }
          if (!topic.resources || !Array.isArray(topic.resources)) {
            topic.resources = [];
          }
        });
      });

      console.log("Generated roadmap with", roadmap.weeks.length, "weeks");
      console.log("Total topics:", roadmap.weeks.reduce((sum, w) => sum + w.topics.length, 0));

      return roadmap;

    } catch (error: any) {
      console.error("Gemini API Error:", error.message);
      console.error("Full error:", error);
      throw error;
    }
  }
}

export default new GeminiService();
