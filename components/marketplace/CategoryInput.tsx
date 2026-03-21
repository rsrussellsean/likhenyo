"use client";

import { useRef, useState, useEffect } from "react";

interface CategoryInputProps {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  getSuggestions: (query: string) => Promise<string[]>;
  className?: string;
}

export default function CategoryInput({
  value,
  onChange,
  placeholder = "Start typing…",
  getSuggestions,
  className = "",
}: CategoryInputProps) {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Close on outside click
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Debounced suggestions
  useEffect(() => {
    if (value.length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      const results = await getSuggestions(value);
      setSuggestions(results ?? []);
      setShowSuggestions((results ?? []).length > 0);
    }, 300);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [value, getSuggestions]);

  function handleSelect(s: string) {
    onChange(s);
    setSuggestions([]);
    setShowSuggestions(false);
  }

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
        placeholder={placeholder}
        className="w-full h-11 px-4 rounded-xl bg-lk-neutral border border-lk-neutral-mid
                   font-inter text-sm text-lk-dark placeholder:text-lk-dark/30
                   focus:outline-none focus:border-lk-primary focus:ring-2 focus:ring-lk-primary/15
                   transition-all"
      />

      {showSuggestions && (
        <div className="absolute z-10 top-full left-0 right-0 mt-1 bg-white border border-lk-neutral-mid rounded-xl shadow-lg max-h-48 overflow-y-auto">
          {suggestions.map((s) => (
            <button
              key={s}
              type="button"
              onMouseDown={(e) => {
                e.preventDefault();
                handleSelect(s);
              }}
              className="w-full text-left px-3 py-2 font-inter text-sm text-lk-dark hover:bg-lk-primary-pale hover:text-lk-primary transition-colors"
            >
              {s}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
