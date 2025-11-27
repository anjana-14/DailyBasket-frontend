import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";

import Layout from "./components/Layout";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products";
import Billing from "./pages/Billing";
import Orders from "./pages/Orders";
import Analytics from "./pages/Analytics";
import StockLogs from "./pages/StockLogs";




export default function App() {
  const { auth } = useContext(AuthContext);
  const isLoggedIn = !!auth?.token;
  const role = auth?.user?.role;

  return (
    <BrowserRouter>
      <Routes>
        {/* PUBLIC ROUTE → Login */}
        <Route
          path="/"
          element={!isLoggedIn ? <Login /> : <Navigate to="/billing" />}
        />

        {/* PROTECTED ROUTES */}
        <Route
          path="/dashboard"
          element={
            isLoggedIn ? (
              role === "admin" ? (
                <Layout>
                  <Dashboard />
                </Layout>
              ) : (
                <Navigate to="/billing" />
              )
            ) : (
              <Navigate to="/" />
            )
          }
        />
        <Route path="/analytics" element={<Analytics />} />
        <Route
          path="/products"
          element={
            isLoggedIn ? (
              role === "admin" ? (
                <Layout>
                  <Products />
                </Layout>
              ) : (
                <Navigate to="/billing" />
              )
            ) : (
              <Navigate to="/" />
            )
          }
        />

        <Route
          path="/billing"
          element={
            isLoggedIn ? (
              <Layout>
                <Billing />
              </Layout>
            ) : (
              <Navigate to="/" />
            )
          }
        />

        <Route
          path="/orders"
          element={
            isLoggedIn ? (
              <Layout>
                <Orders />
              </Layout>
            ) : (
              <Navigate to="/" />
            )
          }
        />
        <Route path="/stocklogs" element={<StockLogs />} />

      </Routes>
    </BrowserRouter>
  );
}
