import { GoogleGenAI, Type } from "@google/genai";
import { RawCompanyData, AiAnalysis } from '../types';

const getAiClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.error("API_KEY is missing in environment variables.");
    return null;
  }
  return new GoogleGenAI({ apiKey });
};

export const analyzeCompaniesBatch = async (companies: RawCompanyData[]): Promise<Record<string, AiAnalysis>> => {
  const ai = getAiClient();
  if (!ai) {
    // Fallback if no key is present, just for UI demonstration safety
    return companies.reduce((acc, company) => {
      acc[company.id] = {
        isAiNative: company.rawDescription.toLowerCase().includes('ai') || company.rawDescription.toLowerCase().includes('model'),
        category: "Uncategorized (No API Key)",
        subCategory: "General",
        summary: "API Key missing. Cannot analyze.",
        tags: ["No Key"]
      };
      return acc;
    }, {} as Record<string, AiAnalysis>);
  }

  // Construct a prompt that sends the list of companies
  const companiesPrompt = companies.map(c => 
    `ID: ${c.id}\nName: ${c.name}\nDescription: ${c.rawDescription}`
  ).join('\n---\n');

  const systemInstruction = `
    You are an expert venture capital analyst specializing in Artificial Intelligence. 
    Your task is to analyze a list of YC startups.
    For each startup, determine:
    1. Is it AI Native? (True/False)
    2. Primary Category (e.g., Infrastructure, Healthcare, Sales & Marketing, Legal & Finance, Creative & Media, Developer Tools, Other)
    3. Sub-Category (Specific niche, e.g., Vector DB, Agent, GenAI Video)
    4. A concise 1-sentence summary of their innovation.
    5. 3 key tags.
    
    Return the result as a JSON object keyed by the Company ID.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Analyze these companies:\n\n${companiesPrompt}`,
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          description: "Analysis results keyed by company ID",
          properties: {
             results: {
               type: Type.ARRAY,
               items: {
                 type: Type.OBJECT,
                 properties: {
                    id: { type: Type.STRING },
                    isAiNative: { type: Type.BOOLEAN },
                    category: { type: Type.STRING },
                    subCategory: { type: Type.STRING },
                    summary: { type: Type.STRING },
                    tags: { type: Type.ARRAY, items: { type: Type.STRING } }
                 },
                 required: ["id", "isAiNative", "category", "subCategory", "summary", "tags"]
               }
             }
          }
        }
      }
    });

    const jsonText = response.text;
    if (!jsonText) throw new Error("No response from Gemini");

    const parsed = JSON.parse(jsonText);
    
    // Transform array back to map for easier lookup
    const resultMap: Record<string, AiAnalysis> = {};
    if (parsed.results && Array.isArray(parsed.results)) {
        parsed.results.forEach((item: any) => {
            resultMap[item.id] = {
                isAiNative: item.isAiNative,
                category: item.category,
                subCategory: item.subCategory,
                summary: item.summary,
                tags: item.tags
            };
        });
    }

    return resultMap;

  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    throw error;
  }
};