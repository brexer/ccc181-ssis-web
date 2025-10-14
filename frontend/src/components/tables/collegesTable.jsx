export default CollegesTable;
function CollegesTable({ colleges, onEdit, onDelete }) {
  return (
    <div className="overflow-x-auto">
      <table className="table table-zebra w-full">
        <thead>
          <tr>
            <th>College Code</th>
            <th>College Name</th>
            <th>Number of Programs</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {colleges.map((s) => (
            <tr key={s.collegecode}>
              <td>{s.collegecode}</td>
              <td>{s.collegename}</td>
              <td>{s.numberofprograms}</td>
              <td>
                <button 
                  className="btn btn-xs btn-info mr-1"
                  onClick={() => onEdit(s.collegecode)}
                >
                  Edit
                </button>
                <button 
                  className="btn btn-xs btn-error"
                  onClick={() => onDelete(s.collegecode)}
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