import { Navigate } from "react-router-dom";

// PrivateRoute component to protect routes
const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem("token");

  return token ? children : <Navigate to="/login" />;
};

export default PrivateRoute;
