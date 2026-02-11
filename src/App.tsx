import { useState, useEffect } from 'react';
import { supabase } from './lib/supabase';
import { validateGeneratedCode, sanitizeUserInput } from './lib/validation';
import { useSession } from './hooks/useSession';
import { ChatPanel } from './components/ChatPanel';
import { CodePanel } from './components/CodePanel';
import { PreviewPanel } from './components/PreviewPanel';
import { VersionHistory } from './components/VersionHistory';
import { RefreshCw, Sparkles } from 'lucide-react';

function App() {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [currentCode, setCurrentCode] = useState('');
  const [currentExplanation, setCurrentExplanation] = useState('');
  const [currentVersion, setCurrentVersion] = useState<number | null>(null);
  const [isRegenerating, setIsRegenerating] = useState(false);

  const { messages, generations, loading, setLoading, addMessage, addGeneration } = useSession(sessionId);

  useEffect(() => {
    initializeSession();
  }, []);

  useEffect(() => {
    if (generations.length > 0) {
      const latest = generations[generations.length - 1];
      setCurrentCode(latest.code);
      setCurrentExplanation(latest.explanation);
      setCurrentVersion(latest.version);
    }
  }, [generations]);

  async function initializeSession() {
    const { data } = await supabase
      .from('sessions')
      .insert({ title: 'New UI Session' })
      .select()
      .single();

    if (data) {
      setSessionId(data.id);
    }
  }

  async function handleSendMessage(userMessage: string) {
    if (!sessionId) return;

    const sanitized = sanitizeUserInput(userMessage);
    setLoading(true);

    try {
      await addMessage('user', sanitized);

      const isModification = generations.length > 0;

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-ui`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`
          },
          body: JSON.stringify({
            userPrompt: sanitized,
            existingCode: isModification ? currentCode : null,
            isModification
          })
        }
      );

      if (!response.ok) {
        throw new Error('Failed to generate UI');
      }

      const result = await response.json();

      const validation = validateGeneratedCode(result.code);
      if (!validation.isValid) {
        await addMessage('assistant', `I encountered some issues:\n${validation.errors.join('\n')}`);
        return;
      }

      await addGeneration(result.plan, result.code, result.explanation);
      await addMessage('assistant', result.explanation);

      setCurrentCode(result.code);
      setCurrentExplanation(result.explanation);
      setCurrentVersion(generations.length + 1);

    } catch (error) {
      console.error('Error:', error);
      await addMessage('assistant', 'Sorry, I encountered an error while generating the UI. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  async function handleRegenerate() {
    if (!sessionId || generations.length === 0) return;

    setIsRegenerating(true);

    try {
      const lastUserMessage = [...messages].reverse().find(m => m.role === 'user');
      if (!lastUserMessage) return;

      await handleSendMessage(lastUserMessage.content);

    } finally {
      setIsRegenerating(false);
    }
  }

  function handleRollback(version: number) {
    const targetGeneration = generations.find(g => g.version === version);
    if (targetGeneration) {
      setCurrentCode(targetGeneration.code);
      setCurrentExplanation(targetGeneration.explanation);
      setCurrentVersion(version);
    }
  }

  return (
    <div className="h-screen flex flex-col bg-gray-100">
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Sparkles className="text-blue-600" size={28} />
            <div>
              <h1 className="text-xl font-bold text-gray-900">AI UI Generator</h1>
              <p className="text-sm text-gray-600">Deterministic component-based UI generation</p>
            </div>
          </div>
          {generations.length > 0 && (
            <button
              onClick={handleRegenerate}
              disabled={isRegenerating || loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
            >
              <RefreshCw size={16} className={isRegenerating ? 'animate-spin' : ''} />
              Regenerate
            </button>
          )}
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        <div className="w-1/3 border-r border-gray-200 flex flex-col">
          <ChatPanel
            messages={messages}
            onSendMessage={handleSendMessage}
            loading={loading}
          />
        </div>

        <div className="flex-1 flex flex-col">
          <VersionHistory
            generations={generations}
            currentVersion={currentVersion}
            onRollback={handleRollback}
          />

          <div className="flex-1 flex overflow-hidden">
            <div className="w-1/2 border-r border-gray-200">
              <CodePanel
                code={currentCode}
                onCodeChange={setCurrentCode}
                explanation={currentExplanation}
              />
            </div>

            <div className="w-1/2">
              <PreviewPanel code={currentCode} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
