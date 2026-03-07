import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!email || !password) {
      alert("Enter Email & Password ❌");
      return;
    }

    try {
      // ⭐ Owner/Admin Login
      if (email === "adminmahi@gmail.com" && password === "AdminMahi0") {
        localStorage.setItem("isOwner", "true");
        localStorage.setItem("isLoggedIn", "true");

        alert("Owner Login ✅");
        navigate("/admin");
        return;
      }

      // ❗ Remove owner flag if normal user logs in
      localStorage.removeItem("isOwner");

      // 🔹 Call backend API
      const response = await fetch("http://localhost:5000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.status === 200) {
        // ✅ Login Successful
        alert("Login Successful ✅");

        // Optional session flags
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("loggedInUser", data.fullName); // get from backend

        navigate("/dashboard");
      } else {
        alert(data.message); // e.g., Invalid credentials
      }
    } catch (error) {
      console.error("Login Error:", error);
      alert("Login Failed ❌");
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>

      <input
        type="email"
        placeholder="Enter Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        type="password"
        placeholder="Enter Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button onClick={handleLogin}>Login</button>

      <p className="Register-text">
        Don't have an Account?{" "}
        <span onClick={() => navigate("/register")}>Register</span>
      </p>
    </div>
  );
}

export default Login;