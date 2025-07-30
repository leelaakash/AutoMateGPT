// Hugging Face API integration
const HF_API_KEY = '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';
const HF_API_URL = 'https://api-inference.huggingface.co/models/microsoft/DialoGPT-large';

export const generateHuggingFaceResponse = async (
  prompt: string,
  maxTokens: number = 1000
): Promise<{ content: string; tokens: number }> => {
  try {
    console.log('Calling Hugging Face API with prompt:', prompt.substring(0, 100) + '...');
    
    const response = await fetch(HF_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${HF_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inputs: prompt,
        parameters: {
          max_new_tokens: Math.min(maxTokens, 500),
          temperature: 0.7,
          do_sample: true,
          return_full_text: false,
        }
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Hugging Face API error:', response.status, errorText);
      throw new Error(`Hugging Face API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log('Hugging Face API response:', data);
    
    let content = '';
    if (Array.isArray(data) && data.length > 0) {
      content = data[0].generated_text || '';
    } else if (data.generated_text) {
      content = data.generated_text;
    } else if (typeof data === 'string') {
      content = data;
    }
    
    // Clean up the response by removing the original prompt
    let cleanContent = content.replace(prompt, '').trim();
    
    // If content is still empty, provide a basic response
    if (!cleanContent) {
      cleanContent = `I understand your request: "${prompt.substring(0, 100)}...". Here's my response based on the input provided.`;
    }
    
    return {
      content: cleanContent,
      tokens: Math.ceil(cleanContent.length / 4) // Rough token estimation
    };
  } catch (error: any) {
    console.error('Hugging Face API Error:', error);
    throw new Error(`Hugging Face API Error: ${error.message || 'Unknown error occurred'}`);
  }
};