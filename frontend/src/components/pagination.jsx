export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  itemsPerPage,
  onItemsPerPageChange,
  totalItems,
}) {
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mt-6 p-4 bg-base-100 rounded-xl shadow-sm border border-base-200">
      <div className="flex items-center gap-2">
        <label className="text-sm font-medium">Items per page:</label>
        <select
          value={itemsPerPage}
          onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
          className="select select-sm select-bordered"
        >
          <option value="5">5</option>
          <option value="10">10</option>
          <option value="25">25</option>
          <option value="50">50</option>
        </select>
      </div>

      <div className="text-sm text-gray-600 text-center">
        Showing {startItem} to {endItem} of {totalItems} items
      </div>

      <div className="flex items-center gap-2">
        <button
          aria-label="Previous page"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="btn btn-sm btn-outline"
        >
          Previous
        </button>

        <div className="flex gap-1 overflow-x-auto">
          {Array.from({ length: totalPages }, (_, i) => i + 1)
            .filter((page) => {
              const diff = Math.abs(page - currentPage);
              return diff <= 1 || page === 1 || page === totalPages;
            })
            .map((page, index, array) => (
              <div key={page} className="flex-shrink-0">
                {index > 0 && array[index - 1] !== page - 1 && (
                  <span className="px-2">...</span>
                )}
                <button
                  onClick={() => onPageChange(page)}
                  className={`btn btn-sm transition-colors duration-200 ${
                    currentPage === page
                      ? 'btn-primary'
                      : 'btn-outline hover:bg-[#F9B17A]/20 hover:text-[#F9B17A]'
                  }`}
                >
                  {page}
                </button>
              </div>
            ))}
        </div>

        <button
          aria-label="Next page"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="btn btn-sm btn-outline"
        >
          Next
        </button>
      </div>
    </div>
  );
}