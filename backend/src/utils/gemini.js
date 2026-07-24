import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export async function generateGeminiResponse(messages, systemInstruction = '') {
  try {
    const contents = messages.map((msg) => {
      // If content is a simple string
      if (typeof msg.content === 'string') {
        return {
          role: msg.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: msg.content }],
        };
      }

      // If content is an array (e.g. text + image)
      const parts = msg.content.map((item) => {
        if (item.type === 'text') {
          return { text: item.text };
        }
        if (item.type === 'image') {
          return {
            inlineData: {
              mimeType: item.mimeType || item.source?.media_type || 'image/jpeg',
              data: item.data || item.source?.data,
            },
          };
        }
        return item;
      });

      return {
        role: msg.role === 'assistant' ? 'model' : 'user',
        parts,
      };
    });

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents,
      config: systemInstruction ? { systemInstruction } : undefined,
    });

    return response.text;
  } catch (error) {
    console.error('Gemini API Error:', error);
    throw error;
  }
}