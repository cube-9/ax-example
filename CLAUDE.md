# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Overview

Ax is a TypeScript framework for building LLM-powered agents. It provides an end-to-end streaming, multi-modal DSPy framework with typed signatures that works with all major LLMs. The framework handles parsing, validating, error-correcting, and function calling while streaming.

## Key Commands

### Installation and Setup
```bash
yarn install
```

### Development
```bash
# Run a specific example
yarn tsx ./src/examples/hello-world.ts

# Run examples with environment variables
# Create a .env file with your API keys or provide them inline
yarn tsx ./src/examples/marketing.ts
```

### Building
```bash
# Build all packages
yarn build

# Build a specific package
yarn build --workspace=@ax-llm/ax

# Generate index files
node --import=tsx ./scripts/generateIndex.ts
```

### Testing
```bash
# Run all tests
yarn test

# Run specific tests
yarn test --workspace=@ax-llm/ax

# Run type checking only
yarn test:type-check --workspace=@ax-llm/ax
```

### Linting and Formatting
```bash
# Fix linting and formatting issues
yarn fix

# Fix for a specific package
yarn fix --workspace=@ax-llm/ax
```

### Documentation
```bash
# Build documentation
yarn doc:build

# Build markdown documentation
yarn doc:build:markdown
```

## Project Structure

- `/src/ax/` - Core Ax library
- `/src/ai-sdk-provider/` - Vercel AI SDK provider for Ax
- `/src/docs/` - Documentation site
- `/src/examples/` - Example applications showcasing Ax functionality
- `/scripts/` - Build and utility scripts

## LLM Provider Setup

To use different LLM providers, you'll need to set up the appropriate environment variables:

```typescript
// OpenAI
const ai = new AxAI({
  name: 'openai',
  apiKey: process.env.OPENAI_APIKEY as string
});

// Azure OpenAI
const ai = new AxAI({
  name: 'azure-openai',
  apiKey: process.env.AZURE_API_KEY as string,
  resourceName: process.env.AZURE_ENDPOINT as string,
  deploymentName: process.env.DEPLOYMENT_NAME as string,
  version: process.env.AZURE_API_VERSION as string
});

// Google Gemini
const ai = new AxAI({
  name: 'google-gemini',
  apiKey: process.env.GOOGLE_APIKEY as string
});
```

## Common Development Patterns

### Creating a prompt with signatures

```typescript
// Basic signature with input and output
const gen = new AxChainOfThought(`question -> answer`);

// Signature with types
const gen = new AxChainOfThought(`textToSummarize -> textType:class "note, email, reminder", shortSummary "summarize in 5 to 10 words"`);

// Running the prompt
const res = await gen.forward(ai, { question: "Your question here" });
```

### Working with functions

```typescript
const functions = [
  {
    name: 'functionName',
    description: 'Description of what the function does',
    parameters: {
      type: 'object',
      properties: {
        // Define parameters here
      },
      required: ['paramName']
    },
    func: async (args) => {
      // Function implementation
      return "result";
    }
  }
];

const gen = new AxGen(`question -> answer`, { functions });
const res = await gen.forward(ai, { question: "Your question" });
```

### Creating agents

```typescript
const agent = new AxAgent({
  name: 'agentName',
  description: 'Description of what the agent does',
  signature: `question -> answer`,
  functions: [functions], // Optional functions
  agents: [otherAgent1, otherAgent2] // Optional sub-agents
});

const res = await agent.forward(ai, { question: "Your question" });
```

### Error handling pattern

When catching errors, use this pattern:

```typescript
try {
  // Code that might throw
} catch (e) {
  const error = castError(e);
  logger.error(`[component]: Error message: ${error.message}`);
}
```

## Data Flow Architecture

The framework's core data flow:

1. Define a signature that specifies input and output fields
2. Create a program (AxGen, AxChainOfThought, etc.) with that signature
3. Connect the program to an LLM service (AxAI)
4. Forward inputs through the program to get structured outputs
5. Optionally add functions, assertions, or field processors

Streaming is built-in throughout the framework, allowing for fail-fast validation and error correction.