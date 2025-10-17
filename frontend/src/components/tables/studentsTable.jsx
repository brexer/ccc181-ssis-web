export default function StudentsTable({ students, onEdit, onDelete, onSort, sortField, sortOrder }) {
  const getSortIcon = (field) => {
    if (sortField !== field) return " ⇅";
    return sortOrder === "asc" ? " ↑" : " ↓";
  };

  const SortableHeader = ({ field, label }) => (
    <th
      onClick={() => onSort(field)}
      className="cursor-pointer hover:bg-gray-200 select-none"
      title={`Click to sort by ${label}`}
    >
      {label}
      {getSortIcon(field)}
    </th>
  );

  return (
    <div className="overflow-x-auto">
      <table className="table table-zebra w-full">
        <thead>
          <tr>
            <SortableHeader field="id" label="Student ID" />
            <SortableHeader field="firstname" label="First Name" />
            <SortableHeader field="lastname" label="Last Name" />
            <SortableHeader field="course" label="Program" />
            <SortableHeader field="year" label="Year" />
            <SortableHeader field="gender" label="Gender" />
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {students.length === 0 ? (
            <tr>
              <td colSpan="7" className="text-center text-gray-500 py-4">
                No students found
              </td>
            </tr>
          ) : (
            students.map((s) => (
              <tr key={s.id}>
                <td>{s.id}</td>
                <td>{s.firstname}</td>
                <td>{s.lastname}</td>
                <td>{s.course}</td>
                <td>{s.year}</td>
                <td>{s.gender}</td>
                <td>
                  <button className="btn btn-xs btn-info mr-1" onClick={() => onEdit(s.id)}>
                    Edit
                  </button>
                  <button className="btn btn-xs btn-error" onClick={() => onDelete(s.id)}>
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