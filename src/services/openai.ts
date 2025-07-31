import OpenAI from 'openai';

// Note: In production, this should be stored securely and not exposed in client-side code
// For demo purposes, we'll use environment variables or user-provided keys
let openaiClient: OpenAI | null = null;

export const initializeOpenAI = (apiKey: string) => {
  try {
    openaiClient = new OpenAI({
      apiKey,
      dangerouslyAllowBrowser: true
    });
    return true;
  } catch (error) {
    console.error('OpenAI client initialization failed:', error);
    return false;
  }
};

export const generateResponse = async (
  prompt: string,
  model: string = 'gpt-3.5-turbo',
  maxTokens: number = 1000
): Promise<{ content: string; tokens: number }> => {
  // If no API key is configured, try with a demo key first
  if (!openaiClient) {
    // Try to initialize with a demo key for testing
    const demoKey = 'sk-proj-demo-key-for-testing-purposes-only';
    initializeOpenAI(demoKey);
  }

  try {
    if (!openaiClient) {
      throw new Error('OpenAI client not initialized. Please provide a valid API key.');
    }

    console.log('Sending request to OpenAI API...');
    console.log('Model:', model);
    console.log('Max tokens:', maxTokens);
    console.log('Prompt preview:', prompt.substring(0, 100) + '...');

    const completion = await openaiClient.chat.completions.create({
      model: model,
      messages: [
        {
          role: 'system',
          content: 'You are a helpful AI assistant that provides accurate, well-structured responses. Format your responses with clear headings, bullet points, and proper structure when appropriate.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      max_tokens: maxTokens,
      temperature: 0.7,
    });

    const content = completion.choices[0]?.message?.content || 'No response generated';
    const tokens = completion.usage?.total_tokens || 0;

    console.log('OpenAI API response received successfully');
    console.log('Response preview:', content.substring(0, 100) + '...');
    console.log('Tokens used:', tokens);

    return {
      content,
      tokens
    };
  } catch (error: any) {
    console.error('OpenAI API Error:', error);
    
    // Provide more specific error messages
    if (error?.error?.code === 'invalid_api_key') {
      throw new Error('Invalid API key. Please check your OpenAI API key in settings.');
    } else if (error?.error?.code === 'insufficient_quota') {
      throw new Error('API quota exceeded. Please check your OpenAI account billing.');
    } else if (error?.error?.code === 'rate_limit_exceeded') {
      throw new Error('Rate limit exceeded. Please try again in a moment.');
    } else if (error?.message?.includes('fetch')) {
      throw new Error('Network error. Please check your internet connection.');
    } else {
      throw new Error(`OpenAI API Error: ${error?.message || 'Unknown error occurred'}`);
    }
  }
};

// Fallback function with improved mock responses for when API is not available
export const generateFallbackResponse = async (
  prompt: string,
  maxTokens: number = 1000
): Promise<{ content: string; tokens: number }> => {
  console.log('Using fallback response generation...');
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  const lowerPrompt = prompt.toLowerCase();
  let response = '';
  
  if (lowerPrompt.includes('summarize') || lowerPrompt.includes('summary')) {
    response = generateSummaryResponse(prompt);
  } else if (lowerPrompt.includes('email') || lowerPrompt.includes('write')) {
    response = generateEmailResponse(prompt);
  } else if (lowerPrompt.includes('expand') || lowerPrompt.includes('idea')) {
    response = generateIdeaExpansionResponse(prompt);
  } else if (lowerPrompt.includes('task') || lowerPrompt.includes('goal') || lowerPrompt.includes('plan')) {
    response = generateTaskListResponse(prompt);
  } else {
    response = generateGenericResponse(prompt);
  }
  
  return {
    content: response,
    tokens: Math.ceil(response.length / 4)
  };
};

const generateSummaryResponse = (prompt: string): string => {
  const content = extractContentFromPrompt(prompt);
  return `# Document Summary

## Key Points:
• **Main Topic**: ${analyzeMainTopic(content)}
• **Primary Focus**: ${analyzePrimaryFocus(content)}
• **Important Details**: ${extractImportantDetails(content)}
• **Conclusions**: ${extractConclusions(content)}

## Executive Summary:
${generateExecutiveSummary(content)}

## Action Items:
${generateActionItems(content)}

---
*This summary was generated based on the provided content. For more detailed analysis, please provide additional context.*`;
};

const generateEmailResponse = (prompt: string): string => {
  const points = extractBulletPoints(prompt);
  return `Subject: ${generateEmailSubject(prompt)}

Dear [Recipient Name],

I hope this email finds you well. I am writing to follow up on our recent discussion and provide you with the requested information.

${formatEmailBody(points)}

Please let me know if you need any additional information or if you would like to schedule a meeting to discuss this further.

Thank you for your time and consideration.

Best regards,
[Your Name]
[Your Title]
[Contact Information]`;
};

const generateIdeaExpansionResponse = (prompt: string): string => {
  const idea = extractMainIdea(prompt);
  return `# Expanded Concept: ${idea}

## Overview:
${generateIdeaOverview(idea)}

## Implementation Strategy:
1. **Research & Planning Phase**
   - Market analysis and feasibility study
   - Resource requirement assessment
   - Timeline development

2. **Development Phase**
   - Prototype creation and testing
   - Iterative improvement process
   - Quality assurance measures

3. **Launch Phase**
   - Deployment strategy
   - Marketing and promotion
   - Performance monitoring

## Benefits:
• ${generateBenefits(idea)}

## Potential Challenges:
• ${generateChallenges(idea)}

## Next Steps:
${generateNextSteps(idea)}`;
};

const generateTaskListResponse = (prompt: string): string => {
  const goal = extractGoal(prompt);
  return `# Action Plan: ${goal}

## Immediate Tasks (Week 1-2):
1. **Define Objectives** - Clearly outline specific, measurable goals
2. **Resource Assessment** - Identify required tools, budget, and personnel
3. **Timeline Creation** - Establish realistic deadlines and milestones
4. **Stakeholder Identification** - List key people who need to be involved

## Short-term Tasks (Month 1):
5. **Research Phase** - Gather relevant information and best practices
6. **Strategy Development** - Create detailed implementation plan
7. **Team Assembly** - Recruit or assign necessary team members
8. **Initial Setup** - Prepare workspace, tools, and systems

## Long-term Tasks (Months 2-3):
9. **Implementation** - Execute the main components of the plan
10. **Monitoring & Adjustment** - Track progress and make necessary changes
11. **Quality Control** - Ensure standards are met throughout the process
12. **Documentation** - Record processes and outcomes for future reference

## Success Metrics:
- ${generateSuccessMetrics(goal)}

## Risk Mitigation:
- ${generateRiskMitigation(goal)}`;
};

const generateGenericResponse = (prompt: string): string => {
  return `# AI Analysis & Response

## Understanding Your Request:
Based on your input, I've analyzed the key components and requirements to provide you with a comprehensive response.

## Key Insights:
• **Primary Focus**: ${analyzePrimaryFocus(prompt)}
• **Context Analysis**: ${analyzeContext(prompt)}
• **Recommended Approach**: ${recommendApproach(prompt)}

## Detailed Response:
${generateDetailedResponse(prompt)}

## Recommendations:
1. **Immediate Actions**: ${generateImmediateActions(prompt)}
2. **Long-term Strategy**: ${generateLongTermStrategy(prompt)}
3. **Best Practices**: ${generateBestPractices(prompt)}

## Additional Considerations:
${generateAdditionalConsiderations(prompt)}

---
*This response was generated based on your specific input. Please let me know if you need clarification on any points or would like me to expand on specific areas.*`;
};

// Helper functions for content analysis
const extractContentFromPrompt = (prompt: string): string => {
  return prompt.replace(/summarize the following text|summarize this|please summarize/gi, '').trim();
};

const analyzeMainTopic = (content: string): string => {
  const words = content.toLowerCase().split(/\s+/);
  const commonWords = ['the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by'];
  const significantWords = words.filter(word => word.length > 4 && !commonWords.includes(word));
  return significantWords.slice(0, 3).join(', ') || 'General discussion';
};

const analyzePrimaryFocus = (content: string): string => {
  if (content.toLowerCase().includes('business')) return 'Business strategy and operations';
  if (content.toLowerCase().includes('technology')) return 'Technology implementation and innovation';
  if (content.toLowerCase().includes('project')) return 'Project management and execution';
  if (content.toLowerCase().includes('marketing')) return 'Marketing and customer engagement';
  return 'Process improvement and optimization';
};

const extractImportantDetails = (content: string): string => {
  const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 20);
  return sentences.slice(0, 2).join('. ') || 'Key operational details and requirements';
};

const extractConclusions = (content: string): string => {
  const sentences = content.split(/[.!?]+/);
  const lastSentences = sentences.slice(-2).join('. ');
  return lastSentences || 'Strategic outcomes and expected results';
};

const generateExecutiveSummary = (content: string): string => {
  return `This document outlines important information regarding ${analyzeMainTopic(content)}. The content emphasizes ${analyzePrimaryFocus(content)} and provides detailed insights into the implementation process. Key stakeholders should review the recommendations and consider the proposed timeline for optimal results.`;
};

const generateActionItems = (content: string): string => {
  return `• Review and validate the proposed approach\n• Identify required resources and budget allocation\n• Establish timeline and assign responsibilities\n• Schedule follow-up meetings with key stakeholders`;
};

const extractBulletPoints = (prompt: string): string[] => {
  const lines = prompt.split('\n').filter(line => line.trim().length > 0);
  return lines.length > 1 ? lines : ['Follow up on our previous discussion', 'Provide requested information', 'Schedule next meeting'];
};

const generateEmailSubject = (prompt: string): string => {
  if (prompt.toLowerCase().includes('meeting')) return 'Meeting Follow-up and Next Steps';
  if (prompt.toLowerCase().includes('project')) return 'Project Update and Requirements';
  if (prompt.toLowerCase().includes('proposal')) return 'Proposal Review and Feedback';
  return 'Follow-up on Our Recent Discussion';
};

const formatEmailBody = (points: string[]): string => {
  return points.map((point, index) => `${index + 1}. ${point.replace(/^[•\-\*]\s*/, '')}`).join('\n');
};

const extractMainIdea = (prompt: string): string => {
  const cleanPrompt = prompt.replace(/expand this idea|expand on|please expand/gi, '').trim();
  return cleanPrompt.split('.')[0] || 'Innovation and Development Initiative';
};

const generateIdeaOverview = (idea: string): string => {
  return `This concept focuses on ${idea.toLowerCase()}. The initiative aims to create value through innovative approaches and strategic implementation. By leveraging current market opportunities and addressing existing challenges, this idea has the potential to deliver significant impact and sustainable results.`;
};

const generateBenefits = (idea: string): string => {
  return `Increased efficiency and productivity\n• Cost reduction through optimization\n• Enhanced user experience and satisfaction\n• Competitive advantage in the market\n• Scalable solution for future growth`;
};

const generateChallenges = (idea: string): string => {
  return `Resource allocation and budget constraints\n• Technical implementation complexity\n• Market acceptance and adoption timeline\n• Competition and market saturation\n• Regulatory compliance requirements`;
};

const generateNextSteps = (idea: string): string => {
  return `1. Conduct detailed feasibility analysis\n2. Develop comprehensive business plan\n3. Secure necessary funding and resources\n4. Assemble project team and assign roles\n5. Create detailed implementation timeline`;
};

const extractGoal = (prompt: string): string => {
  const cleanPrompt = prompt.replace(/create a task list|make tasks|generate tasks/gi, '').trim();
  return cleanPrompt.split('.')[0] || 'Achievement of Strategic Objectives';
};

const generateSuccessMetrics = (goal: string): string => {
  return `Completion rate of planned tasks\n- Quality scores and stakeholder satisfaction\n- Timeline adherence and budget compliance\n- ROI and performance indicators`;
};

const generateRiskMitigation = (goal: string): string => {
  return `Regular progress reviews and status updates\n- Contingency planning for potential obstacles\n- Clear communication channels and escalation procedures\n- Resource backup plans and alternative approaches`;
};

const analyzeContext = (prompt: string): string => {
  if (prompt.length < 50) return 'Brief inquiry requiring detailed explanation';
  if (prompt.length < 200) return 'Moderate complexity request with specific requirements';
  return 'Comprehensive request requiring detailed analysis and structured response';
};

const recommendApproach = (prompt: string): string => {
  return 'Systematic analysis with structured implementation plan';
};

const generateDetailedResponse = (prompt: string): string => {
  return `Based on the provided information, the most effective approach involves a multi-phase strategy that addresses both immediate needs and long-term objectives. This includes thorough planning, resource allocation, and continuous monitoring to ensure optimal outcomes.`;
};

const generateImmediateActions = (prompt: string): string => {
  return 'Define clear objectives and success criteria';
};

const generateLongTermStrategy = (prompt: string): string => {
  return 'Develop sustainable processes and continuous improvement mechanisms';
};

const generateBestPractices = (prompt: string): string => {
  return 'Regular communication, documentation, and stakeholder engagement';
};

const generateAdditionalConsiderations = (prompt: string): string => {
  return `Consider potential challenges and prepare contingency plans. Ensure all stakeholders are aligned on objectives and timelines. Regular review and adjustment of the approach may be necessary based on changing circumstances and feedback.`;
};