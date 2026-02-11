import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  created_at: string;
}

interface Generation {
  id: string;
  version: number;
  plan: any;
  code: string;
  explanation: string;
  created_at: string;
}

export function useSession(sessionId: string | null) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [generations, setGenerations] = useState<Generation[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (sessionId) {
      loadMessages();
      loadGenerations();
    }
  }, [sessionId]);

  async function loadMessages() {
    if (!sessionId) return;

    const { data } = await supabase
      .from('messages')
      .select('*')
      .eq('session_id', sessionId)
      .order('created_at', { ascending: true });

    if (data) {
      setMessages(data);
    }
  }

  async function loadGenerations() {
    if (!sessionId) return;

    const { data } = await supabase
      .from('generations')
      .select('*')
      .eq('session_id', sessionId)
      .order('version', { ascending: true });

    if (data) {
      setGenerations(data);
    }
  }

  async function addMessage(role: 'user' | 'assistant', content: string) {
    if (!sessionId) return;

    const { data } = await supabase
      .from('messages')
      .insert({ session_id: sessionId, role, content })
      .select()
      .single();

    if (data) {
      setMessages(prev => [...prev, data]);
    }
  }

  async function addGeneration(plan: any, code: string, explanation: string) {
    if (!sessionId) return;

    const nextVersion = generations.length + 1;

    const { data } = await supabase
      .from('generations')
      .insert({
        session_id: sessionId,
        version: nextVersion,
        plan,
        code,
        explanation
      })
      .select()
      .single();

    if (data) {
      setGenerations(prev => [...prev, data]);
    }

    return data;
  }

  return {
    messages,
    generations,
    loading,
    setLoading,
    addMessage,
    addGeneration,
    refresh: () => {
      loadMessages();
      loadGenerations();
    }
  };
}
