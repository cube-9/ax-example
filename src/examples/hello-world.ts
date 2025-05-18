import { AxAI, AxChainOfThought, AxAIOpenAIModel } from '@ax-llm/ax'

// Input data
const markdown = `# Support Ticket
Hi, my name is Jane Smith. I need help with my order.`

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
    })

    // Create chain of thought with a simple signature
    const cot = new AxChainOfThought(`markdown:string -> customerName:string`)
    console.log('Extracting customer name from markdown...')
    
    // Execute the chain of thought
    const res = await cot.forward(ai, { markdown })
    console.log('Result:', res)
    
    return res
  } catch (e: any) {
    console.error('Error executing example:', e.message)
    console.error('Make sure all required environment variables are set in .env file')
  }
}

main()
