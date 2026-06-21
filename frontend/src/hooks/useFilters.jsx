import { useState, useCallback } from "react";

const defaultInitialFilters = {
  medicoId: "",
  especialidad: "",
  practica: "",
  sede: "",
  fechaDesde: "",
  fechaHasta: "",
};

export function useFilters(initialFilters = defaultInitialFilters) {
  const [filters, setFilters] = useState(initialFilters);

  const updateFilter = useCallback((field, value) => {
    setFilters((current) => ({ ...current, [field]: value }));
  }, []);

  const clearFilters = useCallback(() => {
    setFilters(initialFilters);
  }, [initialFilters]);

  return { filters, updateFilter, clearFilters };
}
