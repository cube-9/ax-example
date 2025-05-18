# Hello World Azure Example

This example extracts the customer name from a markdown message using a Chain of Thought signature.

## Running

Set the following environment variables and run the script with `npm run tsx`:

```bash
AZURE_API_KEY=<your-key> \
AZURE_ENDPOINT="https://cube9-m7izb2d0-eastus2.cognitiveservices.azure.com/" \
AZURE_API_VERSION="2024-12-01-preview" \
LLM_MODEL="azure/gpt-4.1-mini" \
npm run tsx ./src/examples/hello-world.ts
```
