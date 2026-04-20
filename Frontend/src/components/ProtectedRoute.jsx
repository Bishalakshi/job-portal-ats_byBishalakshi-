import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children, role }) {
  const user = JSON.parse(localStorage.getItem("current"));

  // Not logged in
  if (!user) {
    return <Navigate to="/" />;
  }

  // Role check
  if (role && user.role !== role) {
    return <Navigate to="/dashboard" />;
  }

  return children;
}