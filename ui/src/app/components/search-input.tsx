import { Input } from "@/components/ui/input";
import React from "react";

interface SearchComponentProps {
  onSearchChange: (value: string) => void;
}

export const SearchComponent = ({ onSearchChange }: SearchComponentProps) => {
  return (
    <div className="relative w-[350px] max-w-md">
      <Input
        type="search"
        placeholder="Search..."
        className="w-full rounded-md border border-input bg-transparent px-4 py-2 pr-10 text-foreground shadow-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/50"
        onChange={(e) => onSearchChange(e.target.value)}
      />
      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
        <SearchIcon className="w-5 h-5 text-muted-foreground" />
      </div>
    </div>
  );
};

function SearchIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}
