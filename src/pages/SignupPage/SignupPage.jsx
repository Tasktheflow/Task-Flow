import React, { useState } from "react";
import "./SignupPage.css";
import alt from "../../assets/alt.svg";
import { LuUserPen } from "react-icons/lu";
import { FaEnvelope } from "react-icons/fa";
import { MdLock } from "react-icons/md";
import { CiLock } from "react-icons/ci";
import{ useNavigate } from "react-router-dom"
import { Link} from "react-router-dom"


const SignupPage = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    agree: false,
  });
  const navigate = useNavigate();

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });

    // Remove error when user starts typing
    setErrors({
      ...errors,
      [name]: "",
    });
  };

  // Validation function
  const validate = () => {
    const newErrors = {};

    if (!formData.username.trim()) {
      newErrors.username = "Username is required";
    }

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Enter a valid email address";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (!formData.agree) {
      newErrors.agree = "You must agree to the terms";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submit handler
  const handleSubmit = (e) => {
    e.preventDefault();

    if (validate()) {
      console.log("Signup successful:", formData);
      alert("Account created successfully ✅");
      navigate ("/dashboard")
    } else {
      alert("Please fix the errors ❌");
    }
    
  };

  return (
    <div className="signup-container">
      <div className="Left-div">
        <img src={alt} alt="illustration" />
      </div>

      <div className="Right-div">
        <h2 className="right-h2">
          <span className="h2-span">Task</span>Flow
        </h2>
        <p className="right-p">Simple task management for teams</p>

        <form onSubmit={handleSubmit} className="signup-form">
          <h3 className="signup-h3">Create an Account</h3>
          <p className="signup-p">Sign up to continue to TaskFlow</p>

          {/* Username */}
          <div className="form-div">
            <span><LuUserPen /></span>
            <input
              type="text"
              name="username"
              placeholder="Enter Username"
              value={formData.username}
              onChange={handleChange}
            />
          </div>
          {errors.username && <p className="error">{errors.username}</p>}

          {/* Email */}
          <div className="form-div">
            <span><FaEnvelope /></span>
            <input
              type="email"
              name="email"
              placeholder="Enter Email"
              value={formData.email}
              onChange={handleChange}
            />
          </div>
          {errors.email && <p className="error">{errors.email}</p>}

          {/* Password */}
          <div className="form-div">
            <span><MdLock /></span>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Enter Password"
              value={formData.password}
              onChange={handleChange}
            />
            <span
              className="show-password"
              onClick={() => setShowPassword(!showPassword)}
            >
              {/* {showPassword ? "Hide" : "Show"} */}
            </span>
          </div>
          {errors.password && <p className="error">{errors.password}</p>}

          {/* Confirm Password */}
          <div className="form-div">
            <span><CiLock /></span>
            <input
              type={showPassword ? "text" : "password"}
              name="confirmPassword"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
            />
          </div>
          {errors.confirmPassword && (
            <p className="error">{errors.confirmPassword}</p>
          )}

          {/* Checkbox */}
          <div className="checkbox-div">
            <input
              type="checkbox"
              name="agree"
              checked={formData.agree}
              onChange={handleChange}
            />
            <label>I agree to all terms</label>
          </div>
          {errors.agree && <p className="error">{errors.agree}</p>}

          <button className="register-btn" type="submit">
            Register
          </button>

          <p className="last-p">
            Already have an account? <span> <Link to="/Signin">Log in</Link></span>
          </p>
        </form>
      </div>
    </div>
  );
};

export default SignupPage;