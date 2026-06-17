import { useState, useEffect } from "react";
import EmployeeTable from "../../components/EmployeeTable";
// import apiClient from "../../services/api";

export default function EmployeeList() {
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    // API integration will go here

    // const fetchEmployees = async () => {
    //   try {
    //     const response = await apiClient.get("/api/employee");
    //     setEmployees(response.data);
    //   } catch (error) {
    //     console.error(error);
    //   }
    // };

    // fetchEmployees();
  }, []);

  return (
    <div>
      <h1>Employee List</h1>

      <EmployeeTable
        employees={employees}
        onAdd={() => console.log("Add Employee")}
        onView={(emp) => console.log("View", emp)}
        onEdit={(emp) => console.log("Edit", emp)}
        onDelete={(emp) => console.log("Delete", emp)}
      />
    </div>
  );
}