import { useEffect, useState } from "react";
import API from "../services/api";
import "../theme.css";
import { FaBoxOpen, FaReceipt, FaMoneyBillWave } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    products: 0,
    orders: 0,
    sales: 0,
  });

  const loadStats = async () => {
    const productRes = await API.get("/products");
    const orderRes = await API.get("/orders");

    const totalSales = orderRes.data.orders.reduce(
      (sum, order) => sum + order.grandTotal,
      0
    );

    setStats({
      products: productRes.data.products.length,
      orders: orderRes.data.orders.length,
      sales: totalSales,
    });
  };

  useEffect(() => {
    loadStats();
  }, []);

  return (
    <div className="dashboard-container p-4">
      <h2 className="dashboard-title mb-4">📊 Admin Dashboard</h2>

      <div className="row g-4">

        {/* PRODUCTS CARD */}
        <div className="col-md-4">
          <div
            className="stat-card"
            onClick={() => navigate("/products")}
            style={{ cursor: "pointer" }}
          >
            <FaBoxOpen className="stat-icon" />
            <h3>{stats.products}</h3>
            <p>Total Products</p>
          </div>
        </div>

        {/* ORDERS CARD */}
        <div className="col-md-4">
          <div
            className="stat-card"
            onClick={() => navigate("/orders")}
            style={{ cursor: "pointer" }}
          >
            <FaReceipt className="stat-icon" />
            <h3>{stats.orders}</h3>
            <p>Total Orders</p>
          </div>
        </div>

        {/* SALES CARD */}
        <div className="col-md-4">
          <div
            className="stat-card"
            onClick={() => navigate("/orders")}
            style={{ cursor: "pointer" }}
          >
            <FaMoneyBillWave className="stat-icon" />
            <h3>₹{stats.sales}</h3>
            <p>Total Sales</p>
          </div>
        </div>
        
      </div>
    </div>
  );
}
