import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

function Login() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate(); 
  
  const handleLogin = () => {

  if (!email || !password) {
    alert("Enter Email & Password ❌");
    return;
  }

   // ⭐ OWNER LOGIN
  if (email === "adminmahi@gmail.com" && password === "AdminMahi0") {

  localStorage.setItem("isOwner", "true");
  localStorage.setItem("isLoggedIn", "true");   // ⭐ ADD THIS

  alert("Owner Login ✅");

  navigate("/admin");

  return;
}

// ❗ Remove owner if normal user logs in
localStorage.removeItem("isOwner");

  // ✅ Get stored user
  const storedUser = JSON.parse(localStorage.getItem("user"));

  if (!storedUser) {
    alert("No user found. Please Register First ❌");
    return;
  }

  // ✅ Check credentials
  if (email === storedUser.email && password === storedUser.password) {
    
    alert("Login Successful ✅");

    // Optional session flag
    localStorage.setItem("isLoggedIn", "true");

    localStorage.setItem("loggedInUser", storedUser.fullName);

    navigate("/dashboard");   // 🔥 REDIRECT TO DASHBOARD

  } else {
    alert("Invalid Email or Password ❌");
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

      <button onClick={handleLogin}>
        Login
      </button>

      <p className="Register-text">
        Dont have an Account?
        <span onClick={()=> navigate("/register")}>Register</span>
      </p>

    </div>
  );
}

export default Login;