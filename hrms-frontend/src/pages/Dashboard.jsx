import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import { formatCurrency } from '../utils/currency';

function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboard();
  }, []);

  async function fetchDashboard() {
    try {
      const response = await api.get('/dashboard');
      setStats(response.data.data);
    } catch {
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="loading-spinner">
        <div className="spinner"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card">
        <p className="error-message">{error}</p>
        <button className="btn btn-primary" onClick={fetchDashboard}>
          Retry
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="page-header">
        <h2>Dashboard</h2>
        <p>Welcome back! Here's your HR overview.</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Employees</h3>
          <div className="value">{stats?.total_employees || 0}</div>
        </div>
        <div className="stat-card active">
          <h3>Active Employees</h3>
          <div className="value">{stats?.active_employees || 0}</div>
        </div>
        <div className="stat-card on-leave">
          <h3>On Leave</h3>
          <div className="value">{stats?.on_leave_employees || 0}</div>
        </div>
        <div className="stat-card resigned">
          <h3>Resigned</h3>
          <div className="value">{stats?.resigned_employees || 0}</div>
        </div>
        <div className="stat-card payroll">
          <h3>Total Monthly Payroll</h3>
          <div className="value">
            {formatCurrency(stats?.total_monthly_payroll || 0)}
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Today's Attendance</h3>
        </div>
        <div className="attendance-breakdown">
          <div className="attendance-item present">
            <div className="count">
              {stats?.attendance_today?.Present || 0}
            </div>
            <div className="label">Present</div>
          </div>
          <div className="attendance-item late">
            <div className="count">{stats?.attendance_today?.Late || 0}</div>
            <div className="label">Late</div>
          </div>
          <div className="attendance-item absent">
            <div className="count">
              {stats?.attendance_today?.Absent || 0}
            </div>
            <div className="label">Absent</div>
          </div>
          <div className="attendance-item on-leave">
            <div className="count">
              {stats?.attendance_today?.['On Leave'] || 0}
            </div>
            <div className="label">On Leave</div>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Quick Actions</h3>
        </div>
        <div className="quick-actions">
          <Link to="/employees" className="btn btn-primary">
            Manage Employees
          </Link>
          <Link to="/attendance" className="btn btn-secondary">
            Record Attendance
          </Link>
          <Link to="/payroll" className="btn btn-secondary">
            Generate Payroll
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
