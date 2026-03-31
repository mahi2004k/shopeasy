import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!email || !password) {
      alert("Enter Email & Password ❌");
      return;
    }

    try {
      // ⭐ Admin Login
      if (email === "adminmahi@gmail.com" && password === "AdminMahi0") {
        localStorage.setItem("isOwner", "true");
        localStorage.setItem("isLoggedIn", "true");

        alert("Owner Login ✅");
        navigate("/admin");
        return;
      }

      localStorage.removeItem("isOwner");

      const response = await fetch("http://localhost:5000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.status === 200) {
        alert("Login Successful ✅");

        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("loggedInUser", data.fullName);

        navigate("/dashboard");
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error("Login Error:", error);
      alert("Login Failed ❌");
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-container">
        <h2>Welcome Back 👋</h2>

        <input
          type="email"
          placeholder="Enter Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <div className="password-box">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Enter Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <span onClick={() => setShowPassword(!showPassword)}>
            {showPassword ? "🙈" : "👁"}
          </span>
        </div>

        <button onClick={handleLogin}>Login</button>

        <p className="Register-text">
          Don't have an Account?{" "}
          <span onClick={() => navigate("/register")}>Register</span>
        </p>
      </div>
    </div>
  );
}

export default Login;