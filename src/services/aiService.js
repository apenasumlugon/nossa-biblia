import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || "";
const genAI = API_KEY ? new GoogleGenerativeAI(API_KEY) : null;

/**
 * Explica um versículo com foco devocional e para casais
 */
export const explainVerse = async (verseText, bookName, chapter, number) => {
    if (!genAI) {
        throw new Error("API Key do Gemini não configurada");
    }

    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const prompt = `
      Você é um mentor cristão sábio e gentil. 
      Analise o seguinte versículo da Bíblia (${bookName} ${chapter}:${number}): "${verseText}".
      
      Forneça uma resposta curta e inspiradora (máximo 4 parágrafos) dividida em:
      1. 📖 **Significado**: Uma explicação simples do contexto.
      2. 💕 **Para o Casal**: Uma aplicação prática de como esse versículo pode fortalecer um relacionamento amoroso.
      3. 🙏 **Oração Curta**: Uma frase de oração baseada no texto.
      
      Use um tom carinhoso e encorajador.
    `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        return response.text();
    } catch (error) {
        console.error("Erro ao chamar Gemini:", error);
        throw new Error("Não consegui gerar a explicação agora. Tente novamente mais tarde.");
    }
};

export const isAiReady = () => {
    return !!genAI;
};
