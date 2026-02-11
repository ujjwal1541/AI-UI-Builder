# AI Agent Prompts

This document contains all the hard-coded prompts used by the three-agent system. These prompts are the core of the deterministic UI generation system.

## Component Schema (Shared Context)

All agents receive this component schema as context:

```json
{
  "Button": {
    "props": {
      "children": "React.ReactNode (required)",
      "variant": "'primary' | 'secondary' | 'danger' (default: 'primary')",
      "size": "'sm' | 'md' | 'lg' (default: 'md')",
      "onClick": "() => void (optional)",
      "disabled": "boolean (default: false)",
      "fullWidth": "boolean (default: false)"
    }
  },
  "Card": {
    "props": {
      "children": "React.ReactNode (required)",
      "title": "string (optional)",
      "subtitle": "string (optional)",
      "padding": "'none' | 'sm' | 'md' | 'lg' (default: 'md')",
      "shadow": "boolean (default: true)"
    }
  },
  "Input": {
    "props": {
      "value": "string (required)",
      "onChange": "(value: string) => void (required)",
      "placeholder": "string (optional)",
      "label": "string (optional)",
      "type": "'text' | 'email' | 'password' | 'number' (default: 'text')",
      "disabled": "boolean (default: false)",
      "fullWidth": "boolean (default: false)",
      "error": "string (optional)"
    }
  },
  "Table": {
    "props": {
      "columns": "Array<{key: string, header: string, width?: string}> (required)",
      "data": "Array<Record<string, any>> (required)",
      "striped": "boolean (default: false)",
      "hover": "boolean (default: true)"
    }
  },
  "Modal": {
    "props": {
      "isOpen": "boolean (required)",
      "onClose": "() => void (required)",
      "title": "string (optional)",
      "children": "React.ReactNode (required)",
      "size": "'sm' | 'md' | 'lg' | 'xl' (default: 'md')"
    }
  },
  "Sidebar": {
    "props": {
      "items": "Array<{label: string, icon?: string, onClick?: () => void}> (required)",
      "title": "string (optional)",
      "width": "'sm' | 'md' | 'lg' (default: 'md')"
    }
  },
  "Navbar": {
    "props": {
      "brand": "string (optional)",
      "items": "Array<{label: string, onClick?: () => void}> (optional)",
      "actions": "React.ReactNode (optional)"
    }
  },
  "Chart": {
    "props": {
      "data": "Array<{label: string, value: number}> (required)",
      "type": "'bar' | 'line' (required)",
      "title": "string (optional)",
      "height": "number (default: 300)"
    }
  }
}
```

## Agent 1: Planner

**Role**: Interprets user intent and creates a structured plan for building UI.

**Full Prompt**:

```
You are a UI Planner Agent. Your role is to analyze user intent and create a structured plan for building a UI.

AVAILABLE COMPONENTS (YOU MUST USE ONLY THESE):
${JSON.stringify(COMPONENT_SCHEMA, null, 2)}

RULES:
1. You may ONLY use the components listed above
2. You may NOT create new components
3. You may NOT use inline styles or custom CSS
4. You may NOT use any external libraries
5. Choose appropriate layouts using flexbox/grid patterns

Given the user's request, output a JSON plan with this exact structure:
{
  "layoutStructure": "Description of the overall layout",
  "components": [
    {
      "component": "ComponentName",
      "purpose": "Why this component was chosen",
      "props": { "key": "value" },
      "children": "Content or description"
    }
  ],
  "reasoning": "Overall reasoning for this design"
}

User Request: ${userPrompt}
```

**For Modifications**:
```
[Same as above, plus:]

EXISTING CODE TO MODIFY:
${existingCode}

IMPORTANT: Make incremental changes. Do not regenerate everything. Preserve what works.
```

**Output**: JSON plan with layout structure, component selections, and reasoning.

## Agent 2: Generator

**Role**: Converts the structured plan into valid, working React code.

**Full Prompt**:

```
You are a UI Generator Agent. Your role is to convert a structured plan into valid, working React code.

AVAILABLE COMPONENTS (IMPORT FROM '@/components/fixed'):
Button, Card, Input, Table, Modal, Sidebar, Navbar, Chart

RULES:
1. Generate ONLY the component function code
2. Use ONLY the components from the plan
3. Use React hooks (useState) for state management
4. Import components from '@/components/fixed'
5. The component MUST be named 'GeneratedUI' and be the default export
6. Use proper TypeScript types
7. NO inline styles, NO custom CSS classes beyond Tailwind layout utilities
8. Use Tailwind ONLY for: flex, grid, gap, w-*, h-*, p-*, m-* (layout only)

Generate valid React code for this plan: ${JSON.stringify(plan, null, 2)}
```

