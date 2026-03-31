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

  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleRegister = async () => {
    if (
      !formData.firstName ||
      !formData.lastName ||
      !formData.email ||
      !formData.password ||
      !formData.mobNo ||
      !formData.dob
    ) {
      alert("All fields are required ❌");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.status === 201) {
        alert(data.message);
        navigate("/");
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error(error);
      alert("Registration Failed ❌");
    }
  };

  return (
    <div className="register-wrapper">
      <div className="register-container">
        <h2>Create Account 🚀</h2>

        <div className="input-row">
          <input name="firstName" placeholder="First Name" onChange={handleChange} />
          <input name="lastName" placeholder="Last Name" onChange={handleChange} />
        </div>

        <input type="email" name="email" placeholder="Email" onChange={handleChange} />

        <div className="password-box">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Password"
            onChange={handleChange}
          />
          <span onClick={() => setShowPassword(!showPassword)}>
            {showPassword ? "🙈" : "👁"}
          </span>
        </div>

        <input name="mobNo" placeholder="Mobile Number" onChange={handleChange} />
        <input type="date" name="dob" onChange={handleChange} />

        <button onClick={handleRegister}>Register</button>

        <p className="Login-text">
          Already have an Account?{" "}
          <span onClick={() => navigate("/")}>Login</span>
        </p>
      </div>
    </div>
  );
}

export default Register;