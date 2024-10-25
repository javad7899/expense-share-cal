import { Route, Routes, useLocation, Navigate } from "react-router-dom";
import Header from "./components/Header";
import AddExpense from "./pages/AddExpense";
import Dashboard from "./pages/Dashboard";
import UsersManagement from "./pages/UsersManagement";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import User from "./pages/User";
import Login from "./pages/Login";
import Register from "./pages/Register";
import PrivateRoute from "./components/PrivateRoute"; // Import the PrivateRoute component

export default function App() {
  const location = useLocation(); // Get the current location

  // Conditionally render the Header based on the current path
  const hideHeaderPaths = ["/login", "/register"];
  const shouldShowHeader = !hideHeaderPaths.includes(location.pathname);

  return (
    <>
      {shouldShowHeader && <Header />}
      {/* Show Header only if it's not login or register */}
      <Routes>
        {/* Redirect root path to /add */}
        <Route path="/" element={<Navigate to="/add" replace />} />

        {/* Unprotected route for login */}
        <Route path="/login" element={<Login />} />
        {/* Add a Register page if you have it */}
        <Route path="/register" element={<Register />} />

        {/* Protected routes */}
        <Route
          path="/add"
          element={
            <PrivateRoute>
              <AddExpense />
            </PrivateRoute>
          }
        />
        <Route
          path="/users"
          element={
            <PrivateRoute>
              <UsersManagement />
            </PrivateRoute>
          }
        />
        <Route
          path="/users/:id"
          element={
            <PrivateRoute>
              <User />
            </PrivateRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
      </Routes>
      <ToastContainer position="top-right" autoClose={2000} />
    </>
  );
}
