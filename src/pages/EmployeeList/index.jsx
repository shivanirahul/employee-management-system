import { useState, useEffect } from "react";
import EmployeeTable from "../../components/EmployeeTable";
import apiClient from "../../services/api";
import Layout from "../../components/Layout/Layout";

export default function EmployeeList() {
  const [employees, setEmployees] = useState([]);

  const fetchEmployees = async () => {
    try {
      const response = await apiClient.get("/api/employee");

      const formattedEmployees = response.data.data.map((emp) => ({
        id: emp._id,
        firstName: emp.FirstName,
        lastName: emp.LastName,
        gender: emp.Gender,
        email: emp.PersonalEmail,
        mobile: emp.MobileNumber,
        city: emp.City,
        designation: emp.Designation?.name || "",
      }));

      setEmployees(formattedEmployees);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (emp) => {
    try {
      await apiClient.delete(`/api/employee/${emp.id}`);

      alert(`${emp.firstName} ${emp.lastName} deleted successfully`);

     await fetchEmployees();
    } catch (error) {
      console.error(error);
      alert("Failed to delete employee");
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  

  return (
    <Layout>
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
        <h2>
          {employees.filter(e => e.gender === "Male").length}
        </h2>
        <span>Male</span>
        </div>
      </div>

      <div className="stat-card">
        <div className="stat-icon female">👩</div>
        <h2>
          {employees.filter(e => e.gender === "Female").length}
        </h2>
        <span>Female</span>
      </div>

      <div className="stat-card">
        <div className="stat-icon city">📍</div>
        <h2>
          {[...new Set(employees.map(e => e.city))].length}
        </h2>
        <span>Cities</span>
      </div>
    </div>
  </div>

  <div className="hero-icon">
    👨‍💼👩‍💼
  </div>
</div>
      <EmployeeTable
        employees={employees}
        onView={(emp) => console.log("View", emp)}
        onEdit={(emp) => console.log("Edit", emp)}
        onDelete={handleDelete}
      />
    </Layout>
  );
}
