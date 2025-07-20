import React, { createContext, useState } from "react";

export const FilterContext = createContext({
  filters: { search: "", genre: "" },
  setFilters: () => {},
});

/**
 * Provides filter state and setter for app-wide usage.
 * @param {React.ReactNode} children
 */
export function FilterProvider({ children }) {
  const [filters, setFilters] = useState({ search: "", genre: "" });

  return (
    <FilterContext.Provider value={{ filters, setFilters }}>
      {children}
    </FilterContext.Provider>
  );
}
