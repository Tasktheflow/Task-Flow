// import React from 'react'
// import './Signinpage.css'
// import { useState } from 'react';

// const Signinpage = () => {

//   return (
//     <div>
//       <div></div>

//     </div>
//   )
// }

// export default Signinpage

import { useState } from "react";
import "./Signinpage.css";
import illustration from "../../assets/illustration.png";
import { FaUser, FaLock, FaGoogle, FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate } from "react-router";
import { Link } from "react-router";
import { loginUser } from "../../services/authService";
import { toast } from "react-toastify";
import LoadingButton from "../../components/loadingButton/LoadingButton";

const Signinpage = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    remember: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  // Handle input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });

    // Clear the error for the field being edited
    setErrors({
      ...errors,
      [name]: "",
    });
  };

  // Validate form fields
  const validateForm = () => {
    const newErrors = {};
    if (!formData.email.trim()) newErrors.email = "Email is required";
    if (!formData.password.trim()) newErrors.password = "Password is required";
    return newErrors;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});

    setLoading(true);

    try {
      const res = await loginUser(formData);

      if (res.success) {
        toast.success(res.message);
        localStorage.setItem("user", JSON.stringify(res.data.user));
        localStorage.setItem("token", res.data.token);
        navigate("/dashboard");
      } else {
        toast.error(res.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container flex justify-center items-center">
      {/* LEFT SIDE */}

      {/* RIGHT SIDE */}
      <div className=" flex items-center max-w-[1104px] justify-between mx-auto w-[87%]">
        <div className="login-right">
          <div className="up">
            <h2 className="logo">
              <span>Task</span>Flow
            </h2>
            <p className="tagline">Simple task management for teams</p>
          </div>

          <form className="login-form" onSubmit={handleSubmit}>
            <h3 className="wel-h3">Welcome back</h3>
            <p className="subtitle">Login to continue to TaskFlow</p>

            {/* EMAIL */}
            <div className=" mb-5">
              <div className="input-group">
                <FaUser />
                <input
                  type="email"
                  name="email"
                  placeholder="Enter Email"
                  value={formData.email}
                  onChange={handleChange}
                  className=" outline-0 w-full"
                />
              </div>
              {errors.email && <p className="error">{errors.email}</p>}
            </div>

            {/* PASSWORD */}
            <div className=" mb-5">
              <div className="input-group">
                <FaLock />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Enter Password"
                  value={formData.password}
                  onChange={handleChange}
                  className=" outline-0 w-full"
                />
                <span
                  className="toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>
              {errors.password && <p className="error">{errors.password}</p>}
            </div>

            {/* OPTIONS */}
            <div className="options">
              <label className="label">
                <input
                  type="checkbox"
                  name="remember"
                  checked={formData.remember}
                  onChange={handleChange}
                />
                Remember me
              </label>
              <span className="forgot">Forgot password?</span>
            </div>

            {/* LOGIN BUTTON */}
            <LoadingButton
              loading={loading}
              text="Login"
              loadingText=""
              className="login-btn"
              type="submit"
            />

            {/* OR GOOGLE LOGIN */}
            <p className="divider">
              Or login with{" "}
              <span>
                <FaGoogle />
              </span>
            </p>

            <p className="signup-text">
              Don’t have an account?{" "}
              <span className="span">
                <Link to="/Signup"> Sign up</Link>
              </span>
            </p>
          </form>
        </div>
        <div className="login-left">
          <img src={illustration} alt="Task illustration" />
        </div>
      </div>
    </div>
  );
};

export default Signinpage;
