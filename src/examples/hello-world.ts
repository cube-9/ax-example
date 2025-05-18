import { AxAI, AxChainOfThought, AxAIOpenAIModel } from '@ax-llm/ax'
import { trace } from '@opentelemetry/api'
import { BasicTracerProvider, BatchSpanProcessor } from '@opentelemetry/sdk-trace-node'
import { LangfuseSpanExporter } from 'langfuse'

const provider = new BasicTracerProvider()
const exporter = new LangfuseSpanExporter({
  publicKey: process.env.LANGFUSE_PUBLIC_KEY as string,
  secretKey: process.env.LANGFUSE_SECRET_KEY as string,
  baseUrl: process.env.LANGFUSE_HOST,
})
provider.addSpanProcessor(new BatchSpanProcessor(exporter))
trace.setGlobalTracerProvider(provider)
const tracer = trace.getTracer('hello-world')

const markdown = `# Support Ticket
Hi, my name is Jane Smith. I need help with my order.`

const ai = new AxAI({
  name: 'azure-openai',
  apiKey: process.env.AZURE_API_KEY as string,
  resourceName: process.env.AZURE_ENDPOINT as string,
  deploymentName: (process.env.LLM_MODEL || '').split('/').pop() as string,
  version: process.env.AZURE_API_VERSION as string,
  config: { model: AxAIOpenAIModel.GPT41Mini },
  options: { tracer },
})

const cot = new AxChainOfThought(`markdown:string -> customerName:string`)

const res = await cot.forward(ai, { markdown })
console.log(res)
