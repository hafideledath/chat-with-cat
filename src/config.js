// Configuration file
const OpenAI = require('openai');

// Base configuration object
const config = {
  // Get the API keys from environment variables
  OPENAI_API_KEY: process.env.REACT_APP_OPENAI_API_KEY,
  NEBIUS_API_KEY: process.env.REACT_APP_NEBIUS_API_KEY,
  CARTESIA_API_KEY: process.env.REACT_APP_CARTESIA_API_KEY
};

// Safety check to alert developers if API keys are missing
if (!config.OPENAI_API_KEY) {
  console.warn('OpenAI API key is missing! Make sure to set REACT_APP_OPENAI_API_KEY in your .env file');
}

if (!config.NEBIUS_API_KEY) {
  console.warn('Nebius API key is missing! Make sure to set REACT_APP_NEBIUS_API_KEY in your .env file');
}

if (!config.CARTESIA_API_KEY) {
  console.warn('Cartesia API key is missing! Make sure to set REACT_APP_CARTESIA_API_KEY in your .env file');
}

// Initialize OpenAI client configured for Nebius API
const nebiusClient = new OpenAI({
  baseURL: 'https://api.studio.nebius.com/v1/',
  apiKey: config.NEBIUS_API_KEY,
  dangerouslyAllowBrowser: true, // Allow usage in browser environment
});

// Default model settings for Nebius
const nebiusDefaults = {
  model: "meta-llama/Meta-Llama-3.1-70B-Instruct-fast",
  max_tokens: 512,
  temperature: 0.6,
  top_p: 0.9,
  extra_body: {
    top_k: 50
  }
};

// Export configuration and clients
export { nebiusClient, nebiusDefaults };
export default config;
