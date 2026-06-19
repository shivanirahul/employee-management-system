import "./Header.css";
import { FaUsers, FaUserPlus, FaSignOutAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { authService } from "../../services/authService";
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
          <button className="nav-btn active">
            <FaUsers />
            <span>Employees</span>
          </button>

          <button className="nav-btn">
            <FaUserPlus />
            <span>Add Employee</span>
          </button>
        </nav>
      </div>

      <div className="header-right">
        <span className="admin-name">admin</span>

        <button className="logout-btn" onClick={handleLogout}>
          <FaSignOutAlt />
          <span>Logout</span>
        </button>
      </div>
    </header>
  );
}

export default Header;