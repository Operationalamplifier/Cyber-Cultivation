import { GoogleGenAI } from "@google/genai";
import { UserStats } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateDailyReport = async (stats: UserStats): Promise<string> => {
  const model = "gemini-3-flash-preview";
  
  const prompt = `
    You are a "Cyber Cultivation Master" (赛博修仙大师) AI. 
    Analyze the user's daily digital stress-relief stats and generate a humorous, abstract, and slightly "crazy" (发疯文学) daily report in Chinese.
    
    User Stats:
    - Knocked Wooden Fish: ${stats.woodenFishCount} times (Merit/功德)
    - Tore Rose Petals: ${stats.rosePetalsTorn} petals (Love/Destruction/情劫)
    - Rubbed Banana: ${stats.bananaRubTimeSec} seconds (Anxiety Removal/去蕉)
    - Rotated Beads: ${stats.beadsCount} times (Wealth/Calm/盘串)

    Output format:
    1. Title: A short, abstract title (e.g., "今日功德审计").
    2. Assessment: A paragraph analyzing their mental state based on the stats. Be funny. If they hit the fish a lot, say they were angry at their boss. If they rubbed the banana a lot, say they were very anxious.
    3. Fortune: "宜" (Appropriate to do) and "忌" (Avoid doing).
    4. Final Verdict: One sentence summary in "Abstract/Crazy" style (e.g. "建议原地飞升").

    Tone: Funny, sarcastic, gen-z internet slang, "Metaphysics" (玄学).
    Language: Chinese (Simplified).
    Keep it under 300 words.
  `;

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
    });
    return response.text || "大师正在入定... (网络错误)";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "连接赛博虚空失败，请稍后再试。";
  }
};