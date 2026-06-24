import { useState, useEffect } from 'react';
import api from '../api';
import { useToast } from '../components/ui/Toast';

function Employees() {
  const { showToast } = useToast();
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    contact_number: '',
    position: '',
    department: '',
    date_hired: '',
    employment_status: 'Active',
  });
  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchEmployees();
  }, []);

  async function fetchEmployees() {
    try {
      const response = await api.get('/employees');
      setEmployees(response.data.data);
    } catch (err) {
      console.error('Failed to fetch employees:', err);
    } finally {
      setLoading(false);
    }
  }

  const filteredEmployees = employees.filter((emp) => {
    const matchesSearch =
      emp.full_name.toLowerCase().includes(search.toLowerCase()) ||
      emp.email.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = !statusFilter || emp.employment_status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const openCreateModal = () => {
    setSelectedEmployee(null);
    setFormData({
      full_name: '',
      email: '',
      contact_number: '',
      position: '',
      department: '',
      date_hired: '',
      employment_status: 'Active',
    });
    setFormErrors({});
    setShowModal(true);
  };

  const openEditModal = (employee) => {
    setSelectedEmployee(employee);
    setFormData({
      full_name: employee.full_name,
      email: employee.email,
      contact_number: employee.contact_number || '',
      position: employee.position || '',
      department: employee.department || '',
      date_hired: employee.date_hired,
      employment_status: employee.employment_status,
    });
    setFormErrors({});
    setShowModal(true);
  };

  const openDeleteConfirm = (employee) => {
    setSelectedEmployee(employee);
    setShowDeleteConfirm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setFormErrors({});

    try {
      if (selectedEmployee) {
        await api.put(`/employees/${selectedEmployee.id}`, formData);
      } else {
        await api.post('/employees', formData);
      }
      setShowModal(false);
      fetchEmployees();
      showToast(
        selectedEmployee
          ? 'Employee updated successfully!'
          : 'Employee created successfully!',
        'success'
      );
    } catch (err) {
      if (err.response?.status === 422) {
        setFormErrors(err.response.data.errors || {});
      } else {
        showToast('Failed to save employee', 'error');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/employees/${selectedEmployee.id}`);
      setShowDeleteConfirm(false);
      fetchEmployees();
      showToast('Employee deleted successfully!', 'success');
    } catch {
      showToast('Failed to delete employee', 'error');
    }
  };

  const getStatusBadge = (status) => {
    const statusClass = status.toLowerCase().replace(' ', '-');
    return <span className={`badge badge-${statusClass}`}>{status}</span>;
  };

  if (loading) {
    return (
      <div className="loading-spinner">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="page-header">
        <h2>Employees</h2>
        <p>Manage employee records</p>
      </div>

      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Employee List</h3>
          <button className="btn btn-primary" onClick={openCreateModal}>
            + Add Employee
          </button>
        </div>

        <div className="search-filter-bar">
          <div className="search-input">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              width="20"
              height="20"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
              />
            </svg>
            <input
              type="text"
              placeholder="Search by name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <select
            className="filter-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">All Status</option>
            <option value="Active">Active</option>
            <option value="On Leave">On Leave</option>
            <option value="Resigned">Resigned</option>
          </select>
        </div>

        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Code</th>
                <th>Name</th>
                <th>Email</th>
                <th>Department</th>
                <th>Position</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredEmployees.length === 0 ? (
                <tr>
                  <td colSpan="7">
                    <div className="empty-state">
                      <p>No employees found</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredEmployees.map((employee) => (
                  <tr key={employee.id}>
                    <td>{employee.employee_code}</td>
                    <td>{employee.full_name}</td>
                    <td>{employee.email}</td>
                    <td>{employee.department || '—'}</td>
                    <td>{employee.position || '—'}</td>
                    <td>{getStatusBadge(employee.employment_status)}</td>
                    <td>
                      <div className="actions">
                        <button
                          className="btn btn-secondary btn-sm"
                          onClick={() => openEditModal(employee)}
                        >
                          Edit
                        </button>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => openDeleteConfirm(employee)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>{selectedEmployee ? 'Edit Employee' : 'Add Employee'}</h3>
              <button
                className="modal-close"
                onClick={() => setShowModal(false)}
              >
                &times;
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="form-row">
                  <div className="form-group">
                    <label>Full Name *</label>
                    <input
                      type="text"
                      className={`form-control ${formErrors.full_name ? 'error' : ''}`}
                      value={formData.full_name}
                      onChange={(e) =>
                        setFormData({ ...formData, full_name: e.target.value })
                      }
                    />
                    {formErrors.full_name && (
                      <p className="error-message">{formErrors.full_name[0]}</p>
                    )}
                  </div>
                  <div className="form-group">
                    <label>Email *</label>
                    <input
                      type="email"
                      className={`form-control ${formErrors.email ? 'error' : ''}`}
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                    />
                    {formErrors.email && (
                      <p className="error-message">{formErrors.email[0]}</p>
                    )}
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Contact Number</label>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.contact_number}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          contact_number: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="form-group">
                    <label>Position</label>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.position}
                      onChange={(e) =>
                        setFormData({ ...formData, position: e.target.value })
                      }
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Department</label>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.department}
                      onChange={(e) =>
                        setFormData({ ...formData, department: e.target.value })
                      }
                    />
                  </div>
                  <div className="form-group">
                    <label>Date Hired *</label>
                    <input
                      type="date"
                      className={`form-control ${formErrors.date_hired ? 'error' : ''}`}
                      value={formData.date_hired}
                      onChange={(e) =>
                        setFormData({ ...formData, date_hired: e.target.value })
                      }
                    />
                    {formErrors.date_hired && (
                      <p className="error-message">{formErrors.date_hired[0]}</p>
                    )}
                  </div>
                </div>

                <div className="form-group">
                  <label>Employment Status *</label>
                  <select
                    className={`form-control ${formErrors.employment_status ? 'error' : ''}`}
                    value={formData.employment_status}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        employment_status: e.target.value,
                      })
                    }
                  >
                    <option value="Active">Active</option>
                    <option value="On Leave">On Leave</option>
                    <option value="Resigned">Resigned</option>
                  </select>
                  {formErrors.employment_status && (
                    <p className="error-message">
                      {formErrors.employment_status[0]}
                    </p>
                  )}
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={submitting}
                >
                  {submitting ? 'Saving...' : 'Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {showDeleteConfirm && (
        <div className="modal-overlay">
          <div className="modal" style={{ maxWidth: '400px' }}>
            <div className="modal-header">
              <h3>Confirm Delete</h3>
              <button
                className="modal-close"
                onClick={() => setShowDeleteConfirm(false)}
              >
                &times;
              </button>
            </div>
            <div className="modal-body">
              <p className="confirm-message">
                Are you sure you want to delete{' '}
                <strong>{selectedEmployee?.full_name}</strong>? This action
                cannot be undone.
              </p>
            </div>
            <div className="modal-footer">
              <button
                className="btn btn-secondary"
                onClick={() => setShowDeleteConfirm(false)}
              >
                Cancel
              </button>
              <button className="btn btn-danger" onClick={handleDelete}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Employees;
