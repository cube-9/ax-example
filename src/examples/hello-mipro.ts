import fs from 'node:fs'

import {
  AxAI,
  AxAIOpenAIModel,
  AxChainOfThought,
  AxMiPRO,
  type AxMetricFn,
} from '@ax-llm/ax'

// Example training data: markdown support messages with known customer names
const trainingData = [
  {
    markdown: '# Support Ticket\nHi, my name is Jane Smith. I need help with my order.',
    customerName: 'Jane Smith',
  },
  {
    markdown: '# Support Ticket\nHello, I\'m Bob Johnson and I have a question.',
    customerName: 'Bob Johnson',
  },
  {
    markdown: '# Support Ticket\nGreetings, this is Alice Wu. My product arrived damaged.',
    customerName: 'Alice Wu',
  },
]

const validationData = [
  {
    markdown: '# Support Ticket\nHi there, I\'m Emily Davis.',
    customerName: 'Emily Davis',
  },
  {
    markdown: '# Support Ticket\nGood day, I\'m Carlos Perez.',
    customerName: 'Carlos Perez',
  },
]

// Configure Azure OpenAI
const ai = new AxAI({
  name: 'azure-openai',
  apiKey: process.env.AZURE_API_KEY as string,
  resourceName: process.env.AZURE_ENDPOINT as string,
  deploymentName: (process.env.LLM_MODEL || '').split('/').pop() as string,
  version: process.env.AZURE_API_VERSION as string,
  config: { model: AxAIOpenAIModel.GPT41Mini },
})

// A basic chain-of-thought program
const program = new AxChainOfThought<{ markdown: string }, { customerName: string }>(
  `markdown -> customerName:string`
)

// Create the MiPRO optimizer
const optimizer = new AxMiPRO<{ markdown: string }, { customerName: string }>({
  ai,
  program,
  examples: trainingData,
})

// Simple accuracy metric
const metricFn: AxMetricFn = ({ prediction, example }) => {
  return prediction.customerName === example.customerName
}

console.log('Running MiPRO optimization...')
const optimizedProgram = await optimizer.compile(metricFn, {
  valset: validationData,
  auto: 'small',
})

// Save optimized program configuration
const programConfig = JSON.stringify(optimizedProgram, null, 2)
await fs.promises.writeFile('./mipro-hello-config.json', programConfig)

// Evaluate on validation set
console.log('\nValidation results:')
let correctCount = 0
for (const example of validationData) {
  const prediction = await optimizedProgram.forward(ai, example)
  const correct = metricFn({ prediction, example })
  if (correct) correctCount++
  console.log(`Input: "${example.markdown}"`)
  console.log(`Expected: ${example.customerName}, Predicted: ${prediction.customerName}`)
  console.log(`Result: ${correct ? '✓ CORRECT' : '✗ INCORRECT'}\n`)
}
const finalScore = correctCount / validationData.length
console.log(`Final accuracy: ${finalScore.toFixed(4)} (${correctCount}/${validationData.length})`)
console.log('> Done. Optimized program config saved to mipro-hello-config.json')
