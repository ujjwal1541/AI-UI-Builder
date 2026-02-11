import { useEffect, useState } from 'react';
import { AlertCircle } from 'lucide-react';
import * as FixedComponents from './fixed';

interface PreviewPanelProps {
  code: string;
  onError?: (error: string) => void;
}

export function PreviewPanel({ code, onError }: PreviewPanelProps) {
  const [Component, setComponent] = useState<React.ComponentType | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!code || code.trim().length === 0) {
      setComponent(null);
      setError(null);
      return;
    }

    try {
      let transformedCode = code;

      transformedCode = transformedCode.replace(
        /import\s+{([^}]+)}\s+from\s+['"]@\/components\/fixed['"]/g,
        (_, imports) => {
          const importList = imports.split(',').map((i: string) => i.trim());
          return `const { ${importList.join(', ')} } = FixedComponents;`;
        }
      );

      transformedCode = transformedCode.replace(
        /import\s+(\w+)\s+from\s+['"]react['"]/g,
        ''
      );

      transformedCode = transformedCode.replace(
        /export\s+default\s+(\w+)/g,
        'return $1'
      );

      const componentFunction = new Function(
        'React',
        'FixedComponents',
        `
        const { useState, useEffect, useCallback, useMemo } = React;
        ${transformedCode}
        `
      );

      const GeneratedComponent = componentFunction(
        { useState, useEffect, useCallback: () => {}, useMemo: (fn: any) => fn() },
        FixedComponents
      );

      setComponent(() => GeneratedComponent);
      setError(null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to render component';
      setError(errorMessage);
      setComponent(null);
      onError?.(errorMessage);
    }
  }, [code, onError]);

  return (
    <div className="flex flex-col h-full bg-gray-100">
      <div className="px-6 py-4 bg-white border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">Live Preview</h2>
        <p className="text-sm text-gray-600">Real-time component rendering</p>
      </div>

      <div className="flex-1 overflow-auto p-6">
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
            <AlertCircle className="text-red-600 flex-shrink-0 mt-0.5" size={20} />
            <div>
              <p className="text-sm font-medium text-red-900">Render Error</p>
              <p className="text-sm text-red-700 mt-1">{error}</p>
            </div>
          </div>
        )}

        {!error && !Component && (
          <div className="flex items-center justify-center h-full text-gray-500">
            <p>No preview available yet</p>
          </div>
        )}

        {!error && Component && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <Component />
          </div>
        )}
      </div>
    </div>
  );
}
