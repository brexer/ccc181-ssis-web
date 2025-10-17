export default ProgramsTable;

function ProgramsTable({ programs, onEdit, onDelete, onSort, sortField, sortOrder }) {
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
            <SortableHeader field="programcode" label="Program Code" />
            <SortableHeader field="programname" label="Program Name" />
            <SortableHeader field="collegecode" label="College Code" />
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {programs.length === 0 ? (
            <tr>
              <td colSpan="4" className="text-center text-gray-500 py-4">
                No programs found
              </td>
            </tr>
          ) : (
            programs.map((program) => (
              <tr key={program.programcode}>
                <td>{program.programcode}</td>
                <td>{program.programname}</td>
                <td>{program.collegecode || '—'}</td>
                <td>
                  <button
                    className="btn btn-xs btn-info mr-1"
                    onClick={() => onEdit(program.programcode)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-xs btn-error"
                    onClick={() => onDelete(program.programcode)}
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