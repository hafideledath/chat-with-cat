// Configuration file
const config = {
  // Get the OpenAI API key from environment variables
  OPENAI_API_KEY: process.env.REACT_APP_OPENAI_API_KEY
};

// Safety check to alert developers if the API key is missing
if (!config.OPENAI_API_KEY) {
  console.warn('OpenAI API key is missing! Make sure to set REACT_APP_OPENAI_API_KEY in your .env file');
}

export default config;
