export default function StudentsTable({ students }) {
  return (
    <div className="overflow-x-auto">
      <table className="table table-zebra w-full">
        <thead>
          <tr>
            <th>ID</th>
            <th>Firstname</th>
            <th>Lastname</th>
            <th>Course</th>
            <th>Year</th>
            <th>Gender</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {students.map((s) => (
            <tr key={s.id}>
              <td>{s.id}</td>
              <td>{s.firstname}</td>
              <td>{s.lastname}</td>
              <td>{s.course}</td>
              <td>{s.year}</td>
              <td>{s.gender}</td>
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