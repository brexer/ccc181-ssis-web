import CollegesTable from "../components/tables/collegesTable";
export default function CollegesPage() {
  const mockColleges = [
    {collegecode: "CCS", collegename: "College of Computer Studies", numberofprograms:"2"}
  ];

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Colleges</h2>
      <CollegesTable colleges ={mockColleges} />
    </div>
  );
}