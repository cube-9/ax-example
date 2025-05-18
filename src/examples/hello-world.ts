import { trace } from '@opentelemetry/api';
import {
  BasicTracerProvider,
  SimpleSpanProcessor,
} from '@opentelemetry/sdk-trace-base';
import { OTLPTraceExporter } from '@opentelemetry/exporter-otlp-http';

import { AxAI, AxChainOfThought, AxAIOpenAIModel } from '@ax-llm/ax';

// 1) Langfuse credentials
const LANGFUSE_PUBLIC_KEY = process.env.LANGFUSE_PUBLIC_KEY ?? 'pk-lf-...';
const LANGFUSE_SECRET_KEY = process.env.LANGFUSE_SECRET_KEY ?? 'sk-lf-...';

// 2) Build Basic Auth header
const authString = Buffer
  .from(`${LANGFUSE_PUBLIC_KEY}:${LANGFUSE_SECRET_KEY}`)
  .toString('base64');

// 3) Create OTLP exporter pointing to Langfuse (EU cloud URL shown below)
const exporter = new OTLPTraceExporter({
  // if you need US region, set: 'https://us.cloud.langfuse.com/api/public/otel/v1/traces'
  url: 'https://cloud.langfuse.com/api/public/otel/v1/traces',
  headers: {
    Authorization: `Basic ${authString}`,
  },
});

// 4) OpenTelemetry tracer provider
const provider = new BasicTracerProvider();
provider.addSpanProcessor(new SimpleSpanProcessor(exporter));
provider.register();
trace.setGlobalTracerProvider(provider);

// 5) Acquire a tracer from OTel
const tracer = trace.getTracer('langfuse-azure-openai');

// Input data
const markdown = `# Support Ticket
Hi, my name is Jane Smith. I need help with my order.`;

async function main() {
  try {
    // Create AI instance
    const ai = new AxAI({
      name: 'azure-openai',
      apiKey: process.env.AZURE_API_KEY as string,
      resourceName: process.env.AZURE_ENDPOINT as string,
      deploymentName: (process.env.LLM_MODEL || '').split('/').pop() as string,
      version: process.env.AZURE_API_VERSION as string,
      config: { model: AxAIOpenAIModel.GPT41Mini },
      options: {
        tracer, // 6) Pass our OTel tracer to AxAI
      },
    });

    // Create chain of thought with a simple signature
    const cot = new AxChainOfThought(`markdown:string -> customerName:string`);
    console.log('Extracting customer name from markdown...');

    // Execute the chain of thought
    const res = await cot.forward(ai, { markdown });
    console.log('Result:', res);

    return res;
  } catch (e: any) {
    console.error('Error executing example:', e.message);
    console.error(
      'Make sure all required environment variables are set in .env file'
    );
  }
}

main();
