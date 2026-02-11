interface InputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
  type?: 'text' | 'email' | 'password' | 'number';
  disabled?: boolean;
  fullWidth?: boolean;
  error?: string;
}

export function Input({
  value,
  onChange,
  placeholder,
  label,
  type = 'text',
  disabled = false,
  fullWidth = false,
  error
}: InputProps) {
  const widthClass = fullWidth ? 'w-full' : '';
  const errorClass = error ? 'border-red-500' : 'border-gray-300';

  return (
    <div className={widthClass}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        className={`px-3 py-2 border ${errorClass} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${widthClass} ${disabled ? 'bg-gray-100 cursor-not-allowed' : ''}`}
      />
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
}
