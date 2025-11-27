import { useEffect, useState } from "react";
import API from "../services/api";
import "../theme.css";
import { FaPlus, FaTrash, FaEdit } from "react-icons/fa";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [modal, setModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({ name: "", price: "", stock: "", category: "", barcode: "" });
  const [editingId, setEditingId] = useState(null);

  const loadProducts = async () => {
    const res = await API.get("/products");
    setProducts(res.data.products);
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const openAddModal = () => {
    setForm({ name: "", price: "", stock: "", category: "", barcode: "" });
    setEditMode(false);
    setModal(true);
  };

  const openEditModal = (p) => {
    setForm({ name: p.name, price: p.price, stock: p.stock, category: p.category, barcode: p.barcode || "" });
    setEditingId(p._id);
    setEditMode(true);
    setModal(true);
  };

  const saveProduct = async () => {
    if (editMode) {
      await API.put(`/products/${editingId}`, form);
    } else {
      await API.post("/products", form);
    }
    setModal(false);
    loadProducts();
  };

  const deleteProduct = async (id) => {
    if (!window.confirm("Delete this product?")) return;
    await API.delete(`/products/${id}`);
    loadProducts();
  };

  return (
    <div className="products-container p-4">
      <div className="d-flex justify-content-between align-items-center">
        <h2 className="dashboard-title">📦 Inventory</h2>
        <button className="btn btn-success d-flex align-items-center gap-2" onClick={openAddModal}>
          <FaPlus /> Add Product
        </button>
      </div>

      <div className="row g-4 mt-3">
        {products.map((p) => (
          <div key={p._id} className="col-md-4">
            <div className="product-card">
              <h4>{p.name}</h4>
              <p>Category: {p.category}</p>
              <p>Price: ₹{p.price}</p>
              <p>Stock: {p.stock}</p>
              <p>Barcode: {p.barcode || "—"}</p>


              <div className="d-flex gap-2">
                <button className="btn btn-primary w-50" onClick={() => openEditModal(p)}>
                  <FaEdit /> Edit
                </button>
                <button className="btn btn-danger w-50" onClick={() => deleteProduct(p._id)}>
                  <FaTrash /> Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {modal && (
        <div className="modal-overlay">
          <div className="modal-card">
            <h3>{editMode ? "Edit Product" : "Add Product"}</h3>

            <input className="form-control mt-3" placeholder="Name"
              value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            <input className="form-control mt-3" placeholder="Price" type="number"
              value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
            <input className="form-control mt-3" placeholder="Stock" type="number"
              value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} />
            <input className="form-control mt-3" placeholder="Category"
              value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
            <input
              className="form-control mt-3"
              placeholder="Barcode (optional)"
              value={form.barcode}
              onChange={(e) => setForm({ ...form, barcode: e.target.value })}
            />


            <div className="d-flex gap-2 mt-4">
              <button className="btn btn-secondary w-50" onClick={() => setModal(false)}>
                Cancel
              </button>
              <button className="btn btn-success w-50" onClick={saveProduct}>
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
