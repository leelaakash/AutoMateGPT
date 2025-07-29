export const readFileAsText = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (event) => {
      const text = event.target?.result as string;
      resolve(text);
    };
    
    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };
    
    if (file.type === 'application/pdf') {
      // For PDF files, we'll extract text using a simple approach
      // In a production app, you'd use pdf-lib or PDF.js
      reader.readAsArrayBuffer(file);
      reader.onload = async (event) => {
        try {
          const arrayBuffer = event.target?.result as ArrayBuffer;
          const text = await extractTextFromPDF(arrayBuffer);
          resolve(text);
        } catch (error) {
          reject(new Error('Failed to extract text from PDF. Please try copying and pasting the text instead.'));
        }
      };
    } else {
      reader.readAsText(file);
    }
  });
};

// Simple PDF text extraction (fallback)
const extractTextFromPDF = async (arrayBuffer: ArrayBuffer): Promise<string> => {
  // This is a simplified approach - in production, use proper PDF parsing libraries
  const uint8Array = new Uint8Array(arrayBuffer);
  const decoder = new TextDecoder('utf-8');
  let text = decoder.decode(uint8Array);
  
  // Basic PDF text extraction - remove PDF-specific characters
  text = text.replace(/[^\x20-\x7E\n\r\t]/g, ' ');
  text = text.replace(/\s+/g, ' ').trim();
  
  if (text.length < 50) {
    throw new Error('Could not extract readable text from PDF');
  }
  
  return text;
};

export const validateFile = (file: File): string | null => {
  const maxSize = 10 * 1024 * 1024; // 10MB
  const allowedTypes = ['text/plain', 'application/pdf'];
  
  if (file.size > maxSize) {
    return 'File size must be less than 10MB';
  }
  
  if (!allowedTypes.includes(file.type)) {
    return 'Only .txt and .pdf files are supported';
  }
  
  return null;
};