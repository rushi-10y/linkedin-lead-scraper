import React from 'react';
import Button from './Button.jsx';

const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  siblingCount = 1
}) => {
  const changePage = (page) => {
    if (page < 1 || page > totalPages || page === currentPage) return;
    onPageChange(page);
  };

  const getPages = () => {
    const pages = [];
    const start = Math.max(1, currentPage - siblingCount);
    const end = Math.min(totalPages, currentPage + siblingCount);

    if (start > 1) pages.push(1);
    if (start > 2) pages.push('...');

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    if (end < totalPages - 1) pages.push('...');
    if (end < totalPages) pages.push(totalPages);

    return pages;
  };

  return (
    <nav
      className="flex items-center justify-center space-x-2 mt-6"
      aria-label="Pagination"
    >
      <Button
        variant="ghost"
        size="sm"
        onClick={() => changePage(currentPage - 1)}
        disabled={currentPage === 1}
      >
        Previous
      </Button>

      {getPages().map((page, index) =>
        page === '...' ? (
          <span key={index} className="px-2 text-gray-500">
            …
          </span>
        ) : (
          <Button
            key={page}
            variant={page === currentPage ? 'primary' : 'ghost'}
            size="sm"
            onClick={() => changePage(page)}
            aria-current={page === currentPage ? 'page' : undefined}
          >
            {page}
          </Button>
        )
      )}

      <Button
        variant="ghost"
        size="sm"
        onClick={() => changePage(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        Next
      </Button>
    </nav>
  );
};

export default Pagination;
