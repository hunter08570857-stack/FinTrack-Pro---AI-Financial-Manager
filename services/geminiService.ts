import { GoogleGenAI } from "@google/genai";
import { Transaction, StockHolding, BankAccount } from "../types";

const getAIClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.error("API Key not found in environment");
    return null;
  }
  return new GoogleGenAI({ apiKey });
};

export const analyzeFinances = async (
  transactions: Transaction[],
  accounts: BankAccount[],
  stocks: StockHolding[]
): Promise<string> => {
  const ai = getAIClient();
  if (!ai) return "請先設定 API Key 以使用 AI 分析功能。";

  // Prepare data summary to save tokens and provide context
  const summary = {
    totalBalanceTWD: accounts.reduce((acc, curr) => curr.currency === 'TWD' ? acc + curr.balance : acc, 0),
    transactionsCount: transactions.length,
    recentTransactions: transactions.slice(0, 10),
    stockHoldings: stocks.map(s => ({ symbol: s.symbol, qty: s.quantity, gain: (s.currentPrice - s.avgCost) * s.quantity }))
  };

  const prompt = `
    你是一個專業的個人財務顧問。請根據以下用戶的財務數據進行分析並提供建議 (使用繁體中文 Markdown 格式)。
    
    數據摘要:
    ${JSON.stringify(summary, null, 2)}
    
    請提供：
    1. 整體財務健康狀況簡評。
    2. 收支異常提醒 (如果有的話)。
    3. 投資組合建議 (基於目前的持股表現)。
    4. 未來理財小撇步。
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });
    return response.text || "無法生成分析結果。";
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    return "分析過程中發生錯誤，請稍後再試。";
  }
};

export const getMarketUpdate = async (stocks: StockHolding[]): Promise<string> => {
  const ai = getAIClient();
  if (!ai) return "API Key 缺失";

  const symbols = stocks.map(s => s.symbol).join(", ");
  const prompt = `查找以下股票的最新市場價格或近期趨勢：${symbols}。如果可以，請提供簡短的市場情緒分析。`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });
    
    let text = response.text || "無法獲取市場資訊。";

    // Extract grounding sources as per guidelines
    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
    if (chunks) {
      const sources = chunks
        .map((chunk: any) => chunk.web ? `- [${chunk.web.title}](${chunk.web.uri})` : null)
        .filter(Boolean);
      
      if (sources.length > 0) {
        text += `\n\n### 參考來源\n${sources.join('\n')}`;
      }
    }
    
    return text;
  } catch (error) {
    console.error("Market Update Error:", error);
    return "更新失敗，請檢查網路或 API 設置。";
  }
};