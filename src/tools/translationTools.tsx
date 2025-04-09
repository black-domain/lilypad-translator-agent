import { DynamicStructuredTool } from "@langchain/core/tools";
import { ChatOpenAI } from "@langchain/openai";
import { z } from "zod";


const URL = import.meta.env.VITE_LILYPAD_API_KEY;
const API_KEY = import.meta.env.VITE_LILYPAD_API_URL
// Supported Lilypad translation models
const LILYPAD_MODELS = {
  "deepseek-r1:7b": "Works best when translating Chinese,but also support en、zh、ja、ko",
  "llama3.1:8b": "Better support for Southeast Asian minority languages,such as en、fr、de、es、pt、ar and some low-resource languages ​​(such as Swahili, Icelandic)",
  "llava:7b": "Better support for Japanese,but also support ja、en、fr、ko、es",
  "openthinker:7b": "Better support for Korean,but also support es、en、fr、de、it、pt,but the translation speed is slow",
  "phi4-mini:3.8b": "It supports 15 mainstream languages ​​including en, zh, Spanish, and fr, but the BLEU scores of Swahili and Icelandic translations are 40% lower than those of Llama3.",
  "qwen2.5-coder:7b": "But the translation speed is slow",
  "qwen2.5:7b": 'qwen2.5:7b',
};

export const translationTool = new DynamicStructuredTool({
  name: "lilypad_translator",
  description: `Tool that gives priority to using Lilypad translation models. The following models are supported: ${Object.entries(LILYPAD_MODELS)
    .map(([id, desc]) => `${id}(${desc})`)
    .join(", ")}.Please help me choose the most suitable model based on the advantages and disadvantages of these models and the description of the model.Finally, output in a standardized format`,
  schema: z.object({
    text: z.string().describe("Text to translate"),
    sourceLanguage: z.string().describe("Source language code (e.g. 'en')"),
    targetLanguage: z.string().describe("Target language code (e.g. 'zh')"),
    modelPreference: z.string()
      .optional()
      .refine(val => !val || Object.keys(LILYPAD_MODELS).includes(val!), {
        message: `Invalid model selection, optional:${Object.keys(LILYPAD_MODELS).join(", ")}`
      })
      .describe("Preferred LilyPad Model ID"),
    formal: z.boolean().optional().describe("Whether to use formal tone")
  }),
  func: async ({ text, sourceLanguage, targetLanguage, modelPreference, formal }) => {
    if (!text.trim()) throw new Error("The translation text cannot be empty");
    if (sourceLanguage === targetLanguage) {
      throw new Error("The source and target languages ​​cannot be the same");
    }

    try {
      const model = new ChatOpenAI({
        model: modelPreference,
        apiKey:
          API_KEY,
        configuration: {
          baseURL: URL,
          fetch: (url, requestInit) => {
            if (requestInit && url.toString().startsWith(URL)) {
              requestInit.headers = {
                "Content-Type": "application/json",
                authorization:
                  "Bearer " + API_KEY,
              };
            }
            return fetch(url, {
              method: requestInit?.method,
              headers: requestInit?.headers,
              body: requestInit?.body,
            });
          },
        },
      });
      const prompt = [
        `Please translate the following ${sourceLanguage} text into ${targetLanguage}${formal ? "(formal tone)" : ""}:`,
        "---",
        text,
        "---",
        "Just return the translated text, don't add anything extra."
      ].join("\n");
      const result = await model.invoke(prompt);
      return JSON.stringify({
        output: result,
        metadata: {
          model: modelPreference,
          provider: "Lilypad"
        }
      });
      // return result.content.toString();
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (e) {

      // If Lilypad fails, fallback to OpenAI
      const openaiResult = await callOpenAITranslation(
        text,
        sourceLanguage,
        targetLanguage,
        formal
      );
      return openaiResult;
    }
  }
});


// Fallback call to OpenAI translation
async function callOpenAITranslation(
  text: string,
  sourceLang: string,
  targetLang: string,
  formal?: boolean
): Promise<string> {
  const model = new ChatOpenAI({
    temperature: 0.3,
    model: "gpt-3.5-turbo",
    apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  });

  const prompt = [
    `Please translate the following ${sourceLang} text into ${targetLang}${formal ? "(formal tone)" : ""}:`,
    "---",
    text,
    "---",
    "Just return the translated text, don't add anything extra."
  ].join("\n");

  const result = await model.invoke(prompt);
  return result.content.toString();
}