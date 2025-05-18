import { AxAI, AxChainOfThought, AxAIOpenAIModel } from '@ax-llm/ax'

const markdown = `# Support Ticket
Hi, my name is Jane Smith. I need help with my order.`

const ai = new AxAI({
  name: 'azure-openai',
  apiKey: process.env.AZURE_API_KEY as string,
  resourceName: process.env.AZURE_ENDPOINT as string,
  deploymentName: (process.env.LLM_MODEL || '').split('/').pop() as string,
  version: process.env.AZURE_API_VERSION as string,
  config: { model: AxAIOpenAIModel.GPT41Mini },
})

const cot = new AxChainOfThought(`markdown:string -> customerName:string`)

const res = await cot.forward(ai, { markdown })
console.log(res)
