import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Register.css";

function Register() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    mobNo: "",
    dob: ""
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleRegister = async () => {
    // ✅ Basic validation
    if (!formData.firstName || !formData.lastName || !formData.email ||
        !formData.password || !formData.mobNo || !formData.dob) {
      alert("All fields are required ❌");
      return;
    }

    try {
      // ✅ Send data to backend
      const response = await fetch("http://localhost:5000/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.status === 201) {
        alert(data.message); // "User Registered Successfully ✅"
        navigate("/");       // redirect to login
      } else {
        alert(data.message); // show error message from backend
      }

    } catch (error) {
      console.error("Error:", error);
      alert("Registration Failed ❌");
    }
  };

  return (
    <div className="register-container">

      <h2>Register</h2>

      <input
        type="text"
        name="firstName"
        placeholder="First Name"
        onChange={handleChange}
      />

      <input
        type="text"
        name="lastName"
        placeholder="Last Name"
        onChange={handleChange}
      />

      <input
        type="email"
        name="email"
        placeholder="Email"
        onChange={handleChange}
      />

      <input
        type="password"
        name="password"
        placeholder="Password"
        onChange={handleChange}
      />

      <input
        type="text"
        name="mobNo"
        placeholder="Mobile Number"
        onChange={handleChange}
      />

      <input
        type="date"
        name="dob"
        onChange={handleChange}
      />

      <button onClick={handleRegister}>
        Register
      </button>

      <p className="Login-text">
        Already have an Account?{" "}
        <span onClick={() => navigate("/")}>Login</span>
      </p>

    </div>
  );
}

export default Register;