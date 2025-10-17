import { useState, useEffect } from "react";
import StudentsTable from "../components/tables/studentsTable";
import StudentModal from "../components/modals/StudentModal";
import Pagination from "../components/pagination";
import * as api from '../services/api';

export default function StudentsPage() {
  const [students, setStudents] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState('id');
  const [sortOrder, setSortOrder] = useState('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [formData, setFormData] = useState({ 
    id: '', firstname: '', lastname: '', gender: '', year: '', programCode: ''
  });

  useEffect(() => {
    fetchStudents();
    fetchPrograms();
  }, []);

  useEffect(() => {
    let result = [...students];

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (s) =>
          s.id.toLowerCase().includes(query) ||
          s.firstname.toLowerCase().includes(query) ||
          s.lastname.toLowerCase().includes(query) ||
          s.gender.toLowerCase().includes(query) ||
          s.year.toLowerCase().includes(query) ||
          s.course.toLowerCase().includes(query)
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

    setFilteredStudents(result);
    setCurrentPage(1);
  }, [students, searchQuery, sortField, sortOrder]);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const totalItems = filteredStudents.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentStudents = filteredStudents.slice(indexOfFirstItem, indexOfLastItem);

  const handleItemsPerPageChange = (value) => {
    setItemsPerPage(value);
    setCurrentPage(1);
  };

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const response = await api.getStudents();
      setStudents(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch students');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchPrograms = async () => {
    try {
      const response = await api.getPrograms();
      setPrograms(response.data);
    } catch (err) {
      console.error('Failed to fetch programs', err);
    }
  };

  const handleAddStudent = () => {
    setEditingStudent(null);
    setFormData({ id: '', firstname: '', lastname: '', gender: '', year: '', programCode: '' });
    setShowModal(true);
  };

  const handleEdit = (studentId) => {
    const student = students.find(s => s.id === studentId);
    if (student) {
      setEditingStudent(studentId);
      setFormData({
        id: student.id,
        firstname: student.firstname,
        lastname: student.lastname,
        gender: student.gender,
        year: student.year,
        programCode: student.course,
      });
      setShowModal(true);
    }
  };

  const handleDelete = async (studentId) => {
    if (window.confirm('Are you sure you want to delete this student?')) {
      try {
        await api.deleteStudent(studentId);
        setStudents(students.filter(s => s.id !== studentId));
        setError(null);
        alert('Student deleted successfully!');
      } catch (err) {
        setError('Failed to delete student');
        console.error(err);
      }
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingStudent(null);
    setFormData({ id: '', firstname: '', lastname: '', gender: '', year: '', programCode: '' });
  };

  const handleSaveStudent = async (data) => {
    try {
      if (editingStudent) {
        await api.updateStudent(editingStudent, {
          id: data.id,
          firstname: data.firstname,
          lastname: data.lastname,
          gender: data.gender,
          year: data.year,
          program_code: data.programCode,
        });
        alert('Student updated successfully!');
      } else {
        await api.addStudent({
          id: data.id,
          firstname: data.firstname,
          lastname: data.lastname,
          gender: data.gender,
          year: data.year,
          program_code: data.programCode,
        });
        alert('Student added successfully!');
      }

      fetchStudents();
      handleCloseModal();
      setError(null);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save student');
      console.error(err);
    }
  };

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Students</h2>
        <button className="btn btn-primary btn-sm" onClick={handleAddStudent}>
          + Add Student
        </button>
      </div>

      {error && (
        <div className="alert alert-error mb-4">
          <span>{error}</span>
          <button
            className="btn btn-sm btn-ghost"
            onClick={() => setError(null)}
          >
            ✕
          </button>
        </div>
      )}

      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by ID, name, program, or year..."
          className="input input-bordered w-full"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        {searchQuery && (
          <p className="text-sm text-gray-600 mt-2">
            Found {filteredStudents.length} result(s)
          </p>
        )}
      </div>

      <StudentsTable
        students={currentStudents}
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
        <StudentModal
          student={editingStudent ? { ...formData } : null}
          programs={programs}
          onSave={handleSaveStudent}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
}
