import { useState } from "react";
import "./Signinpage.css";
import illustration from "../../assets/illustration.png";
import { FaUser, FaLock, FaGoogle, FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate } from "react-router";
import { Link } from "react-router";
import { loginUser } from "../../services/authService";
import { toast } from "react-toastify";
import LoadingButton from "../../components/loadingButton/LoadingButton";
import google from "../../assets/FB.png";
import { useProjects } from "../../components/Contexts/ProjectsContext";

const Signinpage = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    remember: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const { fetchProjects } = useProjects();

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
        await fetchProjects();
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
      <div className=" flex items-center max-w-[1104px] justify-between mx-auto w-[87%] max-[850px]:justify-center max-[415px]:w-full">
        <div className="login-right min-w-100 max-[430px]:min-w-[90%] max-[400px]:p-3">
          <div className="up">
            <h2 className="logo">
              <span>Task</span>Flow
            </h2>
            <p className="tagline max-[430px]:w-full">Simple task management for teams</p>
          </div>

          <form className="login-form" onSubmit={handleSubmit}>
            <h3 className="wel-h3">Welcome back</h3>
            <p className="subtitle">Login to continue to TaskFlow</p>

            <div className=" p-5 max-[430px]:p-0">
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
              <div className="options w-full justify-between flex max-[290px]:flex-col max-[290px]:gap-1.5">
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
              <div className="divider flex gap-2 mb-3.5 items-center">
                Or login with{" "}
                <span>
                  <img src={google} alt="" />
                </span>
              </div>

              <p className="signup-text">
                Don’t have an account?{" "}
                <span className="span">
                  <Link to="/Signup"> Sign up</Link>
                </span>
              </p>
            </div>
          </form>
          <p className=" font-semibold text-[16px] w-[335px] text-center place-self-center mt-7 max-[340px]:w-full">
            By continuing, you agree to TaskFlow’s <span className=" text-[#1A73E8]">Terms of Service</span>{" "}
            and <span className=" text-[#1A73E8]"> Privacy Policy</span>
          </p>
        </div>
        <div className="login-left flex justify-center items-center max-[850px]:hidden">
          <img src={illustration} alt="Task illustration" />
        </div>
      </div>
    </div>
  );
};

export default Signinpage;
