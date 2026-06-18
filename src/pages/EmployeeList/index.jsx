import { useState, useEffect } from "react";
import EmployeeTable from "../../components/EmployeeTable";
import apiClient from "../../services/api";

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
    <div>
      <h1>Employee List</h1>

      <EmployeeTable
        employees={employees}
        onView={(emp) => console.log("View", emp)}
        onEdit={(emp) => console.log("Edit", emp)}
        onDelete={handleDelete}
      />
    </div>
  );
}