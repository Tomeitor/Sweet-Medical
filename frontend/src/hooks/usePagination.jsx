import { useState, useCallback } from "react";

const defaultInitialPagination = {
  page: 1,
  limit: 12,
  total: 0,
  totalPages: 0,
};

export function usePagination(initialPagination = defaultInitialPagination) {
  const [pagination, setPagination] = useState(initialPagination);

  const goToPage = useCallback((page) => {
    setPagination((current) => ({ ...current, page }));
  }, []);

  const resetPagination = useCallback(() => {
    setPagination(initialPagination);
  }, [initialPagination]);

  const setPaginationData = useCallback((data) => {
    setPagination(data);
  }, []);

  return { pagination, goToPage, resetPagination, setPaginationData };
}
