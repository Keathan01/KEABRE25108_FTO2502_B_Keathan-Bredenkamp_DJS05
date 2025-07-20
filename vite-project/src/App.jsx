import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/Homepage";
import ShowDetailPage from "./pages/ShowDetailPage"; // placeholder for next steps
import { FilterProvider } from "./context/FilterContext";

/**
 * App root with routing and context provider.
 */
export default function App() {
  return (
    <FilterProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/show/:id" element={<ShowDetailPage />} />
        </Routes>
      </BrowserRouter>
    </FilterProvider>
  );
}
