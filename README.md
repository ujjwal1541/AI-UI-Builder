# AI UI Generator - Deterministic Component System

A Claude-Code-style AI agent that converts natural language UI descriptions into working React components using a fixed, deterministic component library.

## Architecture Overview

This application implements a multi-agent system with clear separation of concerns:

### Three-Agent Architecture

1. **Planner Agent**: Interprets user intent and creates a structured plan
   - Analyzes natural language requests
   - Selects appropriate components from the fixed library
   - Determines layout structure
   - Outputs a JSON plan with reasoning

2. **Generator Agent**: Converts plans into executable React code
   - Uses only the allowed component library
   - Generates valid TypeScript/React code
   - Enforces component constraints
   - Produces deterministic, reproducible output

3. **Explainer Agent**: Provides human-readable explanations
   - Describes UI decisions in plain English
   - Explains component choices
   - References layout reasoning

### Fixed Component System

The application enforces a deterministic component library with 8 components:

- **Button**: Primary, secondary, and danger variants
- **Card**: Content containers with title/subtitle support
- **Input**: Text, email, password, and number inputs with validation
- **Table**: Data tables with striped and hover states
- **Modal**: Overlay dialogs with size variants
- **Sidebar**: Navigation sidebars with icons
- **Navbar**: Top navigation bars
- **Chart**: Bar and line charts with mock data

**Critical Constraint**: The AI cannot create new components, modify existing components, or use inline styles. This ensures visual consistency and reproducibility.

### Component Schema Validation

Every component has a strict schema defining:
- Allowed props and their types
- Default values
- Required vs optional properties
- Enum constraints for specific props

The validation layer prevents:
- Invalid component usage
- Security vulnerabilities (eval, dangerouslySetInnerHTML)
- Style injection
- Script injection

## Agent Design & Prompts

### Planner Prompt
The planner receives the component schema and user request, then outputs a structured JSON plan containing:
- Layout structure description
- Component selections with justification
- Props configuration
- Overall reasoning

### Generator Prompt
The generator receives the plan and produces:
- Valid React functional component
- Proper imports from the fixed library
- TypeScript type annotations
- State management with hooks

### Explainer Prompt
The explainer analyzes both the plan and generated code to produce:
- User-friendly explanation (3-5 sentences)
- Component choice rationale
- Layout organization description
- Interactive feature highlights

All prompts are hard-coded and visible in `/supabase/functions/generate-ui/index.ts`.

## Technical Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS (layout only)
- **Backend**: Supabase Edge Functions (Deno runtime)
- **Database**: Supabase PostgreSQL
- **AI**: Anthropic Claude 3.5 Sonnet
- **Icons**: Lucide React

## Database Schema

Three tables with Row Level Security enabled:

1. **sessions**: UI generation sessions
2. **messages**: Chat history (user/assistant)
3. **generations**: Code versions with plans and explanations

All tables use public policies for MVP simplicity.

## Safety & Validation

### Component Whitelist Enforcement
- Only imports from `@/components/fixed` are allowed
- Component usage is validated before rendering
- Unknown components trigger validation errors

### Code Validation
- Checks for required exports and naming
- Prevents dangerous patterns (eval, Function constructor)
- Blocks inline styles and script tags
- Validates against component schema

### Input Sanitization
- Removes script tags from user input
- Strips javascript: protocol
- Removes event handler attributes
- Basic prompt injection protection

### Error Handling
- Graceful degradation on generation failures
- User-friendly error messages
- Preview panel catches render errors
- Validation feedback in chat

## Iteration & Edit Awareness

The system supports incremental modifications:

1. **Context Preservation**: The planner receives existing code when modifying
2. **Incremental Changes**: Prompts explicitly request preservation of working code
3. **Version Tracking**: Each generation is saved with version number
4. **Rollback Support**: Users can restore any previous version
5. **Explanation Tracking**: Each version includes reasoning for changes

Example flow:
- User: "Create a login form"
- AI: Generates form with inputs and button
- User: "Add a forgot password link"
- AI: Modifies existing code, preserves form structure, adds link
- User: "Make it more minimal"
- AI: Adjusts spacing and removes extra elements

## UI Features

### Three-Panel Layout
1. **Left Panel**: Chat interface for describing UI intent
2. **Middle Panel**: Generated code editor (editable)
3. **Right Panel**: Live preview with error handling

### Version History
- Displays all generations with explanations
- Highlights current version
- One-click rollback to any version
- Preserves full change history

### Actions
- **Generate**: Create new UI from description
- **Modify**: Iteratively update existing UI
- **Regenerate**: Re-run last request with fresh generation
- **Rollback**: Restore previous version
- **Edit Code**: Manual code editing with live preview

## Setup Instructions

### Prerequisites
- Node.js 18+
- Anthropic API key
- Supabase project

### Environment Variables
Create `.env` file:
```
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### Supabase Edge Function Secrets
Set the Anthropic API key as a Supabase secret:
```bash
supabase secrets set ANTHROPIC_API_KEY=your-key
```

### Installation
```bash
npm install
npm run dev
```

### Deployment
```bash
npm run build
# Deploy to Vercel, Netlify, or any static host
```

## Known Limitations

1. **AI Hallucination**: The AI may occasionally generate invalid component props or structure
2. **Complex Layouts**: Very intricate layouts may require multiple iterations
3. **State Management**: Limited to useState, no complex state patterns
4. **No Custom Styling**: Cannot create custom designs beyond component variants
5. **Single Session**: No multi-user support or session persistence across reloads
6. **Async Operations**: No support for data fetching or side effects beyond basic state
7. **Component Limitations**: Fixed set of 8 components may not cover all use cases

## What I'd Improve With More Time

### High Priority
1. **Streaming Responses**: Stream AI output for better UX
2. **Diff View**: Show code changes between versions side-by-side
3. **Component Schema Validation**: Runtime prop validation using Zod or similar
4. **Better Error Recovery**: Automatic retry with prompt refinement
5. **Session Persistence**: Save sessions to localStorage for page reloads
6. **Export Functionality**: Download generated code as standalone component

### Medium Priority
1. **Undo/Redo**: Beyond version rollback, true undo stack
2. **Code Formatting**: Prettier integration for clean output
3. **Component Preview**: Show component documentation in UI
4. **Prompt Templates**: Pre-built prompts for common patterns
5. **Multi-file Generation**: Support for multiple related components
6. **State Machine**: More robust agent orchestration

### Nice to Have
1. **Authentication**: User accounts and saved projects
2. **Collaboration**: Real-time multi-user editing
3. **Component Variants**: Allow creating variants within constraints
4. **Theme System**: Color scheme customization
5. **Analytics**: Track common patterns and success rates
6. **Testing**: Auto-generate component tests

## Evaluation Criteria Coverage

| Criteria | Implementation |
|----------|---------------|
| **Agent Design** | Three distinct agents with explicit prompts and separation |
| **Determinism** | Fixed component library, no style generation, reproducible |
| **Iteration** | Context-aware modifications, version tracking, rollback |
| **Explainability** | Plain English explanations for every generation |
| **Engineering Judgment** | Focused MVP, clear tradeoffs, production-ready patterns |

## Demo Video

[Link to demo video showing the full workflow]

## License

MIT
