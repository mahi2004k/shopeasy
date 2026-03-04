import { useState } from "react";
import {useNavigate} from "react-router-dom";
import "./Register.css";

function Register(){
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

 const handleRegister = () => {

  if (!formData.firstName || !formData.lastName || !formData.email ||
      !formData.password || !formData.mobNo || !formData.dob) {
    alert("All fields are required ❌");
    return;
  }

  const userData = {
    ...formData,
    fullName: formData.firstName + " " + formData.lastName
  };

  localStorage.setItem("user", JSON.stringify(userData));

  alert("Registration Successful ✅");

  navigate("/");
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
        Already have an Account?
        <span onClick={()=> navigate("/")}>Login</span>
      </p>

    </div>
  );
}


export default Register;