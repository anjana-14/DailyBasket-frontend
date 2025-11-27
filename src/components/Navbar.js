import "../theme.css";
import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { FaBoxOpen, FaReceipt, FaHistory, FaChartBar } from "react-icons/fa";
import { FiLogOut } from "react-icons/fi";
import { FaShoppingCart } from "react-icons/fa";
import { ThemeContext } from "../context/ThemeContext";
import { BsMoon, BsSun } from "react-icons/bs";
import { useLocation } from "react-router-dom";

export default function Navbar() {
  const { auth, logout } = useContext(AuthContext);
  const { theme, toggleTheme } = useContext(ThemeContext);

  const navigate = useNavigate();
  const location = useLocation();

  const isLoggedIn = !!auth.token || !!auth.user;

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className={`navbar px-3 ${theme === "light" ? "navbar-light pastel-bg" : "navbar-dark bg-dark"}`}>
      <Link to="/dashboard" className="navbar-brand d-flex align-items-center gap-2">
        <FaShoppingCart size={22} />
        DailyBasket
      </Link>

      {isLoggedIn && (
        <div className="d-flex align-items-center">

          <Link
            to="/products"
            className={`btn nav-btn me-2 d-flex align-items-center gap-2 ${location.pathname === "/products" ? "active-nav" : ""
              }`}
          >
            <FaBoxOpen /> Products
          </Link>
          <Link
            to="/billing"
            className={`btn nav-btn me-2 d-flex align-items-center gap-2 ${location.pathname === "/billing" ? "active-nav" : ""
              }`}
          >
            <FaReceipt /> Billing
          </Link>

          <Link
            to="/orders"
            className={`btn nav-btn me-2 d-flex align-items-center gap-2 ${location.pathname === "/orders" ? "active-nav" : ""
              }`}
          >
            <FaHistory /> Orders
          </Link>

          {/* ⭐ NEW ANALYTICS BUTTON ⭐ */}
          <Link
            to="/analytics"
            className={`btn nav-btn me-2 d-flex align-items-center gap-2 ${location.pathname === "/analytics" ? "active-nav" : ""
              }`}
          >
            <FaChartBar /> Analytics
          </Link>
          <Link to="/stocklogs" className="btn nav-btn me-2 d-flex align-items-center gap-2">
            📜 Stock Logs
          </Link>


          <button
            className="btn nav-btn me-2 d-flex align-items-center gap-2"
            onClick={toggleTheme}
          >
            {theme === "light" ? <BsMoon /> : <BsSun />}
          </button>

          <button
            className="btn logout-btn d-flex align-items-center gap-2"
            onClick={handleLogout}
          >
            <FiLogOut /> Logout
          </button>

        </div>
      )}
    </nav>
  );
}
