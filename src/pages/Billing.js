import { useState, useContext } from "react";
import API from "../services/api";
import "../theme.css";
import { FaTrash, FaPlus } from "react-icons/fa";
import { ThemeContext } from "../context/ThemeContext";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export default function Billing() {
  const { theme } = useContext(ThemeContext);

  const [items, setItems] = useState([]);
  const [productName, setProductName] = useState("");
  const [qty, setQty] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [discount, setDiscount] = useState("");
  const [gst, setGst] = useState("");

  // ================== ADD ITEM ==================
  const addItem = async () => {
    if (!productName || !qty) return;

    const productRes = await API.get(`/products/search/${productName}`);
    const product = productRes.data.product;
    if (!product) return alert("Product not found");

    // Low stock alert
    if (product.stock - qty < 10)
      alert(`⚠ Low Stock Alert: After this sale only ${product.stock - qty} items remain.`);

    const newItem = {
      product: product._id,
      name: product.name,
      price: product.price * qty,
      qty,
    };

    setItems([...items, newItem]);
    setProductName("");
    setQty("");
  };

  // ================== TOTAL CALCULATION ==================
  const subtotal = items.reduce((sum, i) => sum + i.price, 0);
  const discountAmount = discount ? subtotal * (discount / 100) : 0;
  const afterDiscount = subtotal - discountAmount;
  const gstAmount = gst ? afterDiscount * (gst / 100) : 0;
  const grandTotal = afterDiscount + gstAmount;

  // ================== SAVE BILL ==================
  const saveBill = async () => {
    try {
      const body = {
        items: items.map((i) => ({
          product: i.product,
          quantity: i.qty,
          price: i.price,
        })),
        customer: { name: customerName, phone: customerPhone },
        subtotal,
        discount,
        gst,
        grandTotal,
      };

      await API.post("/orders", body);
      alert("Bill Saved Successfully ✔");

      // Reset
      setItems([]);
      setCustomerName("");
      setCustomerPhone("");
      setDiscount("");
      setGst("");
    } catch (err) {
      console.error("Error saving bill:", err);
      alert("Failed to save bill.");
    }
  };

  // ================== PDF DOWNLOAD ==================
  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(20);
    doc.text("🧾 FreshCart Market — Invoice", 14, 18);

    doc.setFontSize(12);
    doc.text(`Customer: ${customerName || "-"}`, 14, 30);
    doc.text(`Phone: ${customerPhone || "-"}`, 14, 37);

    autoTable(doc, {
      head: [["Product", "Qty", "Total"]],
      body: items.map((i) => [i.name, i.qty, i.price]),
      startY: 45,
    });

    const y = doc.lastAutoTable.finalY + 10;
    doc.text(`Subtotal: ₹${subtotal}`, 14, y);
    doc.text(`Discount (${discount}%): -₹${discountAmount}`, 14, y + 7);
    doc.text(`GST (${gst}%): +₹${gstAmount}`, 14, y + 14);
    doc.text(`Grand Total: ₹${grandTotal}`, 14, y + 25);

    doc.save("invoice.pdf");
  };

  return (
    <div className={`billing-container ${theme}`}>
      <div className="billing-left">
        <h3>🧾 Create Bill</h3>

        <input className="form-control mt-3" placeholder="Enter product name"
          value={productName} onChange={(e) => setProductName(e.target.value)} />

        <input className="form-control mt-3" placeholder="Qty" type="number"
          value={qty} onChange={(e) => setQty(e.target.value)} />

        <input className="form-control mt-3" placeholder="Customer Name"
          value={customerName} onChange={(e) => setCustomerName(e.target.value)} />

        <input className="form-control mt-3" placeholder="Customer Phone"
          value={customerPhone} onChange={(e) => setCustomerPhone(e.target.value)} />

        <input className="form-control mt-3" placeholder="Discount %"
          value={discount} onChange={(e) => setDiscount(e.target.value)} />

        <input className="form-control mt-3" placeholder="GST %"
          value={gst} onChange={(e) => setGst(e.target.value)} />

        <button className="btn btn-success mt-3 w-100 d-flex align-items-center justify-content-center gap-2" onClick={addItem}>
          <FaPlus /> Add Item
        </button>

        <table className="table table-striped mt-4">
          <thead>
            <tr><th>Product</th><th>Qty</th><th>Total</th><th></th></tr>
          </thead>
          <tbody>
            {items.map((i, idx) => (
              <tr key={idx}>
                <td>{i.name}</td>
                <td>{i.qty}</td>
                <td>₹{i.price}</td>
                <td>
                  <FaTrash className="text-danger remove-icon"
                    onClick={() => setItems(items.filter((_, x) => x !== idx))} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="billing-right">
        <div className="summary-card">
          <h4>Order Summary</h4>
          <p>Subtotal: ₹{subtotal}</p>
          <p>Discount: -₹{discountAmount}</p>
          <p>GST: +₹{gstAmount}</p>
          <h1 className="total-amt">₹{grandTotal}</h1>

          <button className="btn btn-outline-danger w-100 mt-3" onClick={() => setItems([])}>
            Clear Order
          </button>
          <button className="btn btn-success w-100 mt-3" onClick={saveBill}>
            Save Bill
          </button>
          <button className="btn btn-primary w-100 mt-3" onClick={downloadPDF}>
            Download PDF
          </button>
        </div>
      </div>
    </div>
  );
}
