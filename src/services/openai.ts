import OpenAI from 'openai';

// Pre-configured API key - replace with your actual key
const OPENAI_API_KEY = 'sk-proj-configured-key-here';

let openaiClient: OpenAI | null = null;

// Initialize OpenAI client with pre-configured key
try {
  openaiClient = new OpenAI({
    apiKey: OPENAI_API_KEY,
    dangerouslyAllowBrowser: true
  });
} catch (error) {
  console.warn('OpenAI client initialization failed:', error);
}

export const initializeOpenAI = (apiKey: string) => {
  openaiClient = new OpenAI({
    apiKey,
    dangerouslyAllowBrowser: true
  });
};

export const generateResponse = async (
  prompt: string,
  model: string = 'gpt-3.5-turbo',
  maxTokens: number = 1000
): Promise<{ content: string; tokens: number }> => {
  if (!openaiClient) {
    throw new Error('OpenAI client not available. Using Hugging Face as fallback.');
  }

  try {
    const response = await openaiClient.chat.completions.create({
      model,
      messages: [{ role: 'user', content: prompt }],
      max_tokens: maxTokens,
      temperature: 0.7,
    });

    const content = response.choices[0]?.message?.content || '';
    const tokens = response.usage?.total_tokens || 0;

    return { content, tokens };
  } catch (error: any) {
    if (error.status === 401) {
      throw new Error('Invalid API key. Please check your OpenAI API key.');
    } else if (error.status === 429) {
      throw new Error('Rate limit exceeded. Please try again later.');
    } else if (error.status === 500) {
      throw new Error('OpenAI service error. Please try again later.');
    } else {
      throw new Error(`API Error: ${error.message || 'Unknown error occurred'}`);
    }
  }
};