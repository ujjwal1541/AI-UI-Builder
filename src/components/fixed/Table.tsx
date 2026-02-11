interface TableColumn {
  key: string;
  header: string;
  width?: string;
}

interface TableProps {
  columns: TableColumn[];
  data: Record<string, any>[];
  striped?: boolean;
  hover?: boolean;
}

export function Table({ columns, data, striped = false, hover = true }: TableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                style={column.width ? { width: column.width } : undefined}
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className={`bg-white divide-y divide-gray-200 ${striped ? 'divide-y divide-gray-200' : ''}`}>
          {data.map((row, rowIndex) => (
            <tr
              key={rowIndex}
              className={`${striped && rowIndex % 2 === 1 ? 'bg-gray-50' : ''} ${hover ? 'hover:bg-gray-100' : ''}`}
            >
              {columns.map((column) => (
                <td key={column.key} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {row[column.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
