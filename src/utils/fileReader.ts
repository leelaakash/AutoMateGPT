export const readFileAsText = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };
    
    if (file.type === 'application/pdf') {
      // For PDF files, we'll extract text using a more robust approach
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
      reader.onload = (event) => {
        const text = event.target?.result as string;
        resolve(text);
      };
    }
  });
};

// Enhanced PDF text extraction
const extractTextFromPDF = async (arrayBuffer: ArrayBuffer): Promise<string> => {
  try {
    // Convert ArrayBuffer to Uint8Array for processing
    const uint8Array = new Uint8Array(arrayBuffer);
    
    // Look for text objects in PDF structure
    const decoder = new TextDecoder('utf-8', { fatal: false });
    let rawText = decoder.decode(uint8Array);
    
    // Enhanced PDF text extraction patterns
    const textPatterns = [
      // Standard text objects
      /\(([^)]+)\)\s*Tj/g,
      /\[([^\]]+)\]\s*TJ/g,
      // Text between BT and ET operators
      /BT\s+.*?ET/gs,
      // Direct text content
      /\(([^)]*)\)/g
    ];
    
    let extractedText = '';
    
    // Try multiple extraction methods
    for (const pattern of textPatterns) {
      const matches = rawText.match(pattern);
      if (matches) {
        matches.forEach(match => {
          // Clean up the extracted text
          let cleanText = match
            .replace(/\(|\)/g, '')
            .replace(/\\[rn]/g, '\n')
            .replace(/\\t/g, '\t')
            .replace(/\\\\/g, '\\')
            .replace(/BT|ET|Tj|TJ/g, '')
            .trim();
          
          if (cleanText.length > 2) {
            extractedText += cleanText + ' ';
          }
        });
      }
    }
    
    // Fallback: extract readable ASCII text
    if (extractedText.length < 50) {
      extractedText = rawText
        .replace(/[^\x20-\x7E\n\r\t]/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
    }
    
    // Additional cleanup
    extractedText = extractedText
      .replace(/\s+/g, ' ')
      .replace(/([.!?])\s*([A-Z])/g, '$1\n\n$2')
      .trim();
    
    if (extractedText.length < 20) {
      throw new Error('Could not extract sufficient text from PDF');
    }
    
    return extractedText;
  } catch (error) {
    throw new Error('PDF text extraction failed. The PDF might be image-based or encrypted.');
  }
};

export const validateFile = (file: File): string | null => {
  const maxSize = 10 * 1024 * 1024; // 10MB
  const allowedTypes = ['text/plain', 'application/pdf', 'text/csv', 'application/msword'];
  
  if (file.size > maxSize) {
    return 'File size must be less than 10MB';
  }
  
  if (!allowedTypes.includes(file.type) && !file.name.toLowerCase().endsWith('.txt')) {
    return 'Supported formats: .txt, .pdf, .csv, .doc files';
  }
  
  return null;
};