**Output**: Valid React component code as a string (wrapped in code fence).

## Agent 3: Explainer

**Role**: Explains UI decisions in plain, non-technical English.

**Full Prompt**:

```
You are a UI Explainer Agent. Your role is to explain UI decisions in plain, non-technical English.

Analyze the generated code and plan, then provide a clear explanation that covers:
1. What UI was created (in simple terms)
2. Which components were chosen and why
3. How the layout is organized
4. Any interactive features

Keep the explanation concise (3-5 sentences) and user-friendly.

Plan: ${JSON.stringify(plan, null, 2)}

Generated Code:
${code}
```

**Output**: Plain English explanation (3-5 sentences).

## Execution Flow

1. **User Input** → Sanitized by validation layer
2. **Planner Agent** → Receives user input + optional existing code
3. **Planner Output** → JSON plan validated and parsed
4. **Generator Agent** → Receives plan
5. **Generator Output** → Code validated against component whitelist
6. **Explainer Agent** → Receives plan + code
7. **Explainer Output** → User-friendly explanation
8. **Final Output** → { plan, code, explanation }

## Design Principles

### Determinism
- Fixed component library ensures consistent output
- No arbitrary style generation
- Same request should produce functionally equivalent UI

### Safety
- Component whitelist prevents injection attacks
- Validation before execution
- Sandboxed code generation

### Explainability
- Every decision has reasoning
- Plain English explanations
- Traceable component choices

### Iteration
- Existing code preserved when modifying
- Incremental changes over full rewrites
- Version history for rollback

## Modification Strategy

When modifying existing UI, the planner receives this additional instruction:

```
IMPORTANT: Make incremental changes. Do not regenerate everything. Preserve what works.
```

This ensures:
- Only requested changes are made
- Working components remain untouched
- Layout structure is preserved unless explicitly changed
- State management is maintained

## Example Flows

### Initial Generation

**User**: "Create a login form"

**Planner** →
```json
{
  "layoutStructure": "Centered card with form inputs",
  "components": [
    {
      "component": "Card",
      "purpose": "Container for login form",
      "props": { "title": "Login" }
    },
    {
      "component": "Input",
      "purpose": "Email input field",
      "props": { "label": "Email", "type": "email" }
    },
    {
      "component": "Input",
      "purpose": "Password input field",
      "props": { "label": "Password", "type": "password" }
    },
    {
      "component": "Button",
      "purpose": "Submit button",
      "props": { "variant": "primary" }
    }
  ],
  "reasoning": "Login forms need email, password inputs and submit button in a clean card layout"
}
```

**Generator** → Produces React code with Card, 2 Inputs, and Button

**Explainer** → "I created a login form with email and password fields inside a card. The form includes a primary action button for submitting credentials. The layout is centered and clean for easy user interaction."

### Modification

**User**: "Add a forgot password link"

**Planner** → Analyzes existing code, adds link element to plan

**Generator** → Modifies code to include link, preserves existing structure

**Explainer** → "I added a forgot password link below the login button. The existing form structure remains unchanged."

## Validation Rules

Generated code must pass these checks:

1. **Required Structure**
   - Must include `export default`
   - Component must be named `GeneratedUI`

2. **Import Validation**
   - Only imports from `@/components/fixed`
   - All imported components must be in whitelist

3. **Security Checks**
   - No `eval()` or `Function()` constructors
   - No `dangerouslySetInnerHTML`
   - No `<script>` tags
   - No inline `style` objects

4. **Style Constraints**
   - Only Tailwind layout utilities allowed
   - No custom CSS classes
   - No style prop usage

## Prompt Engineering Notes

The prompts are designed to:

1. **Constrain the solution space**: By limiting to 8 components, outputs are deterministic
2. **Enforce rules explicitly**: Multiple reminders about constraints prevent hallucination
3. **Require structured output**: JSON format makes parsing reliable
4. **Separate concerns**: Three agents with distinct responsibilities
5. **Enable iteration**: Context awareness for modifications

## Future Improvements

Potential prompt enhancements:

1. **Few-shot examples**: Add 2-3 example plan/code pairs
2. **Error recovery**: Prompt for self-correction on validation failures
3. **Complexity scoring**: Ask planner to rate complexity
4. **Component suggestions**: Prompt could suggest alternative approaches
5. **Accessibility hints**: Include a11y requirements in prompts
6. **Test generation**: Add agent to generate test cases

## Observability

To audit agent behavior:

1. Check database `generations` table for plan JSON
2. Compare multiple generations for same prompt
3. Review explanation quality in messages
4. Monitor validation failure rates
5. Track component usage patterns

Location in code: `/supabase/functions/generate-ui/index.ts`
