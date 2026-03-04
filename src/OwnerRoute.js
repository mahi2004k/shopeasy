import { Navigate } from "react-router-dom";

export default function OwnerRoute({ children }) {

  const isOwner = localStorage.getItem("isOwner");
  const isLoggedIn = localStorage.getItem("isLoggedIn");

  // ❌ Not logged in OR not owner
  if (isLoggedIn !== "true" || isOwner !== "true") {
    return <Navigate to="/" replace />;
  }

  // ✅ Owner allowed
  return children;
}