export default CollegesTable;
function CollegesTable({ colleges, onEdit, onDelete, onSort, sortField, sortOrder }) {
  const getSortIcon = (field) => {
    if (sortField !== field) return ' ⇅';
    return sortOrder === 'asc' ? ' ↑' : ' ↓';
  };

  const SortableHeader = ({ field, label }) => (
    <th 
      onClick={() => onSort(field)}
      className="cursor-pointer hover:bg-gray-200 select-none"
      title={`Click to sort by ${label}`}
    >
      {label}{getSortIcon(field)}
    </th>
  );

  return (
    <div className="overflow-x-auto">
      <table className="table table-zebra w-full">
        <thead>
          <tr>
            <SortableHeader field="collegecode" label="College Code" />
            <SortableHeader field="collegename" label="College Name" />
            <SortableHeader field="numberofprograms" label="Number of Programs" />
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {colleges.length === 0 ? (
            <tr>
              <td colSpan="4" className="text-center text-gray-500 py-4">
                No colleges found
              </td>
            </tr>
          ) : (
            colleges.map((college) => (
              <tr key={college.collegecode}>
                <td>{college.collegecode}</td>
                <td>{college.collegename}</td>
                <td>{college.numberofprograms}</td>
                <td>
                  <button 
                    className="btn btn-xs btn-info mr-1"
                    onClick={() => onEdit(college.collegecode)}
                  >
                    Edit
                  </button>
                  <button 
                    className="btn btn-xs btn-error"
                    onClick={() => onDelete(college.collegecode)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}