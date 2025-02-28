# Happilee - Wedding Planning Application

## Overview
Happilee is a modern wedding planning application that helps couples plan their perfect wedding using AI-powered tools and expert guidance. The application provides features for budget management, moodboard creation, vendor management, and more.

## Architecture

### Tech Stack
- **Frontend**: Next.js 13+ with App Router
- **UI Components**: Shadcn/UI with Tailwind CSS
- **State Management**: React Hooks and Local Storage
- **Styling**: Tailwind CSS with custom sage-themed color palette

### Key Components

#### Budget Management
- `app/dashboard/budget/page.tsx`: Budget questionnaire and initial setup
- `app/budget-breakdown/page.tsx`: Detailed budget breakdown and management
- `lib/budget-storage.ts`: Budget calculation and storage logic

Key features:
- Dynamic budget calculation based on location, guest count, and preferences
- Real-time budget adjustments with category-level editing
- Cost range validation and warnings
- Export functionality (CSV/Excel)

Budget Calculation Factors:
1. **Location Cost Factors**
   - Major cities have specific multipliers (e.g., San Francisco: 2.0x, New York: 2.0x)
   - International destinations have unique factors (e.g., Paris: 2.2x, London: 2.3x)
   - Default US locations: 1.0x

2. **Seasonal Factors**
   - Peak season (June-September): 1.2x
   - Shoulder season (April-May, October): 1.1x
   - Off season (November-March): 1.0x

3. **Service Style Multipliers**
   - Catering: Plated (1.3x), Buffet (1.0x), Family Style (1.2x)
   - Bar Service: Full Open Bar (1.3x), Beer & Wine (0.8x), No Alcohol (0x)
   - Photography: Both Photo & Video (1.5x), Photo Only (1.0x)
   - Floral Style: Elaborate (1.5x), Modern Minimalist (0.9x)
   - Music: Live Band (1.8x), DJ (1.0x), Playlist Only (0.2x)

4. **Guest Count Scaling**
   - Different categories scale differently with guest count:
     - Catering: 80% variable, 10% fixed, 10% staffing
     - Venue: 70% fixed, 20% variable, 10% staffing
     - Photography: 80% fixed, 10% variable, 10% staffing
   - Staffing factors increase with guest count:
     - ≤50 guests: 1.0x
     - 51-100 guests: 1.2x
     - 101-150 guests: 1.4x
     - 151-200 guests: 1.6x
     - 201-300 guests: 1.8x
     - >300 guests: 2.0x

Budget Categories:
- Venue
- Catering
- Photography
- Attire
- Flowers
- Entertainment
- Stationery
- Favors
- Transportation

Each category includes:
- Percentage of total budget
- Estimated cost range (min/typical/max)
- Priority level (high/medium/low)
- Budgeting tips
- Cost breakdown explanation
- Scaling rationale

#### Moodboard System
- `app/dashboard/moodboard/[category]/page.tsx`: Category-specific moodboards
- `components/moodboard/swipe-card.tsx`: Tinder-style image swiping
- `components/moodboard/color-palette.tsx`: Color palette management

Features:
- Swipeable interface for style selection
- Automatic color palette generation
- Tag-based organization
- Share and collaboration features

Moodboard Categories:
1. **Decor & Florals**
   - Style options: Modern Minimalist, Romantic Garden, Bohemian Wildflowers, etc.
   - Color palette extraction from selected images
   - Automatic style description generation
   - Budget impact suggestions

2. **Venue**
   - Indoor/Outdoor categorization
   - Venue style matching
   - Capacity and location filtering
   - Seasonal availability indicators

3. **Haldi**
   - Traditional elements
   - Modern interpretations
   - Cultural significance notes
   - Color scheme suggestions

4. **Reception**
   - Layout options
   - Lighting schemes
   - Entertainment spaces
   - Guest flow considerations

Image Management:
- Automatic color palette extraction
- Style categorization
- User tagging system
- Favorites collection
- Share functionality with copy-to-clipboard

