import { ChatOpenAI } from "@langchain/openai";
import { initializeAgentExecutorWithOptions } from "langchain/agents";
import { translationTool } from "./translationTools";

interface Props {
  message: string,
}
const model = new ChatOpenAI({
  temperature: 0,
  model: "gpt-3.5-turbo",
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  configuration: {
    baseURL: import.meta.env.VITE_OPENAI_API_URL
  }
});
// Initialize the agent executor
const tools = [translationTool];
const agent = await initializeAgentExecutorWithOptions(tools, model, {
  agentType: "structured-chat-zero-shot-react-description",
  verbose: true,
  returnIntermediateSteps: true,
});

// Run agent
export async function run(props: Props) {
  const { message } = props
  try {
    let modelName = ""
    const result = await agent.invoke({
      input: message,
      callbacks: [
        {
          handleLLMStart(llm: unknown, prompts: string[]) {
            console.log(llm)
            const regex = /"model_name":"([^"]+)"/;
            const match = prompts[0].match(regex);
            if (match && match[1]) {
              modelName = match[1]
            }
          },
        }
      ]
    });
    return `We are currently using the ${modelName} model for translation, and the translation result is ${result.output}.`

  } catch (error) {
    console.error('ErrorError', error);
  }
}
