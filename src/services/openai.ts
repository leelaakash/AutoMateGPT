import OpenAI from 'openai';

// Pre-configured API key
const OPENAI_API_KEY = 'sk-proj-your-api-key-here';

let openaiClient: OpenAI | null = null;

// Initialize OpenAI client immediately with pre-configured key
openaiClient = new OpenAI({
  apiKey: OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

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
    throw new Error('OpenAI client not initialized. Please provide your API key.');
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