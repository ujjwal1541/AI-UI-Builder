import { useState } from 'react';
import { Copy, Check } from 'lucide-react';

interface CodePanelProps {
  code: string;
  onCodeChange: (code: string) => void;
  explanation: string;
}

export function CodePanel({ code, onCodeChange, explanation }: CodePanelProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col h-full bg-white">
      <div className="px-6 py-4 bg-white border-b border-gray-200 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Generated Code</h2>
          <p className="text-sm text-gray-600">Editable React component</p>
        </div>
        <button
          onClick={handleCopy}
          className="px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded flex items-center gap-2"
        >
          {copied ? <Check size={16} /> : <Copy size={16} />}
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>

      {explanation && (
        <div className="px-6 py-4 bg-blue-50 border-b border-blue-200">
          <p className="text-sm text-gray-700 font-medium mb-1">Explanation:</p>
          <p className="text-sm text-gray-600">{explanation}</p>
        </div>
      )}

      <div className="flex-1 overflow-hidden">
        <textarea
          value={code}
          onChange={(e) => onCodeChange(e.target.value)}
          className="w-full h-full p-6 font-mono text-sm resize-none focus:outline-none"
          spellCheck={false}
          placeholder="Generated code will appear here..."
        />
      </div>
    </div>
  );
}
