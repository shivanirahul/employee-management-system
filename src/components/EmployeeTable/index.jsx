function EmployeeTable() {\

     const employees = [
    {
      firstName: "John",
      lastName: "Doe",
      gender: "Male",
      mobile: "9876543210",
      email: "john@gmail.com",
      city: "Delhi",
      country: "India",
      designation: "Software Engineer",
    },
    {
      firstName: "Sarah",
      lastName: "Smith",
      gender: "Female",
      mobile: "9876543211",
      email: "sarah@gmail.com",
      city: "Kochi",
      country: "India",
      designation: "Tester",
    },
  ];

  return (
    <table border="1" cellPadding="10">
      <thead>
        <tr>
          <th>First Name</th>
          <th>Last Name</th>
          <th>Gender</th>
          <th>Mobile</th>
          <th>Email</th>
          <th>City</th>
          <th>Country</th>
          <th>Designation</th>
          <th>Actions</th>
        </tr>
      </thead>

      <tbody>
        {employees.map((emp, index) => (
          <tr key={index}>
            <td>{emp.firstName}</td>
            <td>{emp.lastName}</td>
            <td>{emp.gender}</td>
            <td>{emp.mobile}</td>
            <td>{emp.email}</td>
            <td>{emp.city}</td>
            <td>{emp.country}</td>
            <td>{emp.designation}</td>
            <td>
              <button>View</button>
              <button>Edit</button>
              <button>Delete</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default EmployeeTable;