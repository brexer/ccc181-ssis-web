export default ProgramsTable;
function ProgramsTable({ programs }) {
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
            <tr key={s.id}>
              <td>{s.programcode}</td>
              <td>{s.programname}</td>
              <td>{s.collegecode}</td>
              <td>
                <button className="btn btn-xs btn-info mr-1">Edit</button>
                <button className="btn btn-xs btn-error">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}