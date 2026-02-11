# Quick Start Guide

Get the AI UI Generator running in 5 minutes.

## Prerequisites

- Node.js 18+
- Anthropic API key ([Get one here](https://console.anthropic.com/))

## Setup Steps

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Anthropic API Key

The Edge Function needs your Anthropic API key. Set it as a Supabase secret:

**Via Supabase Dashboard** (easiest):
1. Go to https://supabase.com/dashboard/project/iszggldcuhvftglmjjop
2. Click "Edge Functions" in the left sidebar
3. Click on the "generate-ui" function
4. Go to "Secrets" tab
5. Add secret:
   - Key: `ANTHROPIC_API_KEY`
   - Value: Your API key (starts with `sk-ant-`)
6. Save

**Via Supabase CLI**:
```bash
# Install Supabase CLI if not already installed
npm install -g supabase

# Login to Supabase
supabase login

# Link to your project
supabase link --project-ref iszggldcuhvftglmjjop

# Set the secret
supabase secrets set ANTHROPIC_API_KEY=your-anthropic-api-key
```

### 3. Run Development Server

```bash
npm run dev
```

Open http://localhost:5173

### 4. Test It Out

Try these prompts in the chat:

1. **Simple**: "Create a login form"
2. **Iteration**: "Add a forgot password link"
3. **Complex**: "Create a dashboard with a data table and bar chart"
4. **Modification**: "Make it more minimal"
5. **Version Control**: Use the version history to rollback changes

## What You Get

- **Left Panel**: Chat interface for describing UI
- **Middle Panel**: Generated React code (editable)
- **Right Panel**: Live preview of the UI
- **Version History**: Track and rollback changes

## Architecture

The app uses a three-agent system:

1. **Planner**: Analyzes your request and plans the UI
2. **Generator**: Converts plan into React code
3. **Explainer**: Explains what was created and why

All agents use Claude 3.5 Sonnet via the Anthropic API.

## Component Library

The system uses 8 fixed components:
- Button (3 variants, 3 sizes)
- Card (with title/subtitle)
- Input (text, email, password, number)
- Table (with columns and data)
- Modal (4 sizes)
- Sidebar (navigation)
- Navbar (top navigation)
- Chart (bar and line charts)

The AI can ONLY use these components - it cannot create new ones or modify their styling. This ensures deterministic, reproducible UIs.

## Troubleshooting

### "Failed to generate UI" error
- Check that Anthropic API key is set in Supabase secrets
- Verify the API key is valid and has credits
- Check Edge Function logs in Supabase dashboard

### Components not rendering
- Check browser console for errors
- Verify the code in the code panel is valid
- Try editing the code manually to fix any issues

### Database errors
- Verify Supabase is running
- Check that migrations were applied successfully
- Review RLS policies in Supabase dashboard

## Next Steps

- Read the full [README.md](./README.md) for architecture details
- Check [AGENT_PROMPTS.md](./AGENT_PROMPTS.md) to see how the AI works
- Review [DEPLOYMENT.md](./DEPLOYMENT.md) to deploy to production

## Need Help?

- Database schema: Already created in Supabase
- Edge function: Already deployed as `generate-ui`
- Component library: Located in `/src/components/fixed/`
- Agent prompts: In `/supabase/functions/generate-ui/index.ts`

## Key Features

✅ Three-agent AI system (Planner, Generator, Explainer)
✅ Deterministic component library (8 fixed components)
✅ Live preview with error handling
✅ Version history and rollback
✅ Iterative UI modifications
✅ Code validation and safety checks
✅ Editable generated code
✅ Plain English explanations

## Performance

- Initial generation: ~5-10 seconds
- Modifications: ~5-10 seconds
- Preview updates: Instant (on code edit)
- Database operations: <100ms

## Costs

- Anthropic API: ~$0.015 per generation (1k tokens)
- Supabase: Free tier (500MB database, 2GB transfer)
- Hosting: Free tier available on most platforms

Happy building! 🚀
