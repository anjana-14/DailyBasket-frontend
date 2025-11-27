import { useEffect, useState, useContext } from "react";
import API from "../services/api";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import "../theme.css";
import { ThemeContext } from "../context/ThemeContext";
import { FaFilePdf } from "react-icons/fa";

export default function Orders() {
  const { theme } = useContext(ThemeContext);
  const [orders, setOrders] = useState([]);

  const loadOrders = async () => {
    const res = await API.get("/orders");
    setOrders(res.data.orders);
  };

  const downloadPDF = (order) => {
    const doc = new jsPDF();
    doc.setFontSize(20);
    doc.text("FreshCart Market — Invoice", 14, 18);

    autoTable(doc, {
      head: [["Product", "Qty", "Price"]],
      body: order.items.map((i) => [i.product.name, i.quantity, i.price]),
      startY: 28,
    });

    doc.text(`Grand Total: ₹${order.grandTotal}`, 14, doc.lastAutoTable.finalY + 12);
    doc.save(`invoice-${order._id}.pdf`);
  };

  useEffect(() => {
    loadOrders();
  }, []);

  return (
    <div className={`orders-container p-4 ${theme}`}>
      <h2 className="dashboard-title mb-4">📦 Order History</h2>

      {orders.length === 0 ? (
        <p className="empty-text">No orders found.</p>
      ) : (
        <div className="order-list">
          {orders.map((o) => (
            <div className="order-card" key={o._id}>
              <div className="order-header">
                <div>
                  <h4>Order #{o._id.slice(-6).toUpperCase()}</h4>
                  <p>{new Date(o.createdAt).toLocaleString()}</p>
                </div>
                <h3 className="order-total">₹{o.grandTotal}</h3>
              </div>

              <table className="table table-sm mt-3">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Qty</th>
                    <th>Price</th>
                  </tr>
                </thead>
                <tbody>
                  {o.items.map((i, idx) => (
                    <tr key={idx}>
                      <td>{i.product.name}</td>
                      <td>{i.quantity}</td>
                      <td>₹{i.price}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <button 
                className="btn btn-danger mt-2 d-flex align-items-center gap-2"
                onClick={() => downloadPDF(o)}
              >
                <FaFilePdf /> Download Invoice PDF
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
