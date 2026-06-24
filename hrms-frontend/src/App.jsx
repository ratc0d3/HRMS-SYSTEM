import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useState, useEffect } from "react";
import api, { clearStoredToken, getStoredToken } from "./api";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Employees from "./pages/Employees";
import Salaries from "./pages/Salaries";
import Attendance from "./pages/Attendance";
import Payroll from "./pages/Payroll";
import Layout from "./components/Layout";

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  async function checkAuth() {
    if (!getStoredToken()) {
      setLoading(false);
      return;
    }

    try {
      const response = await api.get("/user");
      setUser(response.data.data);
    } catch {
      clearStoredToken();
      setUser(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      checkAuth();
    }, 0);

    return () => clearTimeout(timeoutId);
  }, []);

  const login = (userData) => {
    setUser(userData);
  };

  const logout = async () => {
    try {
      await api.post("/logout");
    } catch (error) {
      console.error("Logout error:", error);
    }
    clearStoredToken();
    setUser(null);
  };

  if (loading) {
    return (
      <div className="login-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        <Route
          path="/login"
          element={
            user ? <Navigate to="/" replace /> : <Login onLogin={login} />
          }
        />
        <Route
          path="/*"
          element={
            user ? (
              <Layout user={user} onLogout={logout}>
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/employees" element={<Employees />} />
                  <Route path="/salaries" element={<Salaries />} />
                  <Route path="/attendance" element={<Attendance />} />
                  <Route path="/payroll" element={<Payroll />} />
                </Routes>
              </Layout>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
