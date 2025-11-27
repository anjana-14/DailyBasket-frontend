import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import { AuthContext } from "../context/AuthContext";
import "../theme.css";
import { FaShoppingCart } from "react-icons/fa";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await API.post("/auth/login", { email, password });
      // res.data = { token, user: { name, email, role } }
      login(res.data);
      navigate("/billing"); // after login go to billing
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message || "Login failed. Please check credentials."
      );
    }
  };

  return (
    <div className="login-page">
      <div className="login-glow"></div>
      <div className="login-card">
        <div className="login-logo">
          <FaShoppingCart size={28} />
          <span>Daily Basket</span>
        </div>

        <h2 className="login-title">Welcome back</h2>
        <p className="login-subtitle">Sign in to continue billing</p>

        {error && <div className="alert alert-danger py-1 mt-2">{error}</div>}

        <form onSubmit={handleSubmit} className="mt-3">
          <label className="login-label">Email</label>
          <input
            type="email"
            className="form-control login-input"
            placeholder="admin@gmail.com / cashier@gmail.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <label className="login-label mt-3">Password</label>
          <input
            type="password"
            className="form-control login-input"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button className="btn btn-neon w-100 mt-4" type="submit">
            Login
          </button>
        </form>
        {/* Demo credentials box */}
        <div className="alert alert-info mt-3" style={{ fontSize: "0.9rem" }}>
          <strong>Demo Admin Login</strong>
          <br />
          Email: <code>admin@gmail.com</code>
          <br />
          Password: <code>admin123</code>
          <hr />
          <strong>Demo Cashier Login</strong>
          <br />
          Email: <code>cashier@gmail.com</code>
          <br />
          Password: <code>admin123</code>

    </div>
    </div>
    </div>
  )}