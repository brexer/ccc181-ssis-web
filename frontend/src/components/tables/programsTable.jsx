export default function ProgramsTable({ programs, onEdit, onDelete }) {
  return (
    <div className="overflow-x-auto">
      <table className="table table-zebra w-full">
        <thead>
          <tr>
            <th>Program Code</th>
            <th>Program Name</th>
            <th>College Code</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {programs.map((s) => (
            <tr key={s.programcode}>
              <td>{s.programcode}</td>
              <td>{s.programname}</td>
              <td>{s.collegecode}</td>
              <td>
                <button 
                  className="btn btn-xs btn-info mr-1"
                  onClick={() => onEdit(s.programcode)}
                >
                  Edit
                </button>
                <button 
                  className="btn btn-xs btn-error"
                  onClick={() => onDelete(s.programcode)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}