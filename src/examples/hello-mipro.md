# Hello MiPRO Example

This example tunes a simple chain-of-thought prompt with the MiPRO optimizer.

## Running

Set the following environment variables and run the script with `npm run tsx`:

```bash
AZURE_API_KEY=<your-key> \
AZURE_ENDPOINT="https://your-azure-endpoint" \
AZURE_API_VERSION="2024-12-01-preview" \
LLM_MODEL="azure/gpt-4.1-mini" \
npm run tsx ./src/examples/hello-mipro.ts
```
