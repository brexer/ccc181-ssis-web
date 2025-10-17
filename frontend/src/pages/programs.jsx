import { useState, useEffect } from "react";
import ProgramsTable from "../components/tables/programsTable";
import ProgramModal from "../components/modals/programModal";
import Pagination from "../components/pagination";
import * as api from "../services/api";

export default function ProgramsPage() {
  const [programs, setPrograms] = useState([]);
  const [colleges, setColleges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingProgram, setEditingProgram] = useState(null);
  const [filteredPrograms, setFilteredPrograms] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortField, setSortField] = useState("programcode");
  const [sortOrder, setSortOrder] = useState("asc");
  const [formData, setFormData] = useState({ code: "", name: "", collegeCode: "" });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  useEffect(() => {
    fetchPrograms();
    fetchColleges();
  }, []);

  useEffect(() => {
    let result = [...programs];

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.programcode.toLowerCase().includes(query) ||
          p.programname.toLowerCase().includes(query) ||
          (p.collegecode && p.collegecode.toLowerCase().includes(query))
      );
    }

    result.sort((a, b) => {
      let aValue = a[sortField];
      let bValue = b[sortField];

      if (typeof aValue === "string") {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      if (aValue < bValue) return sortOrder === "asc" ? -1 : 1;
      if (aValue > bValue) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });

    setFilteredPrograms(result);
    setCurrentPage(1);
  }, [programs, searchQuery, sortField, sortOrder]);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const totalItems = filteredPrograms.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentPrograms = filteredPrograms.slice(indexOfFirstItem, indexOfLastItem);

  const handleItemsPerPageChange = (value) => {
    setItemsPerPage(value);
    setCurrentPage(1);
  };

  const fetchPrograms = async () => {
    setLoading(true);
    try {
      const response = await api.getPrograms();
      setPrograms(response.data);
      setError(null);
    } catch (err) {
      setError("Failed to fetch programs");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchColleges = async () => {
    try {
      const response = await api.getColleges();
      setColleges(response.data);
    } catch (err) {
      console.error("Failed to fetch colleges", err);
    }
  };

  const handleAddProgram = () => {
    setEditingProgram(null);
    setFormData({ code: "", name: "", collegeCode: "" });
    setShowModal(true);
  };

  const handleEdit = (programCode) => {
    const program = programs.find((p) => p.programcode === programCode);
    if (program) {
      setEditingProgram(programCode);
      setFormData({
        code: program.programcode,
        name: program.programname,
        collegeCode: program.collegecode,
      });
      setShowModal(true);
    }
  };

  const handleDelete = async (programCode) => {
    if (window.confirm("Are you sure you want to delete this program?")) {
      try {
        await api.deleteProgram(programCode);
        setPrograms(programs.filter((p) => p.programcode !== programCode));
        setError(null);
        alert("Program deleted successfully!");
      } catch (err) {
        setError("Failed to delete program");
        console.error(err);
      }
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingProgram(null);
    setFormData({ code: "", name: "", collegeCode: "" });
  };

  const handleSaveProgram = async (data) => {
    try {
      if (editingProgram) {
        // update existing program
        await api.updateProgram(editingProgram, {
          code: data.code,
          name: data.name,
          college_code: data.collegeCode,
        });
        alert("Program updated successfully!");
      } else {
        // add new program
        await api.addProgram({
          code: data.code,
          name: data.name,
          college_code: data.collegeCode,
        });
        alert("Program added successfully!");
      }

      // refresh list
      fetchPrograms();
      handleCloseModal();
      setError(null);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to save program");
      console.error(err);
    }
  };

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Programs</h2>
        <button className="btn btn-primary btn-sm" onClick={handleAddProgram}>
          + Add Program
        </button>
      </div>

      {error && (
        <div className="alert alert-error mb-4">
          <span>{error}</span>
          <button className="btn btn-sm btn-ghost" onClick={() => setError(null)}>
            ✕
          </button>
        </div>
      )}

      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by program code, name, or college..."
          className="input input-bordered w-full"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        {searchQuery && (
          <p className="text-sm text-gray-600 mt-2">
            Found {filteredPrograms.length} result(s)
          </p>
        )}
      </div>

      <ProgramsTable
        programs={currentPrograms}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onSort={handleSort}
        sortField={sortField}
        sortOrder={sortOrder}
      />

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        itemsPerPage={itemsPerPage}
        onItemsPerPageChange={handleItemsPerPageChange}
        totalItems={totalItems}
      />

      {showModal && (
        <ProgramModal
          program={editingProgram ? { ...formData } : null}
          colleges={colleges}
          onSave={handleSaveProgram}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
}
