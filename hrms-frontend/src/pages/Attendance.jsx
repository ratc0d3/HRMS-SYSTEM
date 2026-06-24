import { useCallback, useEffect, useState } from "react";
import api from "../api";
import { useToast } from "../components/ui/Toast";
import { useConfirm } from "../hooks/useConfirm";

function Attendance() {
  const { showToast } = useToast();
  const { confirm } = useConfirm();
  const [attendance, setAttendance] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dateFilter, setDateFilter] = useState(
    new Date().toISOString().split("T")[0],
  );
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    employee_id: "",
    attendance_date: new Date().toISOString().split("T")[0],
    time_in: "",
    time_out: "",
    status: "Present",
  });
  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const fetchAttendance = useCallback(async () => {
    try {
      const params = {};
      if (dateFilter) params.date = dateFilter;
      const response = await api.get("/attendance", { params });
      setAttendance(response.data.data);
    } catch (err) {
      console.error("Failed to fetch attendance:", err);
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
      Promise.all([fetchAttendance(), fetchEmployees()]);
    }, 0);

    return () => clearTimeout(timeoutId);
  }, [fetchAttendance, fetchEmployees]);

  const openModal = () => {
    setFormData({
      employee_id: "",
      attendance_date: new Date().toISOString().split("T")[0],
      time_in: "",
      time_out: "",
      status: "Present",
    });
    setFormErrors({});
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setFormErrors({});

    try {
      await api.post("/attendance", formData);
      setShowModal(false);
      fetchAttendance();
      showToast("Attendance recorded successfully!", "success");
    } catch (err) {
      if (err.response?.status === 422) {
        setFormErrors(err.response.data.errors || {});
      } else {
        showToast("Failed to save attendance", "error");
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    const confirmed = await confirm({
      title: "Delete Attendance Record?",
      message: "Are you sure you want to delete this attendance record? This action cannot be undone.",
      variant: "danger",
      confirmLabel: "Delete"
    });
    
    if (!confirmed) return;
    
    try {
      await api.delete(`/attendance/${id}`);
      fetchAttendance();
      showToast("Attendance record deleted successfully!", "success");
    } catch {
      showToast("Failed to delete attendance record", "error");
    }
  };

  const getStatusBadge = (status) => {
    const statusClass = status.toLowerCase().replace(" ", "-");
    return <span className={`badge badge-${statusClass}`}>{status}</span>;
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
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
        <h2>Attendance</h2>
        <p>Track employee attendance records</p>
      </div>

      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Attendance Records</h3>
          <button className="btn btn-primary" onClick={openModal}>
            + Record Attendance
          </button>
        </div>

        <div className="search-filter-bar">
          <div className="form-group" style={{ margin: 0 }}>
            <input
              type="date"
              className="form-control"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              style={{ width: "200px" }}
            />
          </div>
        </div>

        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Employee</th>
                <th>Date</th>
                <th>Time In</th>
                <th>Time Out</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {attendance.length === 0 ? (
                <tr>
                  <td colSpan="6">
                    <div className="empty-state">
                      <p>No attendance records found for this date</p>
                    </div>
                  </td>
                </tr>
              ) : (
                attendance.map((record) => (
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
                    <td>{formatDate(record.attendance_date)}</td>
                    <td>{record.time_in || "—"}</td>
                    <td>{record.time_out || "—"}</td>
                    <td>{getStatusBadge(record.status)}</td>
                    <td>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDelete(record.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Record Attendance Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>Record Attendance</h3>
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
                  <label>Employee *</label>
                  <select
                    className={`form-control ${formErrors.employee_id ? "error" : ""}`}
                    value={formData.employee_id}
                    onChange={(e) =>
                      setFormData({ ...formData, employee_id: e.target.value })
                    }
                  >
                    <option value="">Select Employee</option>
                    {employees.map((emp) => (
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
                    Note: If an attendance record already exists for this
                    employee on this date, it will be updated (upsert).
                  </small>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Date *</label>
                    <input
                      type="date"
                      className={`form-control ${formErrors.attendance_date ? "error" : ""}`}
                      value={formData.attendance_date}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          attendance_date: e.target.value,
                        })
                      }
                    />
                    {formErrors.attendance_date && (
                      <p className="error-message">
                        {formErrors.attendance_date[0]}
                      </p>
                    )}
                  </div>
                  <div className="form-group">
                    <label>Status *</label>
                    <select
                      className={`form-control ${formErrors.status ? "error" : ""}`}
                      value={formData.status}
                      onChange={(e) =>
                        setFormData({ ...formData, status: e.target.value })
                      }
                    >
                      <option value="Present">Present</option>
                      <option value="Late">Late</option>
                      <option value="Absent">Absent</option>
                      <option value="On Leave">On Leave</option>
                    </select>
                    {formErrors.status && (
                      <p className="error-message">{formErrors.status[0]}</p>
                    )}
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Time In</label>
                    <input
                      type="time"
                      className="form-control"
                      value={formData.time_in}
                      onChange={(e) =>
                        setFormData({ ...formData, time_in: e.target.value })
                      }
                    />
                  </div>
                  <div className="form-group">
                    <label>Time Out</label>
                    <input
                      type="time"
                      className="form-control"
                      value={formData.time_out}
                      onChange={(e) =>
                        setFormData({ ...formData, time_out: e.target.value })
                      }
                    />
                  </div>
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
                  {submitting ? "Saving..." : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Attendance;
