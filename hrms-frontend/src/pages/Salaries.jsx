import { useState, useEffect } from 'react';
import api from '../api';
import { formatCurrency } from '../utils/currency';
import { useToast } from '../components/ui/Toast';

function Salaries() {
  const { showToast } = useToast();
  const [salaries, setSalaries] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState(null);
  const [formData, setFormData] = useState({
    employee_id: '',
    basic_salary: '',
    allowance: '',
    deductions: '',
  });
  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    Promise.all([fetchSalaries(), fetchEmployees()]);
  }, []);

  async function fetchSalaries() {
    try {
      const response = await api.get('/salaries');
      setSalaries(response.data.data);
    } catch (err) {
      console.error('Failed to fetch salaries:', err);
    }
  }

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

  const getEmployeeSalary = (employeeId) => {
    return salaries.find((s) => s.employee_id === employeeId);
  };

  const openCreateModal = (employeeId) => {
    setSelectedEmployeeId(employeeId);
    setFormData({
      employee_id: employeeId,
      basic_salary: '',
      allowance: '0',
      deductions: '0',
    });
    setFormErrors({});
    setShowModal(true);
  };

  const openEditModal = (salary) => {
    setSelectedEmployeeId(salary.employee_id);
    setFormData({
      employee_id: salary.employee_id,
      basic_salary: salary.basic_salary,
      allowance: salary.allowance,
      deductions: salary.deductions,
    });
    setFormErrors({});
    setShowModal(true);
  };

  const calculateNetSalary = () => {
    const basic = parseFloat(formData.basic_salary) || 0;
    const allowance = parseFloat(formData.allowance) || 0;
    const deductions = parseFloat(formData.deductions) || 0;
    return basic + allowance - deductions;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setFormErrors({});

    try {
      await api.post('/salaries', formData);
      setShowModal(false);
      fetchSalaries();
      showToast(
        getEmployeeSalary(selectedEmployeeId)
          ? 'Salary updated successfully!'
          : 'Salary set successfully!',
        'success'
      );
    } catch (err) {
      if (err.response?.status === 422) {
        setFormErrors(err.response.data.errors || {});
      } else {
        const message = err.response?.data?.message || 'Failed to save salary';
        showToast(message, 'error');
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-spinner">
        <div className="spinner"></div>
      </div>
    );
  }

  // Get all active employees for the salary list
  const employeesWithSalary = employees.map((emp) => {
    const salary = getEmployeeSalary(emp.id);
    return {
      ...emp,
      salary: salary || null,
    };
  });

  return (
    <div>
      <div className="page-header">
        <h2>Salaries</h2>
        <p>Manage employee salary structures</p>
      </div>

      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Salary Records</h3>
        </div>

        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Employee</th>
                <th>Department</th>
                <th>Basic Salary</th>
                <th>Allowance</th>
                <th>Deductions</th>
                <th>Net Salary</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {employeesWithSalary.length === 0 ? (
                <tr>
                  <td colSpan="7">
                    <div className="empty-state">
                      <p>No employees found</p>
                    </div>
                  </td>
                </tr>
              ) : (
                employeesWithSalary.map((emp) => (
                  <tr key={emp.id}>
                    <td>
                      <div>
                        <strong>{emp.full_name}</strong>
                        <br />
                        <small style={{ color: '#6b7280' }}>
                          {emp.employee_code}
                        </small>
                      </div>
                    </td>
                    <td>{emp.department || '—'}</td>
                    {emp.salary ? (
                      <>
                        <td>{formatCurrency(emp.salary.basic_salary)}</td>
                        <td>{formatCurrency(emp.salary.allowance)}</td>
                        <td>{formatCurrency(emp.salary.deductions)}</td>
                        <td>
                          <strong>{formatCurrency(emp.salary.net_salary)}</strong>
                        </td>
                        <td>
                          <button
                            className="btn btn-secondary btn-sm"
                            onClick={() => openEditModal(emp.salary)}
                          >
                            Edit
                          </button>
                        </td>
                      </>
                    ) : (
                      <>
                        <td>—</td>
                        <td>—</td>
                        <td>—</td>
                        <td>—</td>
                        <td>
                          <button
                            className="btn btn-primary btn-sm"
                            onClick={() => openCreateModal(emp.id)}
                          >
                            Set Salary
                          </button>
                        </td>
                      </>
                    )}
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
              <h3>
                {getEmployeeSalary(selectedEmployeeId)
                  ? 'Edit Salary'
                  : 'Set Salary'}
              </h3>
              <button
                className="modal-close"
                onClick={() => setShowModal(false)}
              >
                &times;
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="form-group">
                  <label>Basic Salary *</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    className={`form-control ${formErrors.basic_salary ? 'error' : ''}`}
                    value={formData.basic_salary}
                    onChange={(e) =>
                      setFormData({ ...formData, basic_salary: e.target.value })
                    }
                    placeholder="Enter basic salary"
                  />
                  {formErrors.basic_salary && (
                    <p className="error-message">{formErrors.basic_salary[0]}</p>
                  )}
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Allowance *</label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      className={`form-control ${formErrors.allowance ? 'error' : ''}`}
                      value={formData.allowance}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          allowance: e.target.value,
                        })
                      }
                      placeholder="Enter allowance"
                    />
                    {formErrors.allowance && (
                      <p className="error-message">{formErrors.allowance[0]}</p>
                    )}
                  </div>
                  <div className="form-group">
                    <label>Deductions *</label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      className={`form-control ${formErrors.deductions ? 'error' : ''}`}
                      value={formData.deductions}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          deductions: e.target.value,
                        })
                      }
                      placeholder="Enter deductions"
                    />
                    {formErrors.deductions && (
                      <p className="error-message">{formErrors.deductions[0]}</p>
                    )}
                  </div>
                </div>

                <div className="net-salary-preview">
                  <div className="label">Net Salary (Auto-calculated)</div>
                  <div className="value">{formatCurrency(calculateNetSalary())}</div>
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
    </div>
  );
}

export default Salaries;
