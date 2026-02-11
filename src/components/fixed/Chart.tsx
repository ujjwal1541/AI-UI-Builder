interface ChartDataPoint {
  label: string;
  value: number;
}

interface ChartProps {
  data: ChartDataPoint[];
  type: 'bar' | 'line';
  title?: string;
  height?: number;
}

export function Chart({ data, type, title, height = 300 }: ChartProps) {
  const maxValue = Math.max(...data.map(d => d.value), 1);

  return (
    <div className="w-full">
      {title && (
        <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      )}
      <div className="relative" style={{ height: `${height}px` }}>
        {type === 'bar' && (
          <div className="flex items-end justify-around h-full border-b border-l border-gray-300 pb-8 pl-8">
            {data.map((point, index) => (
              <div key={index} className="flex flex-col items-center flex-1 mx-1">
                <div className="w-full flex flex-col justify-end" style={{ height: '100%' }}>
                  <div
                    className="bg-blue-600 rounded-t"
                    style={{ height: `${(point.value / maxValue) * 100}%` }}
                  />
                </div>
                <span className="text-xs text-gray-600 mt-2">{point.label}</span>
              </div>
            ))}
          </div>
        )}
        {type === 'line' && (
          <div className="relative h-full border-b border-l border-gray-300 pb-8 pl-8">
            <svg className="w-full h-full">
              <polyline
                points={data.map((point, index) => {
                  const x = (index / (data.length - 1)) * 100;
                  const y = 100 - (point.value / maxValue) * 100;
                  return `${x}%,${y}%`;
                }).join(' ')}
                fill="none"
                stroke="#2563eb"
                strokeWidth="2"
              />
              {data.map((point, index) => {
                const x = (index / (data.length - 1)) * 100;
                const y = 100 - (point.value / maxValue) * 100;
                return (
                  <circle
                    key={index}
                    cx={`${x}%`}
                    cy={`${y}%`}
                    r="4"
                    fill="#2563eb"
                  />
                );
              })}
            </svg>
            <div className="absolute bottom-0 left-0 right-0 flex justify-around pb-2">
              {data.map((point, index) => (
                <span key={index} className="text-xs text-gray-600">{point.label}</span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
