// Hugging Face API integration
const HF_API_KEY = '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';
const HF_API_URL = 'https://api-inference.huggingface.co/models/microsoft/DialoGPT-medium';

export const generateHuggingFaceResponse = async (
  prompt: string,
  maxTokens: number = 1000
): Promise<{ content: string; tokens: number }> => {
  try {
    const response = await fetch(HF_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${HF_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inputs: prompt,
        parameters: {
          max_length: maxTokens,
          temperature: 0.7,
          do_sample: true,
        }
      })
    });

    if (!response.ok) {
      throw new Error(`Hugging Face API error: ${response.status}`);
    }

    const data = await response.json();
    const content = data[0]?.generated_text || data.generated_text || '';
    
    // Clean up the response by removing the original prompt
    const cleanContent = content.replace(prompt, '').trim();
    
    return {
      content: cleanContent || 'No response generated',
      tokens: Math.ceil(cleanContent.length / 4) // Rough token estimation
    };
  } catch (error: any) {
    throw new Error(`Hugging Face API Error: ${error.message || 'Unknown error occurred'}`);
  }
};