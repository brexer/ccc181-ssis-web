import ProgramsTable from "../components/tables/programsTable";
export default function ProgramsPage() {
  const mockPrograms = [
    {programcode: "BSCS", programname: "Bachelor of Science in Computer Science", collegecode:"CCS"},
    {programcode: "BSIT", programname: "Bachelor of Science in Information Technology", collegecode:"CCS"}
  ];

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Programs</h2>
      <ProgramsTable programs ={mockPrograms} />
    </div>
  );
}