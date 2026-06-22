import { useState, useEffect } from "react";
import EmployeeTable from "../../components/EmployeeTable";
import apiClient from "../../services/api";
import Layout from "../../components/Layout/Layout";
import { useNavigate, useLocation } from "react-router-dom";

export default function EmployeeList() {
  const navigate = useNavigate();
  const location = useLocation();
  const [successMessage, setSuccessMessage] = useState("");
  const [employees, setEmployees] = useState([]);
  const [designationMap, setDesignationMap] = useState({});
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  const fetchDesignations = async () => {
    try {
      const response = await apiClient.get("/api/designations");
      const map = {};
      response.data.data.forEach((d) => {
        map[d._id] = d.Name;
      });
      console.log("designation map:", map);
      setDesignationMap(map);
      return map;
    } catch (error) {
      console.error("Failed to load designations:", error);
      return {};
    }
  };

  const fetchEmployees = async (map) => {
    try {
      const response = await apiClient.get("/api/employee");

      const formattedEmployees = response.data.data.map((emp) => {
        const designationId = String(emp.Designation);
        console.log("employee designation id:", designationId, "| found in map?", map[designationId]);
        return {
          id: emp._id,
          firstName: emp.FirstName,
          lastName: emp.LastName,
          gender: emp.Gender,
          email: emp.PersonalEmail,
          mobile: emp.MobileNumber,
          city: emp.City,
          designation: map[designationId] || "Unassigned",
        };
      });

      setEmployees(formattedEmployees);
    } catch (error) {
      console.error(error);
    }
  };

  const loadAll = async () => {
    const map = await fetchDesignations();
    await fetchEmployees(map);
  };

  const handleDelete = async () => {
  try {
    await apiClient.delete(`/api/employee/${selectedEmployee.id}`);

    setShowConfirm(false);

    await fetchEmployees(designationMap);
  } catch (error) {
    console.error(error);
    alert("Failed to delete employee");
  }
};

  useEffect(() => {
    loadAll();
  }, []);

  useEffect(() => {
  if (location.state?.successMessage) {
    setSuccessMessage(location.state.successMessage);

    const timer = setTimeout(() => {
      setSuccessMessage('');
    }, 4000);

    return () => clearTimeout(timer);
  }
}, [location]);

  return (
    <Layout>
      {successMessage && (
  <div className="success-alert">
    {successMessage}
  </div>
)}
      <div className="employee-hero">
        <div className="hero-content">
          <h1>Employee List</h1>
          <p>Manage, search and track all employees in one place.</p>

          <div className="hero-stats">
            <div className="stat-card">
              <div className="stat-icon">👥</div>
              <div>
                <h2>{employees.length}</h2>
                <span>Total Employees</span>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon male">👨</div>
              <div>
                <h2>{employees.filter((e) => e.gender === "Male").length}</h2>
                <span>Male</span>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon female">👩</div>
              <h2>{employees.filter((e) => e.gender === "Female").length}</h2>
              <span>Female</span>
            </div>

            <div className="stat-card">
              <div className="stat-icon city">📍</div>
              <h2>{[...new Set(employees.map((e) => e.city))].length}</h2>
              <span>Cities</span>
            </div>
          </div>
        </div>

        <div className="hero-icon">👨‍💼👩‍💼</div>
      </div>
      {showConfirm && (
  <div className="ev-confirm-overlay">
    <div className="ev-confirm-box">
      <h3>Delete Employee?</h3>

      <p>
        This will permanently remove{" "}
        <strong>
          {selectedEmployee?.firstName} {selectedEmployee?.lastName}
        </strong>{" "}
        from the system.
      </p>

      <div className="ev-confirm-actions">
        <button
          className="ev-confirm-cancel"
          onClick={() => setShowConfirm(false)}
        >
          Cancel
        </button>

        <button
          className="ev-confirm-delete"
          onClick={handleDelete}
        >
          Yes, Delete
        </button>
      </div>
    </div>
  </div>
)}

      <EmployeeTable
      employees={employees}
        onView={(emp) => navigate(`/employees/view/${emp.id}`)}
        onEdit={(emp) => navigate(`/employees/edit/${emp.id}`)}
        onDelete={(emp) => {
  setSelectedEmployee(emp);
  setShowConfirm(true);
}}
      />
    </Layout>
  );
}