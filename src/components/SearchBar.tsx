import { useState, useEffect } from "react";
import { Search } from "lucide-react";

interface SearchBarProps {
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  className?: string;
}

export default function SearchBar({
  placeholder = "Search...",
  value = "",
  onChange,
  className,
}: SearchBarProps) {
  const [input, setInput] = useState(value);

  useEffect(() => {
    setInput(value);
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
    onChange?.(e.target.value);
  };

  return (
    <div className={`relative ${className ?? "w-full sm:w-64"}`}>
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <input
        type="text"
        value={input}
        onChange={handleChange}
        placeholder={placeholder}
        className="w-full rounded border border-input bg-background py-2 pl-10 pr-3 text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
      />
    </div>
  );
}
