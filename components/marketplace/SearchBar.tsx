"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";

interface SearchBarProps {
  basePath: string;
  placeholder?: string;
}

export default function SearchBar({
  basePath,
  placeholder = "Search...",
}: SearchBarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [value, setValue] = useState(searchParams.get("keyword") ?? "");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams(searchParams.toString());
    if (value.trim()) {
      params.set("keyword", value.trim());
    } else {
      params.delete("keyword");
    }
    params.delete("page");
    router.push(`${basePath}?${params.toString()}`);
  }

  return (
    <form onSubmit={handleSubmit} className="relative w-full max-w-2xl mx-auto">
      <div className="relative">
        <Search
          size={18}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-lk-dark/30 pointer-events-none"
        />
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={placeholder}
          className="w-full h-12 pl-11 pr-24 rounded-2xl bg-white border border-lk-neutral-mid
                     font-inter text-sm text-lk-dark placeholder:text-lk-dark/30
                     focus:outline-none focus:border-lk-primary focus:ring-2 focus:ring-lk-primary/15
                     shadow-sm transition-all"
        />
        <button
          type="submit"
          className="absolute right-1.5 top-1/2 -translate-y-1/2 h-9 px-5 rounded-xl
                     bg-lk-primary text-white font-inter text-sm font-semibold
                     hover:bg-lk-primary-dark active:scale-[0.97] transition-all"
        >
          Search
        </button>
      </div>
    </form>
  );
}
