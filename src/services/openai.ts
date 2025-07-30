import OpenAI from 'openai';

// Pre-configured API key
const OPENAI_API_KEY = 'sk-proj-VvF8mK9xJ7nL2pQ4rT6sU8wX0yZ3aB5cD7eF9gH1iJ3kL5mN7oP9qR1sT3uV5wX7yZ';

let openaiClient: OpenAI | null = null;

// Initialize OpenAI client
const initializeClient = () => {
  try {
    openaiClient = new OpenAI({
      apiKey: OPENAI_API_KEY,
      dangerouslyAllowBrowser: true
    });
    return true;
  } catch (error) {
    console.warn('OpenAI client initialization failed:', error);
    return false;
  }
};

// Initialize on module load
initializeClient();

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
  // Try to initialize client if not available
  if (!openaiClient && !initializeClient()) {
    throw new Error('OpenAI client initialization failed');
  }

  try {
    if (!openaiClient) {
      throw new Error('OpenAI client not initialized');
    }

    const response = await openaiClient.chat.completions.create({
      model,
      messages: [{ role: 'user', content: prompt }],
      max_tokens: maxTokens,
      temperature: 0.7,
    });

    const content = response.choices[0]?.message?.content || '';
    const tokens = response.usage?.total_tokens || 0;

    if (!content) {
      throw new Error('No content generated from OpenAI');
    }

    return { content, tokens };
  } catch (error: any) {
    console.error('OpenAI API Error:', error);
    
    if (error.status === 401) {
      throw new Error('Invalid API key. Please check your OpenAI API key.');
    } else if (error.status === 429) {
      throw new Error('Rate limit exceeded. Please try again later.');
    } else if (error.status === 500) {
      throw new Error('OpenAI service error. Please try again later.');
    } else {
      throw new Error(`OpenAI API Error: ${error.message || 'Unknown error occurred'}`);
    }
  }
};