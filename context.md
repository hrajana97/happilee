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

#### Moodboard System
- `app/dashboard/moodboard/[category]/page.tsx`: Category-specific moodboards
- `components/moodboard/swipe-card.tsx`: Tinder-style image swiping
- `components/moodboard/color-palette.tsx`: Color palette management

Features:
- Swipeable interface for style selection
- Automatic color palette generation
- Tag-based organization
- Share and collaboration features

### Data Models

#### Budget Data Structure
\`\`\`typescript
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
\`\`\`

#### User Data Structure
\`\`\`typescript
interface UserData {
  name: string;
  partnerName?: string;
  weddingDate: string;
  budget: number;
  guestCount: number;
  calculatedBudget?: any;
}
\`\`\`

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