import { useEffect, useState } from "react";

export default function Dashboard() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const current = JSON.parse(localStorage.getItem("current"));
    setUser(current);
  }, []);

  const logout = () => {
    localStorage.removeItem("current");
    window.location.href = "/";
  };

  return (
    <div className="container mt-5">
      <h2>Dashboard</h2>

      <p>Welcome {user?.name}</p>
      <p>Role: {user?.role}</p>

      {user?.role === "hr" && (
        <h4>HR Panel: You can manage jobs</h4>
      )}

      <button className="btn btn-danger" onClick={logout}>
        Logout
      </button>
    </div>
  );
}