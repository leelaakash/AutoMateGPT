// Enhanced PDF parsing utility using multiple extraction methods
export const extractTextFromPDF = async (file: File): Promise<string> => {
  try {
    // Method 1: Try using PDF.js if available
    if (typeof window !== 'undefined' && (window as any).pdfjsLib) {
      return await extractWithPDFJS(file);
    }
    
    // Method 2: Use ArrayBuffer parsing
    const arrayBuffer = await file.arrayBuffer();
    const text = await parseArrayBufferToPDF(arrayBuffer);
    
    if (text && text.length > 50) {
      return text;
    }
    
    // Method 3: Fallback to basic text extraction
    return await basicPDFTextExtraction(arrayBuffer);
    
  } catch (error) {
    console.error('PDF parsing error:', error);
    throw new Error('Unable to extract text from PDF. Please try copying and pasting the text instead.');
  }
};

// PDF.js extraction method
const extractWithPDFJS = async (file: File): Promise<string> => {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await (window as any).pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  
  let fullText = '';
  
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const textContent = await page.getTextContent();
    const pageText = textContent.items
      .map((item: any) => item.str)
      .join(' ');
    fullText += pageText + '\n\n';
  }
  
  return fullText.trim();
};

// ArrayBuffer parsing method
const parseArrayBufferToPDF = async (arrayBuffer: ArrayBuffer): Promise<string> => {
  const uint8Array = new Uint8Array(arrayBuffer);
  const decoder = new TextDecoder('utf-8', { fatal: false });
  let rawText = decoder.decode(uint8Array);
  
  // Enhanced PDF text extraction patterns
  const textPatterns = [
    // Text between parentheses (most common)
    /\(([^)]+)\)\s*Tj/g,
    // Text arrays
    /\[([^\]]+)\]\s*TJ/g,
    // Text between BT and ET operators
    /BT\s+(.*?)\s+ET/gs,
    // Direct text content
    /\(([^)]*)\)/g,
    // Hex encoded text
    /<([0-9A-Fa-f\s]+)>\s*Tj/g
  ];
  
  let extractedText = '';
  
  // Apply each pattern
  for (const pattern of textPatterns) {
    const matches = rawText.match(pattern);
    if (matches) {
      matches.forEach(match => {
        let cleanText = match
          .replace(/\(|\)/g, '')
          .replace(/\[|\]/g, '')
          .replace(/\\[rn]/g, '\n')
          .replace(/\\t/g, '\t')
          .replace(/\\\\/g, '\\')
          .replace(/BT|ET|Tj|TJ/g, '')
          .replace(/<|>/g, '')
          .trim();
        
        // Convert hex to text if needed
        if (/^[0-9A-Fa-f\s]+$/.test(cleanText)) {
          try {
            cleanText = hexToText(cleanText);
          } catch (e) {
            // Keep original if hex conversion fails
          }
        }
        
        if (cleanText.length > 2) {
          extractedText += cleanText + ' ';
        }
      });
    }
  }
  
  // Clean up the extracted text
  extractedText = extractedText
    .replace(/\s+/g, ' ')
    .replace(/([.!?])\s*([A-Z])/g, '$1\n\n$2')
    .trim();
  
  return extractedText;
};

// Basic extraction fallback
const basicPDFTextExtraction = async (arrayBuffer: ArrayBuffer): Promise<string> => {
  const uint8Array = new Uint8Array(arrayBuffer);
  const decoder = new TextDecoder('utf-8', { fatal: false });
  let text = decoder.decode(uint8Array);
  
  // Extract readable ASCII text
  text = text
    .replace(/[^\x20-\x7E\n\r\t]/g, ' ')
    .replace(/\s+/g, ' ')
    .replace(/([.!?])\s*([A-Z])/g, '$1\n\n$2')
    .trim();
  
  // Filter out PDF metadata and keep meaningful content
  const lines = text.split('\n').filter(line => {
    const trimmed = line.trim();
    return trimmed.length > 10 && 
           !trimmed.startsWith('/') && 
           !trimmed.includes('obj') &&
           !trimmed.includes('endobj') &&
           !/^\d+\s+\d+$/.test(trimmed);
  });
  
  return lines.join('\n').trim();
};

// Helper function to convert hex to text
const hexToText = (hex: string): string => {
  const cleanHex = hex.replace(/\s/g, '');
  let result = '';
  
  for (let i = 0; i < cleanHex.length; i += 2) {
    const hexPair = cleanHex.substr(i, 2);
    const charCode = parseInt(hexPair, 16);
    if (charCode >= 32 && charCode <= 126) {
      result += String.fromCharCode(charCode);
    }
  }
  
  return result;
};

export const validatePDFFile = (file: File): string | null => {
  const maxSize = 10 * 1024 * 1024; // 10MB
  
  if (file.size > maxSize) {
    return 'PDF file size must be less than 10MB';
  }
  
  if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
    return 'Please select a valid PDF file';
  }
  
  return null;
};