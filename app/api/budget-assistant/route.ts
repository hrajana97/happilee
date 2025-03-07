import { OpenAI } from 'openai';
import { NextResponse } from 'next/server';
import type { BudgetData } from '@/types/budget';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export async function POST(request: Request) {
  try {
    const { message, budgetData, conversationHistory } = await request.json();

    const systemPrompt = `You are a helpful wedding budget assistant. You have access to the user's wedding budget data and can help them understand their budget, make adjustments, and provide recommendations.

Current Budget Information:
- Total Budget: ${budgetData.totalBudget}
- Guest Count: ${budgetData.guestCount}
- Location: ${budgetData.location.city}, ${budgetData.location.state}
- Wedding Date: ${budgetData.location.weddingDate}

You can:
1. Explain budget allocations and rationale
2. Suggest cost-saving measures
3. Provide industry insights and averages
4. Help with vendor negotiations
5. Answer general wedding budget questions

Keep responses concise, practical, and specific to their budget data.`;

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
      max_tokens: 500
    });

    const assistantMessage = response.choices[0].message.content;
    
    // Parse any budget updates from the assistant's response
    // This is a placeholder - you might want to implement more sophisticated parsing
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