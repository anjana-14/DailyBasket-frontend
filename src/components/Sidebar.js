import { useContext } from "react";
import { NavLink } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { FaBoxOpen, FaReceipt, FaHistory, FaChartBar } from "react-icons/fa";

export default function Sidebar() {
  const { auth } = useContext(AuthContext);
  const role = auth?.user?.role;

  return (
    <aside className="sidebar">
      <div className="sidebar-inner">
        {/* Admin-only links */}
        {role === "admin" && (
          <>
            <NavLink
              to="/dashboard"
              className="sidebar-link"
            >
              <FaChartBar /> <span>Dashboard</span>
            </NavLink>

            <NavLink
              to="/products"
              className="sidebar-link"
            >
              <FaBoxOpen /> <span>Products</span>
            </NavLink>
          </>
        )}

        {/* Shared links for admin + cashier */}
        <NavLink
          to="/billing"
          className="sidebar-link"
        >
          <FaReceipt /> <span>Billing</span>
        </NavLink>

        <NavLink
          to="/orders"
          className="sidebar-link"
        >
          <FaHistory /> <span>Orders</span>
        </NavLink>
      </div>
    </aside>
  );
}