User Interface Features:
- Keyboard navigation (left/right arrows)
- Touch gestures for mobile
- Responsive grid layouts
- Progressive image loading
- Hover states with metadata
- Dialog-based sharing

Data Structures:
```typescript
interface FlowerImage {
  id: string
  url: string
  style: string
  description: string
  colors: string[]
}

interface ColorPalette {
  primary: string
  secondary: string
  accent: string[]
}

type MoodboardCategory = {
  id: string
  name: string
  coverImage: string
}
```

### Data Models

#### Budget Data Structure
```typescript
interface BudgetData {
  totalBudget: number;
  location: {
    city: string;
    state?: string;
    country: string;
    isDestination: boolean;
  };
  guestCount: number;
  categories: BudgetCategory[];
  calculatedBudget: {
    categories: BudgetCategory[];
    rationale: {
      totalBudget: string;
      locationFactor: number;
      seasonalFactor: number;
      notes: string[];
    };
  };
}
```

#### User Data Structure
```typescript
interface UserData {
  name: string;
  partnerName?: string;
  weddingDate: string;
  budget: number;
  guestCount: number;
  calculatedBudget?: any;
}
```

#### Moodboard Data Structures
```typescript
interface FlowerImage {
  id: string;
  url: string;
  style: string;
  description: string;
  colors: string[];
}

interface ColorPalette {
  primary: string;
  secondary: string;
  accent: string[];
}

type MoodboardCategory = {
  id: string;
  name: string;
  coverImage: string;
}
```

## Key Design Decisions

### 1. Local-First Architecture
- Uses browser localStorage for data persistence
- Enables offline functionality
- Quick response times for budget calculations

### 2. Progressive Enhancement
- Basic functionality works without JavaScript
- Enhanced features (like real-time updates) added when available
- Responsive design works across all device sizes

### 3. User Experience
- Step-by-step questionnaires for complex tasks
- Real-time feedback for budget changes
- Clear validation messages and warnings
- Intuitive swipe interface for style selection

### 4. Performance Optimizations
- Lazy loading of images and heavy components
- Efficient budget calculations
- Debounced user inputs
- Optimized re-renders using React.memo and useMemo

## Future Improvements

### Planned Features
1. **AI Integration**
   - Smart budget recommendations
   - Style preference learning
   - Automated vendor matching

2. **Collaboration**
   - Multi-user editing
   - Vendor collaboration portal
   - Shared moodboards

3. **Enhanced Analytics**
   - Budget tracking over time
   - Spending pattern analysis
   - Regional cost comparisons

### Technical Debt
1. **Type Safety**
   - Add stricter TypeScript types
   - Implement runtime type checking
   - Add API response validation

2. **Testing**
   - Add unit tests for budget calculations
   - Add integration tests for user flows
   - Add E2E tests for critical paths

3. **Performance**
   - Implement proper caching strategy
   - Optimize large component renders
   - Add performance monitoring

## Development Guidelines

### Code Style
- Use TypeScript for all new code
- Follow functional programming principles
- Use React hooks for state management
- Keep components small and focused

### Component Structure
- Place shared components in `/components`
- Place page-specific components near their pages
- Use composition over inheritance
- Follow atomic design principles

### State Management
- Use React Context for global state
- Use local state for component-specific data
- Use URL state for shareable data
- Cache appropriately in localStorage

### Styling
- Use Tailwind CSS utility classes
- Follow BEM-like naming for custom classes
- Use CSS variables for theming
- Maintain consistent spacing scale

## Deployment

### Environment Setup
1. Install Node.js 18+
2. Install dependencies: `npm install`
3. Set up environment variables
4. Run development server: `npm run dev`

### Build Process
1. Run type checking: `npm run type-check`
2. Run tests: `npm run test`
3. Build production: `npm run build`
4. Deploy: `npm run deploy`

## Contributing
1. Fork the repository
2. Create a feature branch
3. Make changes and add tests
4. Submit a pull request

## Resources
- [Design System Documentation](link-to-docs)
- [API Documentation](link-to-api-docs)
- [Component Storybook](link-to-storybook)
- [Testing Guidelines](link-to-testing-docs)