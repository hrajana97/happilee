import { OpenAI } from 'openai';
import { NextResponse } from 'next/server';
import type { BudgetData, BudgetPreferences, BudgetCategory } from '@/types/budget';
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

// Helper function to get all categories and their totals
function getCategoryTotals(categories: BudgetCategory[]) {
  const total = categories.reduce((sum, cat) => sum + cat.estimatedCost, 0);
  const breakdown = categories.map(cat => ({
    name: cat.name,
    amount: cat.estimatedCost,
    percentage: Math.round((cat.estimatedCost / total) * 100)
  }));
  return { total, breakdown };
}

// Helper function to parse budget changes from the message
function parseBudgetChanges(message: string, budgetData: BudgetData): Partial<BudgetData> {
  const changes: Partial<BudgetData> = {};
  const lowerMessage = message.toLowerCase();

  // Check if we need to verify category totals
  if (lowerMessage.includes('add up') || lowerMessage.includes('total') || lowerMessage.includes('verify')) {
    const categories = budgetData.calculatedBudget?.categories || [];
    const { total, breakdown } = getCategoryTotals(categories);
    
    // Create a message showing the breakdown
    const breakdownMessage = `Current budget breakdown:\n` +
      breakdown.map(cat => `• ${cat.name}: $${cat.amount.toLocaleString()} (${cat.percentage}%)`).join('\n') +
      `\n\nTotal from all categories: $${total.toLocaleString()}`;
    
    changes.verificationMessage = breakdownMessage;
    return changes;
  }

  // Extract amount and category from message
  const amountMatch = message.match(/\$?(\d+(?:,\d{3})*(?:\.\d{2})?)/);
  const amount = amountMatch ? parseFloat(amountMatch[1].replace(/,/g, '')) : 0;

  // Find the category being modified
  const categories = [...(budgetData.calculatedBudget?.categories || [])];
  
  for (const category of categories) {
    const categoryName = category.name.toLowerCase();
    const categoryId = category.id.toLowerCase();
    
    // Check both name and ID to ensure we catch all variations
    if (lowerMessage.includes(categoryName) || lowerMessage.includes(categoryId)) {
      const categoryIndex = categories.findIndex(c => c.id === category.id);
      if (categoryIndex !== -1) {
        const originalAmount = categories[categoryIndex].estimatedCost;
        let newAmount = originalAmount;
        
        if (lowerMessage.includes('increase') || lowerMessage.includes('add')) {
          newAmount = originalAmount + amount;
        } else if (lowerMessage.includes('decrease') || lowerMessage.includes('reduce')) {
          newAmount = Math.max(0, originalAmount - amount);
        } else if (lowerMessage.includes('set') || lowerMessage.includes('change to')) {
          newAmount = amount;
        }

        // Update the category
        categories[categoryIndex] = {
          ...categories[categoryIndex],
          estimatedCost: newAmount,
          remaining: newAmount,
          actualCost: categories[categoryIndex].actualCost || 0
        };
        
        // Recalculate percentages for all categories
        const { total, breakdown } = getCategoryTotals(categories);
        categories.forEach((cat, index) => {
          cat.percentage = breakdown[index].percentage;
        });

        // Create a complete budget update
        changes.totalBudget = total;
        changes.budget = total;
        changes.calculatedBudget = {
          ...budgetData.calculatedBudget,
          categories: categories,
          rationale: {
            ...budgetData.calculatedBudget.rationale,
            totalBudget: total.toString(),
            notes: [
              ...budgetData.calculatedBudget.rationale.notes,
              `Updated ${category.name} budget from $${originalAmount} to $${newAmount}`
            ]
          }
        };
        
        break;
      }
    }
  }

  return changes;
}

export async function POST(request: Request) {
  try {
    const { message, budgetData, conversationHistory } = await request.json();
    const openai = await getOpenAIClient();

    // Parse budget changes first
    const budgetChanges = parseBudgetChanges(message, budgetData);
    
    // If this was a verification request, return the breakdown
    if (budgetChanges.verificationMessage) {
      return NextResponse.json({
        message: budgetChanges.verificationMessage,
        budgetUpdates: null
      });
    }

    const updatedBudgetData = {
      ...budgetData,
      ...budgetChanges
    };

    // Find the affected category for the response
    let categoryInfo = null;
    if (budgetChanges.calculatedBudget?.categories) {
      const lowerMessage = message.toLowerCase();
      categoryInfo = budgetChanges.calculatedBudget.categories.find(cat => 
        lowerMessage.includes(cat.name.toLowerCase()) || lowerMessage.includes(cat.id.toLowerCase())
      );
    }

    const systemPrompt = `You are a concise and helpful wedding budget assistant. You have access to the user's wedding budget data and can help them understand their budget, make adjustments, and provide recommendations.

Current Budget Information:
- Total Budget: ${updatedBudgetData.totalBudget}
- Guest Count: ${updatedBudgetData.guestCount}
- Location: ${updatedBudgetData.location.city}, ${updatedBudgetData.location.state}
- Wedding Date: ${updatedBudgetData.location.weddingDate}

${categoryInfo ? `Category Information:
- Name: ${categoryInfo.name}
- Current Budget: $${categoryInfo.estimatedCost}
- Percentage of Total: ${categoryInfo.percentage}%` : ''}

When confirming budget changes, be specific and clear:
1. Show the original amount
2. Show the new amount
3. Show the difference
4. Explain any impacts on other categories
5. Format all amounts as currency

Example response for budget changes:
"I've updated your catering budget:
• Original budget: $X
• New budget: $Y
• Change: +$Z

This represents N% of your total budget."`;

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

    return NextResponse.json({
      message: response.choices[0].message.content,
      budgetUpdates: budgetChanges
    });

  } catch (error) {
    console.error('Budget Assistant Error:', error);
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    );
  }
} 