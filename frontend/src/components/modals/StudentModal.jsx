import { useState, useEffect } from 'react';

export default function StudentModal({ student, programs, onSave, onClose }) {
  const [formData, setFormData] = useState({ 
    id: '', 
    firstname: '', 
    lastname: '', 
    gender: '',
    year: '', 
    programCode: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (student) {
      setFormData({ 
        id: student.id, 
        firstname: student.firstname, 
        lastname: student.lastname, 
        gender: student.gender,
        year: student.year,
        programCode: student.programCode || ''
      });
    } else {
      setFormData({ 
        id: '', 
        firstname: '', 
        lastname: '', 
        gender: '',
        year: '', 
        programCode: ''
      });
    }
  }, [student]);

  const idRegex = /^[0-9]{4}-[0-9]{4}$/;
  const nameRegex = /^[A-Za-z\s]{1,50}$/;

  const validateForm = () => {
    const newErrors = {};

    if (!formData.id.trim()) {
      newErrors.id = 'Student ID is required';
    } else if (!idRegex.test(formData.id)) {
      newErrors.id = 'ID must be in format: YYYY-NNNN (e.g., 2024-0001)';
    }

    if (!formData.firstname.trim()) {
      newErrors.firstname = 'First name is required';
    } else if (!nameRegex.test(formData.firstname)) {
      newErrors.firstname = 'Name must be 1-50 letters only';
    }

    if (!formData.lastname.trim()) {
      newErrors.lastname = 'Last name is required';
    } else if (!nameRegex.test(formData.lastname)) {
      newErrors.lastname = 'Name must be 1-50 letters only';
    }

    if (!formData.programCode) {
      newErrors.programCode = 'Program is required';
    }

    if (!formData.year) {
      newErrors.year = 'Year level is required';
    } else if (formData.year < 1 || formData.year > 5) {
      newErrors.year = 'Year must be between 1 and 5';
    }

    if (!formData.gender) {
      newErrors.gender = 'Gender is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setIsSubmitting(true);
      await onSave(formData);
    } catch (err) {
      console.error('Error saving student:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-base-100 rounded-2xl shadow-2xl w-full max-w-lg p-6 md:p-8 overflow-y-auto max-h-[90vh] border border-base-300">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-semibold text-lg md:text-xl text-base-content">
            {student ? "Edit Student" : "Add New Student"}
          </h3>
          <button
            onClick={onClose}
            className="
              btn btn-sm btn-ghost text-lg font-bold 
              hover:text-[#F9B17A] focus:text-[#F9B17A]
              transition-colors duration-200
            "
          >
            ✕
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Student ID */}
          <div className="form-control">
            <label className="label flex justify-between">
              <span className="label-text font-medium">Student ID</span>
              <span className="label-text-alt text-gray-500">(YYYY-NNNN)</span>
            </label>
            <input
              type="text"
              name="id"
              placeholder="2024-0001"
              className={`input input-bordered w-full ${
                errors.id ? "input-error" : ""
              }`}
              value={formData.id}
              onChange={handleInputChange}
              maxLength="9"
            />
            {errors.id && (
              <span className="text-xs text-error mt-1">{errors.id}</span>
            )}
          </div>

          {/* Name Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">First Name</span>
              </label>
              <input
                type="text"
                name="firstname"
                placeholder="e.g., Juan"
                className={`input input-bordered w-full ${
                  errors.firstname ? "input-error" : ""
                }`}
                value={formData.firstname}
                onChange={handleInputChange}
                maxLength="50"
              />
              {errors.firstname && (
                <span className="text-xs text-error mt-1">
                  {errors.firstname}
                </span>
              )}
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Last Name</span>
              </label>
              <input
                type="text"
                name="lastname"
                placeholder="e.g., Dela Cruz"
                className={`input input-bordered w-full ${
                  errors.lastname ? "input-error" : ""
                }`}
                value={formData.lastname}
                onChange={handleInputChange}
                maxLength="50"
              />
              {errors.lastname && (
                <span className="text-xs text-error mt-1">
                  {errors.lastname}
                </span>
              )}
            </div>
          </div>

          {/* Program */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium">Program</span>
            </label>
            <select
              name="programCode"
              className={`select select-bordered w-full ${
                errors.programCode ? "select-error" : ""
              }`}
              value={formData.programCode}
              onChange={handleInputChange}
            >
              <option value="">Select a program</option>
              {programs.map((program) => (
                <option key={program.programcode} value={program.programcode}>
                  {program.programname}
                </option>
              ))}
            </select>
            {errors.programCode && (
              <span className="text-xs text-error mt-1">
                {errors.programCode}
              </span>
            )}
          </div>

          {/* Year & Gender */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Year Level</span>
              </label>
              <select
                name="year"
                className={`select select-bordered w-full ${
                  errors.year ? "select-error" : ""
                }`}
                value={formData.year}
                onChange={handleInputChange}
              >
                <option value="">Select year level</option>
                <option value="1">1st Year</option>
                <option value="2">2nd Year</option>
                <option value="3">3rd Year</option>
                <option value="4">4th Year</option>
              </select>
              {errors.year && (
                <span className="text-xs text-error mt-1">{errors.year}</span>
              )}
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Gender</span>
              </label>
              <select
                name="gender"
                className={`select select-bordered w-full ${
                  errors.gender ? "select-error" : ""
                }`}
                value={formData.gender}
                onChange={handleInputChange}
              >
                <option value="">Select gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
              {errors.gender && (
                <span className="text-xs text-error mt-1">
                  {errors.gender}
                </span>
              )}
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-2 pt-6">
            <button
              type="button"
              className="
                btn btn-ghost
                hover:bg-[#F9B17A]/20
                hover:text-[#F9B17A]
                focus:bg-[#F9B17A]/20
                focus:text-[#F9B17A]
                transition-all duration-200
              "
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </button>

            <button
              type="submit"
              className={`btn btn-primary ${
                isSubmitting ? "loading" : ""
              }`}
              disabled={isSubmitting}
            >
              {isSubmitting
                ? "Saving..."
                : student
                ? "Update Student"
                : "Add Student"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}