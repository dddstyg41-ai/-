import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { Holiday, GenerationConfig } from "../types";

// Helper to get API Client
const getClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key not found in environment variables.");
  }
  return new GoogleGenAI({ apiKey });
};

// 1. Extract Prompt from Image
export const extractPromptFromImage = async (
  base64Image: string, 
  mimeType: string, 
  userInstructions: string
): Promise<string> => {
  const ai = getClient();
  
  const systemPrompt = userInstructions 
    ? `You are an AI image prompt expert. The user has specific requirements: ${userInstructions}. Analyze the image and generate a high-quality prompt.`
    : `You are an expert AI image generator prompt engineer. Analyze the attached image and write a detailed, high-quality text prompt that could be used to recreate this image. Focus on subject, medium, style, lighting, color palette, and composition. Output ONLY the prompt.`;

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: mimeType,
              data: base64Image
            }
          },
          {
            text: systemPrompt
          }
        ]
      }
    });

    return response.text || "Failed to extract prompt.";
  } catch (error) {
    console.error("Gemini Extraction Error:", error);
    throw error;
  }
};

// 2. Remix/Flip Prompt
export const remixPrompt = async (
  originalPrompt: string,
  style: string,
  variance: 'subtle' | 'moderate' | 'extreme',
  customInstruction?: string
): Promise<string> => {
  const ai = getClient();

  let varianceInstruction = "";
  switch (variance) {
    case 'subtle':
      varianceInstruction = "Keep the core subject and composition exactly the same. Only enhance descriptors or slightly polish the style.";
      break;
    case 'moderate':
      varianceInstruction = "Keep the main subject but feel free to change the angle, lighting, or background context slightly to make it more interesting.";
      break;
    case 'extreme':
      varianceInstruction = "Take the core concept but completely reimagine it. Change the composition, perspective, or setting dramatically while keeping the main theme.";
      break;
  }

  const prompt = `
    Original Prompt: "${originalPrompt}"
    Target Style: "${style}"
    Variance Level: ${variance} (${varianceInstruction})
    Additional User Instructions: ${customInstruction || "None"}

    Task: Rewrite the original prompt to match the target style and variance level. The output must be a high-quality prompt ready for an image generator (like Midjourney or Stable Diffusion). Output ONLY the new prompt.
  `;

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });

    return response.text || "Failed to remix prompt.";
  } catch (error) {
    console.error("Gemini Remix Error:", error);
    throw error;
  }
};

// 3. Generate Holiday Prompt (Batch & Advanced Controls)
export const generateHolidayPrompt = async (
  holiday: Holiday,
  style: string,
  customReq: string,
  config: GenerationConfig
): Promise<string> => {
  const ai = getClient();

  // Constructing the detailed prompt for Gemini
  const prompt = `
    I need you to generate AI image prompts for a specific Vietnamese Catholic Holiday.
    
    === Holiday Context ===
    - Name: ${holiday.name}
    - Significance: ${holiday.significance}
    - Typical Visual Elements: ${holiday.visualElements}
    - Priest's Activity: ${holiday.priestActivity}
    - Believers' Activity: ${holiday.believerActivity}
    - Default Liturgical Color: ${holiday.defaultVestmentColor}

    === Generation Constraints ===
    - Quantity: Generate ${config.batchSize} distinct variations.
    - Output Language: English (Prompt suitable for Midjourney/Stable Diffusion).
    - Length per prompt: Approximately ${config.wordCount} words (be descriptive).
    - Art Style: ${style}
    
    === Visual Specifics (User Overrides) ===
    - Shot Type/Angle: ${config.shotType}
    - Environment/Setting: ${config.environment}
    - Activity Focus: ${config.activity}
    - Priest Vestment Color: ${config.vestmentColor} (If 'default', use ${holiday.defaultVestmentColor}).
    - User Custom Notes: ${customReq || "None"}

    === Instructions ===
    1. Cultural Accuracy: Ensure Vietnamese facial features, traditional clothing (Ao Dai, Khan Dong) where appropriate, and correct Catholic liturgical details (altar, monstrance, etc.).
    2. Details: Describe lighting, texture, camera lens effects, and specific holiday items mentioned in the context (e.g. Bánh Chưng for Tet, Lanterns for Mid-Autumn).
    3. Format: Return the prompts as a numbered list. Do not add conversational text before or after.
  `;

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        thinkingConfig: { thinkingBudget: 1024 } // Thinking to ensure cultural accuracy
      }
    });

    return response.text || "Failed to generate holiday prompt.";
  } catch (error) {
    console.error("Gemini Holiday Prompt Error:", error);
    throw error;
  }
};