# Setup Guide

## Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables

The `.env` file is already configured with Supabase credentials. You only need to add your Anthropic API key:

```bash
VITE_SUPABASE_URL=https://iszggldcuhvftglmjjop.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
VITE_ANTHROPIC_API_KEY=your-anthropic-api-key-here
```

**Note**: The `VITE_ANTHROPIC_API_KEY` in the frontend is not used. The actual API key needs to be configured in Supabase Edge Function secrets.

### 3. Configure Anthropic API Key in Supabase

The Edge Function needs access to the Anthropic API. The API key is managed as a Supabase secret:

**Option A: Using Supabase Dashboard (Recommended)**
1. Go to your Supabase project dashboard
2. Navigate to Edge Functions → Settings
3. Add a new secret:
   - Name: `ANTHROPIC_API_KEY`
   - Value: Your Anthropic API key (starts with `sk-ant-`)

**Option B: Using Supabase CLI**
```bash
supabase secrets set ANTHROPIC_API_KEY=your-anthropic-api-key
```

### 4. Verify Database Migration

The database schema has already been created. You can verify it by checking:
- Sessions table
- Messages table
- Generations table

All tables should have Row Level Security enabled with public access policies for MVP purposes.

### 5. Verify Edge Function Deployment

The `generate-ui` edge function has been deployed. You can test it:

```bash
curl -X POST \
  https://iszggldcuhvftglmjjop.supabase.co/functions/v1/generate-ui \
  -H "Authorization: Bearer YOUR_ANON_KEY" \
  -H "Content-Type: application/json" \
  -d '{"userPrompt": "Create a simple button", "existingCode": null, "isModification": false}'
```

### 6. Run Development Server

```bash
npm run dev
```

Open http://localhost:5173 in your browser.

### 7. Test the Application

Try these test prompts:
1. "Create a login form with email and password inputs"
2. "Add a forgot password link"
3. "Make it more minimal"
4. "Create a dashboard with a chart and table"

## Getting an Anthropic API Key

1. Go to https://console.anthropic.com/
2. Sign up or log in
3. Navigate to API Keys
4. Create a new API key
5. Copy the key (starts with `sk-ant-`)
6. Add it to Supabase secrets as shown in step 3 above

## Troubleshooting

### Edge Function Returns 500 Error
- Check that `ANTHROPIC_API_KEY` is set in Supabase secrets
- Verify the API key is valid
- Check Edge Function logs in Supabase dashboard

### Components Not Rendering
- Check browser console for errors
- Verify the generated code in the code panel
- Check for validation errors in the chat

### Database Connection Issues
- Verify `.env` file has correct Supabase URL and key
- Check that migrations have been applied
- Verify RLS policies are configured correctly

### Build Failures
- Run `npm install` to ensure all dependencies are installed
- Check for TypeScript errors: `npm run typecheck`
- Clear node_modules and reinstall if needed

## Architecture Notes

The application uses a three-agent system:
1. **Planner**: Analyzes user intent and creates structured plan
2. **Generator**: Converts plan to React code
3. **Explainer**: Provides user-friendly explanations

All agents run in a single Edge Function call with sequential execution.

The component library is fixed and deterministic - no new components can be created at runtime.

For more details, see the main README.md file.
