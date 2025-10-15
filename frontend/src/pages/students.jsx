import { useState, useEffect } from "react";
import StudentsTable from "../components/tables/studentsTable";
import StudentModal from "../components/modals/StudentModal"
import * as api from '../services/api'

export default function StudentsPage() {
  const [students, setStudents] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [formData, setFormData] = useState({ 
    id: '', firstname: '', lastname: '', gender: '', year: '', programCode: ''
   });

  useEffect(() => {
    fetchStudents();
    fetchPrograms();
  }, []);

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
      console.error('Failed to fetch colleges', err);
    }
  };

  const handleAddStudent = () => {
    setEditingStudent(null);
    setFormData({ 
      id: '',
      firstname: '',
      lastname: '',
      gender: '',
      year: '',
      programCode: ''
    });
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
    setFormData({
      id: '',
      firstname: '',
      lastname: '',
      gender: '',
      year: '',
      programCode: ''
     });
  }; 

  const handleSaveStudent = async (data) => {
    try {
      if (editingStudent) {
        // update existing student
        await api.updateStudent(editingStudent, {
          id: data.id,
          firstname: data.firstname,
          lastname: data.lastname,
          gender: data.gender,
          year: data.year,
          program_code: data.programCode
        });
        alert('Student updated successfully!');
      } else {
        // add new student
        await api.addStudent({
          id: data.id,
          firstname: data.firstname,
          lastname: data.lastname,
          gender: data.gender,
          year: data.year,
          program_code: data.programCode
        });
        alert('Student added successfully!');
      }

      // refresh the list and close modal
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
        <button
          className="btn btn-primary btn-sm"
          onClick={handleAddStudent}
        >
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

      <StudentsTable
        students={students}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {showModal && (
        <StudentModal
          student={editingStudent ? formData : null}
          programs={programs}
          onSave={handleSaveStudent}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
}