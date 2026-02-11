interface NavbarProps {
  brand?: string;
  items?: Array<{ label: string; onClick?: () => void }>;
  actions?: React.ReactNode;
}

export function Navbar({ brand, items = [], actions }: NavbarProps) {
  return (
    <nav className="bg-white shadow-md">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-8">
            {brand && (
              <div className="text-xl font-bold text-gray-900">{brand}</div>
            )}
            {items.length > 0 && (
              <div className="flex space-x-4">
                {items.map((item, index) => (
                  <button
                    key={index}
                    onClick={item.onClick}
                    className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded hover:bg-gray-100 transition-colors"
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            )}
          </div>
          {actions && (
            <div className="flex items-center space-x-4">
              {actions}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
