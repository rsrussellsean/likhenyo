"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { X } from "lucide-react";

interface TagInputProps {
  value: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
  getSuggestions?: (query: string) => Promise<string[]>;
}

export default function TagInput({
  value,
  onChange,
  placeholder = "Add tags…",
  getSuggestions,
}: TagInputProps) {
  const [input, setInput] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const addTag = useCallback(
    (tag: string) => {
      const trimmed = tag.trim().replace(/,$/, "").trim();
      if (trimmed && !value.includes(trimmed)) {
        onChange([...value, trimmed]);
      }
      setInput("");
      setSuggestions([]);
      setShowSuggestions(false);
    },
    [value, onChange]
  );

  const removeTag = (tag: string) => {
    onChange(value.filter((t) => t !== tag));
  };

  // Close dropdown on outside click
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
    if (!getSuggestions || input.length < 1) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      const results = await getSuggestions(input);
      setSuggestions(results ?? []);
      setShowSuggestions((results ?? []).length > 0);
    }, 300);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [input, getSuggestions]);

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      if (input.trim()) addTag(input);
    }
    if (e.key === "Backspace" && input === "" && value.length > 0) {
      onChange(value.slice(0, -1));
    }
  }

  return (
    <div ref={containerRef} className="relative">
      <input
        ref={inputRef}
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
        placeholder={value.length === 0 ? placeholder : "Add more…"}
        className="w-full h-11 px-4 rounded-xl bg-lk-neutral border border-lk-neutral-mid
                   font-inter text-sm text-lk-dark placeholder:text-lk-dark/30
                   focus:outline-none focus:border-lk-primary focus:ring-2 focus:ring-lk-primary/15
                   transition-all"
      />

      {/* Suggestions dropdown */}
      {showSuggestions && (
        <div className="absolute z-10 top-full left-0 right-0 mt-1 bg-white border border-lk-neutral-mid rounded-xl shadow-lg max-h-48 overflow-y-auto">
          {suggestions.map((s) => (
            <button
              key={s}
              type="button"
              onMouseDown={(e) => {
                e.preventDefault();
                addTag(s);
              }}
              className="w-full text-left px-3 py-2 font-inter text-sm text-lk-dark hover:bg-lk-primary-pale hover:text-lk-primary transition-colors"
            >
              {s}
            </button>
          ))}
        </div>
      )}

      {/* Tag chips */}
      {value.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2">
          {value.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center gap-1.5 bg-lk-primary-pale text-lk-primary font-inter text-xs font-medium px-3 py-1.5 rounded-full"
            >
              {tag}
              <button
                type="button"
                onClick={() => removeTag(tag)}
                className="text-lk-primary/50 hover:text-lk-primary transition-colors"
                aria-label={`Remove ${tag}`}
              >
                <X size={11} />
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
