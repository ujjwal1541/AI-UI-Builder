import { History, RotateCcw } from 'lucide-react';

interface Generation {
  id: string;
  version: number;
  created_at: string;
  explanation: string;
}

interface VersionHistoryProps {
  generations: Generation[];
  currentVersion: number | null;
  onRollback: (version: number) => void;
}

export function VersionHistory({ generations, currentVersion, onRollback }: VersionHistoryProps) {
  if (generations.length === 0) {
    return null;
  }

  return (
    <div className="px-6 py-4 bg-white border-b border-gray-200">
      <div className="flex items-center gap-2 mb-3">
        <History size={18} className="text-gray-600" />
        <h3 className="text-sm font-semibold text-gray-900">Version History</h3>
      </div>

      <div className="space-y-2">
        {generations.slice().reverse().map((gen) => (
          <div
            key={gen.id}
            className={`flex items-center justify-between p-3 rounded-lg border ${
              currentVersion === gen.version
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 bg-gray-50'
            }`}
          >
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">
                Version {gen.version}
                {currentVersion === gen.version && (
                  <span className="ml-2 text-xs text-blue-600">(current)</span>
                )}
              </p>
              <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                {gen.explanation}
              </p>
            </div>
            {currentVersion !== gen.version && (
              <button
                onClick={() => onRollback(gen.version)}
                className="ml-3 px-3 py-1.5 text-xs bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 rounded flex items-center gap-1"
              >
                <RotateCcw size={14} />
                Restore
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
