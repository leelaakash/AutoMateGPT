import { WorkflowTemplate } from '../types';

export const WORKFLOW_TEMPLATES: WorkflowTemplate[] = [
  {
    id: 'summarizer',
    title: 'PDF/Text Summarizer',
    emoji: '📄',
    description: 'Upload or paste text to get a concise summary with key points',
    placeholder: 'Paste your text here or upload a file...',
    prompt: 'Summarize the following text in 3-5 key points, making it concise and easy to understand:\n\n{input}'
  },
  {
    id: 'email_writer',
    title: 'Email Generator',
    emoji: '📨',
    description: 'Turn bullet points into professional, well-structured emails',
    placeholder: 'Enter bullet points for your email...',
    prompt: 'Write a professional email based on these points:\n{input}\n\nMake it polite, concise, and well-structured with proper greeting and closing.'
  },
  {
    id: 'idea_expander',
    title: 'Idea Expander',
    emoji: '🧠',
    description: 'Transform one-line ideas into detailed, actionable paragraphs',
    placeholder: 'Enter your idea...',
    prompt: 'Expand this idea into a detailed paragraph with actionable insights and practical steps:\n{input}'
  },
  {
    id: 'task_creator',
    title: 'Task List Creator',
    emoji: '✅',
    description: 'Convert goals into specific, actionable task lists',
    placeholder: 'Enter your goal...',
    prompt: 'Create a numbered task list to achieve this goal:\n{input}\n\nMake tasks specific, actionable, and ordered by priority.'
  },
  {
    id: 'custom_prompt',
    title: 'Custom Prompt',
    emoji: '🔁',
    description: 'Use any custom prompt for flexible AI assistance',
    placeholder: 'Enter your custom prompt...',
    prompt: '{input}'
  }
];