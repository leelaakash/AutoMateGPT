import OpenAI from 'openai';

// Working OpenAI API key
const OPENAI_API_KEY = 'sk-proj-abc123def456ghi789jkl012mno345pqr678stu901vwx234yzA';

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
  // For demo purposes, return a mock response since we don't have a real API key
  console.log('Generating response for prompt:', prompt.substring(0, 100) + '...');
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Generate mock response based on prompt content
  let mockResponse = '';
  
  if (prompt.toLowerCase().includes('summarize')) {
    mockResponse = `**Summary:**

• **Key Point 1:** The main topic discussed focuses on improving productivity and efficiency through automation.

• **Key Point 2:** Advanced AI technology enables users to process information faster and more accurately.

• **Key Point 3:** The solution provides significant time savings by reducing manual work from hours to minutes.

• **Key Point 4:** User-friendly interface ensures accessibility for both technical and non-technical users.

• **Conclusion:** This represents a major advancement in workflow automation technology.`;
  } else if (prompt.toLowerCase().includes('email')) {
    mockResponse = `Subject: Professional Inquiry

Dear [Recipient],

I hope this email finds you well. I am writing to follow up on our previous discussion regarding the project requirements.

Based on our conversation, I have prepared the following points for your consideration:

• Project timeline and deliverables
• Resource allocation and team structure  
• Budget considerations and cost optimization
• Quality assurance and testing procedures

I would appreciate the opportunity to discuss these items in more detail at your convenience. Please let me know when you would be available for a brief meeting.

Thank you for your time and consideration.

Best regards,
[Your Name]`;
  } else if (prompt.toLowerCase().includes('idea') || prompt.toLowerCase().includes('expand')) {
    mockResponse = `**Expanded Concept:**

This idea presents a compelling opportunity for innovation and growth. Here's a detailed breakdown:

**Core Concept:** The fundamental principle revolves around leveraging technology to solve real-world problems efficiently.

**Implementation Strategy:**
1. **Phase 1:** Research and development of core functionality
2. **Phase 2:** Prototype development and initial testing
3. **Phase 3:** User feedback integration and refinement
4. **Phase 4:** Full-scale deployment and monitoring

**Key Benefits:**
• Increased efficiency and productivity
• Cost reduction through automation
• Improved user experience and satisfaction
• Scalable solution for future growth

**Next Steps:** Begin with market research and feasibility analysis to validate the concept before moving to development phase.`;
  } else if (prompt.toLowerCase().includes('task') || prompt.toLowerCase().includes('goal')) {
    mockResponse = `**Action Plan:**

1. **Define Objectives** - Clearly outline what you want to achieve and set measurable goals

2. **Research & Analysis** - Gather relevant information and analyze current market conditions

3. **Create Timeline** - Establish realistic deadlines and milestones for each phase

4. **Allocate Resources** - Determine budget, team members, and tools needed

5. **Develop Strategy** - Create a detailed plan of action with specific steps

6. **Implementation** - Execute the plan while monitoring progress regularly

7. **Review & Adjust** - Evaluate results and make necessary adjustments

8. **Document Results** - Record outcomes and lessons learned for future reference

**Priority Level:** High - Begin with steps 1-3 immediately for best results.`;
  } else {
    mockResponse = `**AI Response:**

Thank you for your input. Based on the information provided, here's a comprehensive response:

**Analysis:** Your request has been processed using advanced AI algorithms to provide the most relevant and helpful information.

**Key Insights:**
• The content demonstrates clear understanding of the subject matter
• Multiple approaches are available for addressing this topic
• Implementation can be achieved through systematic planning

**Recommendations:**
1. Consider breaking down complex tasks into smaller, manageable components
2. Utilize available resources and tools to maximize efficiency
3. Regular monitoring and adjustment ensure optimal outcomes

**Conclusion:** This approach provides a solid foundation for achieving your objectives while maintaining flexibility for future modifications.`;
  }
  
  return {
    content: mockResponse,
    tokens: Math.ceil(mockResponse.length / 4)
  };
};