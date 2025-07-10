import OpenAI from 'openai';
import { Comment } from './youtube';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
    baseURL: 'https://api.deepseek.com/v1',
});

export interface AnalysisResult {
  overview: {
    totalComments: number;
    averageEngagement: number;
    topSentiment: string;
  };
  frequentQuestions: Array<{
    question: string;
    count: number;
    examples: string[];
  }>;
  painPoints: Array<{
    issue: string;
    severity: 'low' | 'medium' | 'high';
    examples: string[];
  }>;
  contentRequests: Array<{
    topic: string;
    interest: number;
    examples: string[];
  }>;
  emotions: Array<{
    emotion: string;
    percentage: number;
    examples: string[];
  }>;
  learningTopics: Array<{
    topic: string;
    demand: number;
    examples: string[];
  }>;
  misconceptions: Array<{
    misconception: string;
    prevalence: number;
    examples: string[];
  }>;
  videoIdeas: Array<{
    title: string;
    description: string;
    estimatedInterest: number;
    category: 'FAQ' | 'Tutorial' | 'Deep Dive' | 'Problem Solving';
  }>;
}

export async function analyzeComments(comments: Comment[]): Promise<AnalysisResult> {
  const commentTexts = comments.map(c => c.text).join('\n---\n');

  const prompt = `
Analyze these YouTube comments and provide insights for content creators. Focus on actionable intelligence.

Comments:
${commentTexts}

Please analyze and return a JSON response with the following structure:

{
  "overview": {
    "totalComments": number,
    "averageEngagement": number (0-100),
    "topSentiment": "positive" | "negative" | "neutral"
  },
  "frequentQuestions": [
    {
      "question": "clear question format",
      "count": number,
      "examples": ["example comment 1", "example comment 2"]
    }
  ],
  "painPoints": [
    {
      "issue": "clear description of problem",
      "severity": "low" | "medium" | "high",
      "examples": ["example comment"]
    }
  ],
  "contentRequests": [
    {
      "topic": "requested topic",
      "interest": number (1-10),
      "examples": ["example comment"]
    }
  ],
  "emotions": [
    {
      "emotion": "frustrated" | "excited" | "confused" | "satisfied",
      "percentage": number,
      "examples": ["example comment"]
    }
  ],
  "learningTopics": [
    {
      "topic": "topic people want to learn",
      "demand": number (1-10),
      "examples": ["example comment"]
    }
  ],
  "misconceptions": [
    {
      "misconception": "what people misunderstand",
      "prevalence": number (1-10),
      "examples": ["example comment"]
    }
  ],
  "videoIdeas": [
    {
      "title": "specific, actionable video title",
      "description": "brief description of video content",
      "estimatedInterest": number (1-10),
      "category": "FAQ" | "Tutorial" | "Deep Dive" | "Problem Solving"
    }
  ]
}

Focus on:
- Identifying patterns across comments
- Providing specific, actionable video ideas
- Using clear, jargon-free language
- Prioritizing insights that help creators make better content
- Ensuring all examples are brief but representative
`;

  try {
    const response = await openai.chat.completions.create({
      model: 'deepseek-chat',
      messages: [
        {
          role: 'system',
          content: 'You are an expert content strategist who helps YouTube creators understand their audience and generate content ideas. Return only valid JSON.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.3,
      max_tokens: 4000,
    });

    const content = response.choices[0]?.message?.content?.replace(/^\s*```json/, '').replace(/```$/, '').trim();
    if (!content) {
      throw new Error('No response from AI');
    }

    return JSON.parse(content);
  } catch (error) {
    console.error('Error analyzing comments:', error);
    throw error;
  }
}
