import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

/* ======================================
   COMPONENT SCHEMA
====================================== */

const COMPONENT_SCHEMA = {
  Button: { props: { children: "React.ReactNode" } },
  Card: { props: { children: "React.ReactNode" } },
  Input: { props: { value: "string", onChange: "(v: string) => void" } },
  Table: { props: { columns: "array", data: "array" } },
  Modal: { props: { isOpen: "boolean", onClose: "() => void" } },
  Sidebar: { props: { items: "array" } },
  Navbar: { props: { brand: "string" } },
  Chart: { props: { data: "array", type: "bar | line" } },
};

/* ======================================
   PROMPTS
====================================== */

const PLANNER_PROMPT = `
You are a UI Planner Agent.

Available Components:
${JSON.stringify(COMPONENT_SCHEMA, null, 2)}

Rules:
- Use ONLY listed components.
- No new components.
- No inline styles.
- No custom CSS.

Return STRICT JSON:
{
  "layoutStructure": "...",
  "components": [],
  "reasoning": "..."
}

User Request:
`;

const GENERATOR_PROMPT = `
You are a UI Generator Agent.

Rules:
- Use only allowed components.
- Import from '@/components/fixed'
- Default export function GeneratedUI()
- Use React + TypeScript
- Layout Tailwind only (flex, grid, gap, p, m, w, h)
- No inline styles

Plan:
`;

const EXPLAINER_PROMPT = `
You are a UI Explainer Agent.

Explain clearly:
- What UI was created
- Which components were used
- Layout structure
- Any interactivity

Keep explanation concise (3-5 sentences).

Plan:
`;

/* ======================================
   ANTHROPIC CALL
====================================== */

async function callClaude(prompt: string): Promise<string> {
  const apiKey = Deno.env.get("ANTHROPIC_API_KEY");

  if (!apiKey) {
    throw new Error("ANTHROPIC_API_KEY not configured");
  }

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "x-api-key": apiKey,
      "Content-Type": "application/json",
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-3-5-sonnet-latest",
      max_tokens: 4096,
      temperature: 0.2,
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Anthropic API error: ${errorText}`);
  }

  const data = await response.json();

  if (!data.content || !data.content[0]?.text) {
    throw new Error("Unexpected Anthropic response format");
  }

  return data.content[0].text;
}

/* ======================================
   MAIN HANDLER
====================================== */

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const { userPrompt, existingCode, isModification } = await req.json();

    if (!userPrompt) {
      throw new Error("Missing userPrompt");
    }

    /* ========= STEP 1: PLANNING ========= */

    let plannerInput = PLANNER_PROMPT + userPrompt;

    if (isModification && existingCode) {
      plannerInput += `

EXISTING CODE:
${existingCode}

IMPORTANT:
Make incremental changes only.
Preserve working structure.
`;
    }

    const planText = await callClaude(plannerInput);

    let plan;
    try {
      const jsonMatch = planText.match(/\{[\s\S]*\}/);
      plan = jsonMatch ? JSON.parse(jsonMatch[0]) : JSON.parse(planText);
    } catch {
      plan = {
        layoutStructure: "Fallback layout",
        components: [],
        reasoning: planText,
      };
    }

    /* ========= STEP 2: GENERATE CODE ========= */

    const generatorInput =
      GENERATOR_PROMPT + JSON.stringify(plan, null, 2);

    const codeResponse = await callClaude(generatorInput);

    const codeMatch = codeResponse.match(
      /```(?:tsx?|typescript|javascript)?\n([\s\S]*?)\n```/
    );

    const code = codeMatch ? codeMatch[1] : codeResponse;

    /* ========= STEP 3: EXPLAIN ========= */

    const explainerInput =
      EXPLAINER_PROMPT +
      JSON.stringify(plan, null, 2) +
      "\n\nGenerated Code:\n" +
      code;

    const explanation = await callClaude(explainerInput);

    return new Response(
      JSON.stringify({
        plan,
        code,
        explanation: explanation.trim(),
      }),
      {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error: any) {
    console.error("FUNCTION ERROR:", error);

    return new Response(
      JSON.stringify({
        error: error.message || "Unknown error",
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  }
});
