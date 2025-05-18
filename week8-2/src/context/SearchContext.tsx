// src/context/SearchContext.tsx
import { createContext, useContext, useState } from "react";

// 타입 지정
interface SearchContextType {
  search: string;
  setSearch: (value: string) => void;
}

// 기본 context
const SearchContext = createContext<SearchContextType | undefined>(undefined);

// Provider
export const SearchProvider = ({ children }: { children: React.ReactNode }) => {
  const [search, setSearch] = useState("");

  return (
    <SearchContext.Provider value={{ search, setSearch }}>
      {children}
    </SearchContext.Provider>
  );
};

// 훅으로 context 사용
export const useSearchContext = () => {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error("useSearchContext must be used within a SearchProvider");
  }
  return context;
};
