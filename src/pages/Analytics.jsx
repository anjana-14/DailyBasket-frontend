import { useEffect, useState } from "react";
import API from "../services/api";
import "../theme.css";
import { Line } from "react-chartjs-2";
import {
  Chart,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from "chart.js";
Chart.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend);

export default function Analytics() {
  const [chartData, setChartData] = useState({ labels: [], values: [] });
  const [topProducts, setTopProducts] = useState([]);
  const [cashiers, setCashiers] = useState([]);

  const loadData = async () => {
    const orders = (await API.get("/orders")).data.orders;

    // Sales Chart
    const dailySales = {};
    orders.forEach(order => {
      const date = new Date(order.createdAt).toLocaleDateString();
      dailySales[date] = (dailySales[date] || 0) + order.grandTotal;
    });

    setChartData({
      labels: Object.keys(dailySales),
      values: Object.values(dailySales),
    });

    // Top Products
    const productCount = {};
    orders.forEach(order => {
      order.items.forEach(i => {
        productCount[i.product] = (productCount[i.product] || 0) + i.quantity;
      });
    });

    setTopProducts(
      Object.entries(productCount).sort((a, b) => b[1] - a[1]).slice(0, 5)
    );

    // Cashier Performance
    const cashierSales = {};
    orders.forEach(order => {
      const cashier = order.createdBy?.name || "Unknown Cashier";
      cashierSales[cashier] = (cashierSales[cashier] || 0) + order.grandTotal;
    });
    setCashiers(Object.entries(cashierSales).sort((a, b) => b[1] - a[1]));
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div className="analytics-container">
      <h2 className="analytics-title">📊 Sales & Performance Analytics</h2>

      {/* Sales Chart */}
      <div className="analytics-chart shadow-box">
        <Line
          data={{
            labels: chartData.labels,
            datasets: [
              {
                label: "Sales per day",
                data: chartData.values,
                borderColor: "#0077ff",
                backgroundColor: "rgba(0,119,255,0.18)",
                tension: 0.35,
                borderWidth: 3,
              },
            ],
          }}
        />
      </div>

      <div className="analytics-grid">
        {/* Top Products */}
        <div className="analytics-card shadow-box">
          <h4>🏆 Top Selling Products</h4>
          <ul className="rank-list">
            {topProducts.map(([name, qty], idx) => (
              <li key={idx}>
                <span>#{idx + 1} {name}</span>
                <strong>{qty} sold</strong>
              </li>
            ))}
          </ul>
        </div>

        {/* Cashier Performance */}
        <div className="analytics-card shadow-box">
          <h4>🧑‍💼 Cashier Performance</h4>
          <ul className="rank-list">
            {cashiers.map(([name, sales], idx) => (
              <li key={idx}>
                <span>#{idx + 1} {name}</span>
                <strong>₹{sales}</strong>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
