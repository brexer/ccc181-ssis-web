import { useState, useEffect } from "react";
import CollegesTable from "../components/tables/collegesTable";
import CollegeModal from "../components/modals/collegeModal";
import * as api from '../services/api'

export default function CollegesPage() {
  const [colleges, setColleges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingCollege, setEditingCollege] = useState(null);
  const [filteredColleges, setFilteredColleges] = useState([])
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState('collegecode');
  const [sortOrder, setSortOrder] = useState('asc');
  const [formData, setFormData] = useState({ code: '', name: '' });

  useEffect(() => {
    fetchColleges();
  }, []);

  useEffect(() => {
    let result = [...colleges];

    // search
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(college => 
        college.collegecode.toLowerCase().includes(query) ||
        college.collegename.toLowerCase().includes(query)
      );
    }

    // sort
    result.sort((a, b) => {
      let aValue = a[sortField];
      let bValue = b[sortField];

      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    setFilteredColleges(result);
  }, [colleges, searchQuery, sortField, sortOrder]);

  const handleSort = (field) => {
  if (sortField === field) {
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  } else {
    setSortField(field);
    setSortOrder('asc');
  }
};

  const fetchColleges = async () => {
    setLoading(true);
    try {
      const response = await api.getColleges();
      setColleges(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch colleges');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddCollege = () => {
    setEditingCollege(null);
    setFormData({ code: '', name: '' });
    setShowModal(true);
  };

  const handleEdit = (collegeCode) => {
    const college = colleges.find(c => c.collegecode === collegeCode);
    if (college) {
      setEditingCollege(collegeCode);
      setFormData({
        code: college.collegecode,
        name: college.collegename
      });
      setShowModal(true);
    }
  };

  const handleDelete = async (collegeCode) => {
    if (window.confirm('Are you sure you want to delete this college?')) {
      try {
        await api.deleteCollege(collegeCode);
        setColleges(colleges.filter(c => c.collegecode !== collegeCode));
        setError(null);
        alert('College deleted successfully!');
      } catch (err) {
        setError('Failed to delete college');
        console.error(err);
      }
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingCollege(null);
    setFormData({ code: '', name: '' });
  };

  const handleSaveCollege = async (data) => {
    try {
      if (editingCollege) {
        // update existing college
        await api.updateCollege(editingCollege, {
          code: data.code,
          name: data.name
        });
        alert('College updated successfully!');
      } else {
        // add new college
        await api.addCollege({
          code: data.code,
          name: data.name
        });
        alert('College added successfully!');
      }

      // refresh the list and close modal
      fetchColleges();
      handleCloseModal();
      setError(null);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save college');
      console.error(err);
    }
  };

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Colleges</h2>
        <button
          className="btn btn-primary btn-sm"
          onClick={handleAddCollege}
        >
          + Add College
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
          placeholder="Search by college code or name..."
          className="input input-bordered w-full"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        {searchQuery && (
          <p className="text-sm text-gray-600 mt-2">
            Found {filteredColleges.length} result(s)
          </p>
        )}
      </div>

      <CollegesTable
        colleges={filteredColleges}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onSort={handleSort}
        sortField={sortField}
        sortOrder={sortOrder}
      />

      {showModal && (
        <CollegeModal
          college={editingCollege ? { code: formData.code, name: formData.name } : null}
          onSave={handleSaveCollege}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
}