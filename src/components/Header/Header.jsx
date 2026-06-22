import "./Header.css";
import { FaUsers, FaUserPlus, FaSignOutAlt } from "react-icons/fa";
import { FaChevronDown } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { authService } from "../../services/authService";
import adminPic from "./admin.png";
import logo from "./logo.png";
function Header() {
  const navigate = useNavigate();

  const handleLogout = () => {
    authService.logout();
    navigate("/login");
  };

  return (
    <header className="header">
      <div className="header-left">
        <div className="logo">
           <img src={logo} alt="EmpTrack Logo" className="logo-image" />
          <span className="logo-text">EmpTrack</span>
        </div>

<nav className="nav-menu">
          <button className="nav-btn active"
          onClick={() => navigate("/dashboard")}
          >
            <FaUsers />
            <span>Dashboard</span>
          </button>
        <nav className="nav-menu">
          <button className="nav-btn active"
          onClick={() => navigate("/employees")}
          >
            <FaUsers />
            <span>Employees</span>
          </button>

          <button className="nav-btn active"
          onClick={() => navigate("/employees/add")}
          >
            <FaUserPlus />
            <span>Add Employee</span>
          </button>
        </nav>
        </nav>
      </div>

      <div className="header-right">
  <div className="admin-profile">
    <img
      src={adminPic}
      alt="Admin"
      className="admin-avatar"
    />

    <div className="admin-info">
      <h4>admin</h4>
    
    </div>

    
  </div>

  <button className="logout-btn" onClick={handleLogout}>
    <FaSignOutAlt />
    <span>Logout</span>
  </button>
</div>
    </header>
  );
}

export default Header;




