import StudentsTable from "../components/tables/studentsTable";
export default function StudentsPage() {
  const mockStudents = [
    { id: "2025-0001", firstname: "Bryle", lastname: "Fantilanan", course: "BSCS", year: 2, gender: "Male" },
    { id: "2025-0002", firstname: "Leslie", lastname: "Fantilanan", course: "BSIT", year: 1, gender: "Female" },
  ];

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Students</h2>
      <StudentsTable students={mockStudents} />
    </div>
  );
}
