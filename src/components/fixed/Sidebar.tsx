interface SidebarItem {
  label: string;
  icon?: string;
  onClick?: () => void;
}

interface SidebarProps {
  items: SidebarItem[];
  title?: string;
  width?: 'sm' | 'md' | 'lg';
}

export function Sidebar({ items, title, width = 'md' }: SidebarProps) {
  const widthClasses = {
    sm: 'w-48',
    md: 'w-64',
    lg: 'w-80'
  };

  return (
    <div className={`${widthClasses[width]} bg-gray-900 text-white h-full flex flex-col`}>
      {title && (
        <div className="px-6 py-4 border-b border-gray-700">
          <h2 className="text-lg font-semibold">{title}</h2>
        </div>
      )}
      <nav className="flex-1 px-4 py-4 space-y-1">
        {items.map((item, index) => (
          <button
            key={index}
            onClick={item.onClick}
            className="w-full text-left px-4 py-2 rounded hover:bg-gray-800 transition-colors"
          >
            {item.icon && <span className="mr-2">{item.icon}</span>}
            {item.label}
          </button>
        ))}
      </nav>
    </div>
  );
}
