import { OpenAI } from 'openai';
import { NextResponse } from 'next/server';
import type { BudgetData, BudgetPreferences } from '@/types/budget';
import { getOpenAIKey } from '@/utils/aws-params';
import budgetStorage from '@/lib/budget-storage';

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

// Helper function to parse preference changes from the message
function parsePreferenceChanges(message: string): Partial<BudgetPreferences> {
  const changes: Partial<BudgetPreferences> = {};
  const lowerMessage = message.toLowerCase();
  
  // Check for floral style changes
  if (lowerMessage.includes('artificial flowers')) {
    changes.floralStyle = 'Artificial Flowers (Budget-Friendly)';
  } else if (lowerMessage.includes('fresh flowers')) {
    changes.floralStyle = 'Fresh Flowers (Premium)';
  } else if (lowerMessage.includes('mixed flowers')) {
    changes.floralStyle = 'Mixed Fresh & Artificial';
  }

  // Check for transportation type changes
  if (lowerMessage.includes('standard sedan')) {
    changes.transportationType = 'Standard sedan';
  } else if (lowerMessage.includes('luxury sedan')) {
    changes.transportationType = 'Luxury Sedan';
  } else if (lowerMessage.includes('suv')) {
    changes.transportationType = 'SUV';
  } else if (lowerMessage.includes('limo')) {
    changes.transportationType = 'Limo';
  } else if (lowerMessage.includes('party bus')) {
    changes.transportationType = 'Party Bus';
  }

  // Check for catering style changes
  if (lowerMessage.includes('plated service')) {
    changes.cateringStyle = 'Plated Service (+30% over buffet)';
  } else if (lowerMessage.includes('buffet service')) {
    changes.cateringStyle = 'Buffet Service (Base Rate)';
  } else if (lowerMessage.includes('family style')) {
    changes.cateringStyle = 'Family Style (+20% over buffet)';
  } else if (lowerMessage.includes('food stations')) {
    changes.cateringStyle = 'Food Stations (+15% over buffet)';
  }

  // Check for bar service changes
  if (lowerMessage.includes('open bar')) {
    changes.barService = 'Open Bar';
  } else if (lowerMessage.includes('beer and wine only')) {
    changes.barService = 'Beer & Wine Only';
  } else if (lowerMessage.includes('cash bar')) {
    changes.barService = 'Cash Bar';
  } else if (lowerMessage.includes('no alcohol')) {
    changes.barService = 'No Alcohol';
  }

  // Check for music choice changes
  if (lowerMessage.includes('dj')) {
    changes.musicChoice = 'DJ';
  } else if (lowerMessage.includes('band')) {
    changes.musicChoice = 'Band';
  } else if (lowerMessage.includes('both dj and band')) {
    changes.musicChoice = 'Both DJ & Band';
  } else if (lowerMessage.includes('playlist')) {
    changes.musicChoice = 'No Live Music (Playlist)';
  }

  // Check for beauty style changes
  if (lowerMessage.includes('diy beauty')) {
    changes.beautyStyle = 'DIY';
  } else if (lowerMessage.includes('bride only')) {
    changes.beautyStyle = 'Bride Only';
  } else if (lowerMessage.includes('bride and party')) {
    changes.beautyStyle = 'Bride and Party';
  }

  // Check for stationery type changes
  if (lowerMessage.includes('digital stationery')) {
    changes.stationeryType = 'Digital Only';
  } else if (lowerMessage.includes('printed stationery')) {
    changes.stationeryType = 'Printed Only';
  } else if (lowerMessage.includes('both digital and print')) {
    changes.stationeryType = 'Both Digital & Print';
  }

  return changes;
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
7. When making changes, explain the impact on the budget
8. For preference changes, explain:
   • The cost difference
   • Any trade-offs or considerations
   • How it affects the overall budget

Example responses:

For preference changes:
"I've updated your floral style to artificial flowers. This change will:
• Save approximately 40% on your floral budget
• Provide more durability and flexibility in planning
• Allow for more elaborate arrangements at a lower cost

Your floral budget has been adjusted from $X to $Y."

For general questions:
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
      max_tokens: 300,
      presence_penalty: 0.6,
      frequency_penalty: 0.3
    });

    const assistantMessage = response.choices[0].message.content;
    
    // Parse any preference changes from the message
    const preferenceChanges = parsePreferenceChanges(message);
    
    // If there are preference changes, recalculate the budget
    let budgetUpdates: Partial<BudgetData> = {};
    if (Object.keys(preferenceChanges).length > 0) {
      const updatedPreferences: BudgetPreferences = {
        ...(budgetData.preferences || {}),
        ...preferenceChanges
      };

      const calculatedBudget = budgetStorage.calculateBudget(
        budgetData.guestCount,
        budgetData.location,
        budgetData.priorities,
        updatedPreferences
      );

      budgetUpdates = {
        preferences: updatedPreferences,
        calculatedBudget,
        categories: calculatedBudget.categories,
        rationale: calculatedBudget.rationale
      };
    }

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