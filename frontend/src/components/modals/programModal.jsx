import { useState, useEffect } from 'react';

export default function ProgramModal({ program, colleges, onSave, onClose }) {
    const [formData, setFormData] = useState({ code: '', name: '', collegeCode: '' });
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    console.log(colleges);

    useEffect(() => {
        if (program) {
            setFormData({ code: program.code, name: program.name, collegeCode: program.collegeCode || ''});
        } else {
            setFormData({ code: '', name:'', collegeCode: ''});
        }
    }, [program]);

    const codeRegex = /^[A-Za-z\s]{2,10}$/;
    const nameRegex = /^[A-Za-z\s]{1,60}$/;

    const validateForm = () => {
        const newErrors = {};

        if (!formData.code.trim()){
            newErrors.code = 'Program code is required';
        } else if (!codeRegex.test(formData.code)){
            newErrors.code = 'Code must be 2-10 letters (no numbers or special characters)';
        }

        if (!formData.name.trim()) {
            newErrors.name = 'Program name is required';
        } else if (!nameRegex.test(formData.name)) {
            newErrors.name = 'Name must be 1-60 letters (no numbers or special characters)';
        }

        if (!formData.collegeCode) {
            newErrors.collegeCode = 'College is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        const finalValue = name === 'code' ? value.toUpperCase() : value;
        
        setFormData(prev => ({
            ...prev,
            [name]: finalValue
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
            console.error('Error saving program:', err);
        } finally {
            setIsSubmitting(false);
        }
    };

  return (
    <>
      <div className="modal modal-open">
        <div className="modal-box">
          <h3 className="font-bold text-lg">
            {program ? 'Edit Program' : 'Add New Program'}
          </h3>

          <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            {/* Program Code Input */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Program Code</span>
                <span className="label-text-alt text-xs text-gray-500">
                  (2-10 letters)
                </span>
              </label>
              <input
                type="text"
                name="code"
                placeholder="e.g., BSCS"
                className={`input input-bordered w-full ${
                  errors.code ? 'input-error' : ''
                }`}
                value={formData.code}
                onChange={handleInputChange}
                maxLength="10"
              />
              {errors.code && (
                <label className="label">
                  <span className="label-text-alt text-error">{errors.code}</span>
                </label>
              )}
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Program Name</span>
                <span className="label-text-alt text-xs text-gray-500">
                  (1-60 letters)
                </span>
              </label>
              <input
                type="text"
                name="name"
                placeholder="e.g., Bachelor of Science in Computer Science"
                className={`input input-bordered w-full ${
                  errors.name ? 'input-error' : ''
                }`}
                value={formData.name}
                onChange={handleInputChange}
                maxLength="60"
              />
              {errors.name && (
                <label className="label">
                  <span className="label-text-alt text-error">{errors.name}</span>
                </label>
              )}
            </div>
            {/*College combobox*/}
            <div className="form-control">
                <label className="label">
                    <span className="label-text">College</span>
                </label>
                <select
                    name="collegeCode"
                    className="select select-bordered w-full"
                    value={formData.collegeCode}
                    onChange={handleInputChange}
                    required
                >
                    <option value="">Select a college</option>
                    {colleges.map(college => (
                        <option key={college.collegecode} value={college.collegecode}>
                            {college.collegename}
                        </option>
                    ))}
                </select>
                {errors.collegeCode && (
                    <label className="label">
                        <span className="label-text-alt text-error">{errors.collegeCode}</span>
                    </label>
                )}
            </div>

            <div className="modal-action">
              <button
                type="button"
                className="btn"
                onClick={onClose}
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                className={`btn btn-primary ${isSubmitting ? 'loading' : ''}`}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Saving...' : program ? 'Update' : 'Add'}
              </button>
            </div>
          </form>
        </div>

        <form method="dialog" className="modal-backdrop">
          <button onClick={onClose}>close</button>
        </form>
      </div>
    </>
  );
}