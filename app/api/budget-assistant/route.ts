import { OpenAI } from 'openai';
import { NextResponse } from 'next/server';
import type { BudgetData } from '@/types/budget';
import { getOpenAIKey } from '@/utils/aws-params';

// Initialize OpenAI client with async key fetching
let openaiClient: OpenAI | null = null;

async function getOpenAIClient() {
  if (!openaiClient) {
    const apiKey = await getOpenAIKey();
    if (!apiKey) {
      throw new Error('Failed to get OpenAI API key');
    }
    openaiClient = new OpenAI({ apiKey });
  }
  return openaiClient;
}

export async function POST(request: Request) {
  try {
    const { message, budgetData, conversationHistory } = await request.json();
    const openai = await getOpenAIClient();

    const systemPrompt = `You are a concise and helpful wedding budget assistant. You have access to the user's wedding budget data and can help them understand their budget, make adjustments, and provide recommendations.

Current Budget Information:
- Total Budget: ${budgetData.totalBudget}
- Guest Count: ${budgetData.guestCount}
- Location: ${budgetData.location.city}, ${budgetData.location.state}
- Wedding Date: ${budgetData.location.weddingDate}

Response Guidelines:
1. Keep responses under 3 short paragraphs
2. Use bullet points for lists
3. Format numbers as currency when discussing costs
4. Break up text with line breaks for readability
5. Be direct and practical
6. If suggesting cost savings, list specific amounts or percentages

Example format:
"Your catering budget is $X for Y guests.

Here are some ways to optimize:
• Option 1: Save $X by [specific action]
• Option 2: Reduce costs by X% by [specific action]

Remember: Focus on high-impact changes first."`;

    const response = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        { role: "system", content: systemPrompt },
        ...conversationHistory.map((msg: any) => ({
          role: msg.role,
          content: msg.content
        })),
        { role: "user", content: message }
      ],
      temperature: 0.7,
      max_tokens: 300, // Limiting response length
      presence_penalty: 0.6, // Encourages more focused responses
      frequency_penalty: 0.3 // Reduces repetition
    });

    const assistantMessage = response.choices[0].message.content;
    
    // Parse any budget updates from the assistant's response
    const budgetUpdates: Partial<BudgetData> = {};

    return NextResponse.json({
      message: assistantMessage,
      budgetUpdates
    });

  } catch (error) {
    console.error('Budget Assistant Error:', error);
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    );
  }
} 