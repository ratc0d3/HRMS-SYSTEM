import { useCallback, useEffect, useState } from "react";
import api from "../api";
import { formatCurrency } from "../utils/currency";

function Payroll() {
  const [payroll, setPayroll] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dateFilter, setDateFilter] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    payroll_date: new Date().toISOString().split("T")[0],
    employee_id: "",
  });
  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const fetchPayroll = useCallback(async () => {
    try {
      const params = {};
      if (dateFilter) params.payroll_date = dateFilter;
      const response = await api.get("/payroll", { params });
      setPayroll(response.data.data);
    } catch (err) {
      console.error("Failed to fetch payroll:", err);
    }
  }, [dateFilter]);

  const fetchEmployees = useCallback(async () => {
    try {
      const response = await api.get("/employees");
      setEmployees(response.data.data);
    } catch (err) {
      console.error("Failed to fetch employees:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      Promise.all([fetchPayroll(), fetchEmployees()]);
    }, 0);

    return () => clearTimeout(timeoutId);
  }, [fetchPayroll, fetchEmployees]);

  const openModal = () => {
    setFormData({
      payroll_date: new Date().toISOString().split("T")[0],
      employee_id: "",
    });
    setFormErrors({});
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setFormErrors({});

    try {
      const payload = {
        payroll_date: formData.payroll_date,
      };
      // Only include employee_id if selected; otherwise generate for all eligible employees.
      if (formData.employee_id) {
        payload.employee_id = formData.employee_id;
      }

      await api.post("/payroll/generate", payload);
      setShowModal(false);
      fetchPayroll();
      alert("Payroll generated successfully!");
    } catch (err) {
      if (err.response?.status === 422) {
        setFormErrors(err.response.data.errors || {});
      } else {
        alert(err.response?.data?.message || "Failed to generate payroll");
      }
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handlePrint = () => {
    window.print();
  };

  // Calculate totals
  const totals = payroll.reduce(
    (acc, record) => ({
      basic_salary: acc.basic_salary + parseFloat(record.basic_salary),
      allowance: acc.allowance + parseFloat(record.allowance),
      deductions: acc.deductions + parseFloat(record.deductions),
      net_salary: acc.net_salary + parseFloat(record.net_salary),
    }),
    { basic_salary: 0, allowance: 0, deductions: 0, net_salary: 0 },
  );

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
        <h2>Payroll</h2>
        <p>Generate and view payroll records</p>
      </div>

      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Payroll History</h3>
          <div style={{ display: "flex", gap: "10px" }}>
            <button className="btn btn-secondary" onClick={handlePrint}>
              Print
            </button>
            <button className="btn btn-primary" onClick={openModal}>
              + Generate Payroll
            </button>
          </div>
        </div>

        <div className="search-filter-bar">
          <div className="form-group" style={{ margin: 0 }}>
            <input
              type="date"
              className="form-control"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              style={{ width: "200px" }}
              placeholder="Filter by date"
            />
          </div>
          {dateFilter && (
            <button
              className="btn btn-secondary btn-sm"
              onClick={() => setDateFilter("")}
            >
              Clear Filter
            </button>
          )}
        </div>

        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Employee</th>
                <th>Payroll Date</th>
                <th>Basic Salary</th>
                <th>Allowance</th>
                <th>Deductions</th>
                <th>Net Salary</th>
              </tr>
            </thead>
            <tbody>
              {payroll.length === 0 ? (
                <tr>
                  <td colSpan="6">
                    <div className="empty-state">
                      <p>No payroll records found</p>
                    </div>
                  </td>
                </tr>
              ) : (
                <>
                  {payroll.map((record) => (
                    <tr key={record.id}>
                      <td>
                        <div>
                          <strong>{record.employee?.full_name}</strong>
                          <br />
                          <small style={{ color: "#6b7280" }}>
                            {record.employee?.employee_code}
                          </small>
                        </div>
                      </td>
                      <td>{formatDate(record.payroll_date)}</td>
                      <td>{formatCurrency(record.basic_salary)}</td>
                      <td>{formatCurrency(record.allowance)}</td>
                      <td>{formatCurrency(record.deductions)}</td>
                      <td>
                        <strong>{formatCurrency(record.net_salary)}</strong>
                      </td>
                    </tr>
                  ))}
                  {payroll.length > 0 && (
                    <tr className="totals-row">
                      <td colSpan="2">
                        <strong>Totals</strong>
                      </td>
                      <td>
                        <strong>{formatCurrency(totals.basic_salary)}</strong>
                      </td>
                      <td>
                        <strong>{formatCurrency(totals.allowance)}</strong>
                      </td>
                      <td>
                        <strong>{formatCurrency(totals.deductions)}</strong>
                      </td>
                      <td>
                        <strong>{formatCurrency(totals.net_salary)}</strong>
                      </td>
                    </tr>
                  )}
                </>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Generate Payroll Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>Generate Payroll</h3>
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
                  <label>Payroll Date *</label>
                  <input
                    type="date"
                    className={`form-control ${formErrors.payroll_date ? "error" : ""}`}
                    value={formData.payroll_date}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        payroll_date: e.target.value,
                      })
                    }
                  />
                  {formErrors.payroll_date && (
                    <p className="error-message">
                      {formErrors.payroll_date[0]}
                    </p>
                  )}
                </div>

                <div className="form-group">
                  <label>Employee (Optional)</label>
                  <select
                    className={`form-control ${formErrors.employee_id ? "error" : ""}`}
                    value={formData.employee_id}
                    onChange={(e) =>
                      setFormData({ ...formData, employee_id: e.target.value })
                    }
                  >
                    <option value="">All Active / On Leave Employees</option>
                    {employees
                      .filter((emp) =>
                        ["Active", "On Leave"].includes(emp.employment_status),
                      )
                      .map((emp) => (
                        <option key={emp.id} value={emp.id}>
                          {emp.full_name} ({emp.employee_code})
                        </option>
                      ))}
                  </select>
                  {formErrors.employee_id && (
                    <p className="error-message">{formErrors.employee_id[0]}</p>
                  )}
                  <small
                    style={{
                      color: "#6b7280",
                      marginTop: "5px",
                      display: "block",
                    }}
                  >
                    Leave empty to generate payroll for active and on-leave
                    employees with salary records.
                  </small>
                </div>

                <div
                  style={{
                    background: "#f9fafb",
                    padding: "15px",
                    borderRadius: "6px",
                  }}
                >
                  <p
                    style={{
                      fontSize: "0.875rem",
                      color: "#374151",
                      margin: 0,
                    }}
                  >
                    <strong>Note:</strong> This will create a snapshot of each
                    employee's current salary. Any future changes to salary
                    records will not affect past payroll entries.
                  </p>
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
                  {submitting ? "Generating..." : "Generate"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Payroll;
