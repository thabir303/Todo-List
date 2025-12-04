import React from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from '../../assets/icons';
import CustomDropdown from './CustomDropdown';

export const PAGE_SIZE_OPTIONS = [5, 10, 20, 50];

interface PaginationProps {
  currentPage: number;
  totalCount: number;
  pageSize: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  loading?: boolean;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  testIdPrefix?: string;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalCount,
  pageSize,
  hasNextPage,
  hasPreviousPage,
  loading = false,
  onPageChange,
  onPageSizeChange,
  testIdPrefix = ""
}) => {
  const totalPages = Math.ceil(totalCount / pageSize);
  const startItem = ((currentPage - 1) * pageSize) + 1;
  const endItem = Math.min(currentPage * pageSize, totalCount);

  return (
    <div 
      className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white/90 backdrop-blur-sm rounded-xl p-4 border border-slate-200"
      data-testid={testIdPrefix ? `${testIdPrefix}-pagination` : "pagination"}
    >
      <div className="flex items-center gap-3">
        <CustomDropdown
          value={pageSize}
          options={PAGE_SIZE_OPTIONS}
          onChange={onPageSizeChange}
          testId={testIdPrefix ? `${testIdPrefix}-page-size-select` : "page-size-select"}
        />
        <span className="text-sm text-slate-600">
          Showing <span className="font-semibold">{startItem}-{endItem}</span> of <span className="font-semibold">{totalCount}</span>
        </span>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={!hasPreviousPage || loading}
          className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed cursor-pointer disabled:opacity-50 transition-all flex items-center gap-1"
          data-testid={testIdPrefix ? `${testIdPrefix}-prev-page` : "prev-page"}
        >
          <ChevronLeftIcon className="w-4 h-4" />
          Prev
        </button>
        <span className="px-3 py-2 text-sm text-slate-600">
          Page <span className="font-semibold">{currentPage}</span> of {totalPages}
        </span>
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={!hasNextPage || loading}
          className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed cursor-pointer disabled:opacity-50 transition-all flex items-center gap-1"
          data-testid={testIdPrefix ? `${testIdPrefix}-next-page` : "next-page"}
        >
          Next
          <ChevronRightIcon className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default Pagination;
