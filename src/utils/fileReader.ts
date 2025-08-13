import { extractTextFromPDF, validatePDFFile } from './pdfParser';

export const readFileAsText = async (file: File): Promise<string> => {
  return new Promise(async (resolve, reject) => {
    try {
      if (file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')) {
        // Validate PDF file first
        const validationError = validatePDFFile(file);
        if (validationError) {
          reject(new Error(validationError));
          return;
        }
        
        console.log('Processing PDF file:', file.name);
        const text = await extractTextFromPDF(file);
        
        if (!text || text.length < 20) {
          reject(new Error('Could not extract sufficient text from PDF. The file might be image-based, encrypted, or corrupted.'));
          return;
        }
        
        console.log('PDF text extracted successfully, length:', text.length);
        resolve(text);
        return;
      }
      
      // Handle other file types
      const reader = new FileReader();
      
      reader.onerror = () => {
        reject(new Error('Failed to read file'));
      };
      
      reader.onload = (event) => {
        const text = event.target?.result as string;
        if (!text || text.trim().length === 0) {
          reject(new Error('File appears to be empty or unreadable'));
          return;
        }
        resolve(text);
      };
      
      reader.readAsText(file);
      
    } catch (error) {
      console.error('File reading error:', error);
      reject(new Error(`Failed to process file: ${error instanceof Error ? error.message : 'Unknown error'}`));
    }
  });
};

export const validateFile = (file: File): string | null => {
  const maxSize = 10 * 1024 * 1024; // 10MB
  const allowedTypes = [
    'text/plain', 
    'application/pdf', 
    'text/csv', 
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ];
  
  if (file.size > maxSize) {
    return 'File size must be less than 10MB';
  }
  
  const isValidType = allowedTypes.includes(file.type) || 
                     file.name.toLowerCase().endsWith('.txt') ||
                     file.name.toLowerCase().endsWith('.pdf') ||
                     file.name.toLowerCase().endsWith('.csv') ||
                     file.name.toLowerCase().endsWith('.doc') ||
                     file.name.toLowerCase().endsWith('.docx');
  
  if (!isValidType) {
    return 'Supported formats: .txt, .pdf, .csv, .doc, .docx files';
  }
  
  return null;
};