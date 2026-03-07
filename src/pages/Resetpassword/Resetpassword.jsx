import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import resetpic from "../../assets/reset.png";

const BASE_URL = "https://task-flow-g8s6.vercel.app";

const EyeIcon = ({ open }) =>
  open ? (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
  ) : (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.477 0-8.268-2.943-9.542-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.477 0 8.268 2.943 9.542 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
    </svg>
  );

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [status, setStatus] = useState("idle"); // idle | loading | success | error
  const [errorMsg, setErrorMsg] = useState("");

  // Password strength checker
  const getStrength = (pwd) => {
    if (!pwd) return null;
    if (pwd.length < 6) return { label: "Too short", color: "bg-red-400", width: "w-1/4" };
    if (pwd.length < 8) return { label: "Weak", color: "bg-orange-400", width: "w-2/4" };
    if (!/[A-Z]/.test(pwd) || !/[0-9]/.test(pwd)) return { label: "Fair", color: "bg-yellow-400", width: "w-3/4" };
    return { label: "Strong", color: "bg-[#6b8c5a]", width: "w-full" };
  };

  const strength = getStrength(newPassword);

  const handleSubmit = async () => {
    if (!token) {
      setErrorMsg("Reset token is missing or invalid. Please request a new link.");
      setStatus("error");
      return;
    }
    if (!newPassword || !confirmPassword) {
      setErrorMsg("Please fill in both password fields.");
      setStatus("error");
      return;
    }
    if (newPassword.length < 8) {
      setErrorMsg("Password must be at least 8 characters.");
      setStatus("error");
      return;
    }
    if (newPassword !== confirmPassword) {
      setErrorMsg("Passwords do not match.");
      setStatus("error");
      return;
    }

    setStatus("loading");
    setErrorMsg("");

    try {
      const response = await fetch(`${BASE_URL}/api/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword, confirmPassword }),
      });

      const contentType = response.headers.get("content-type");
      const data = contentType?.includes("application/json")
        ? await response.json()
        : null;

      if (response.ok) {
        setStatus("success");
      } else {
        setErrorMsg(
          data?.message ||
          data?.error ||
          `Request failed with status ${response.status}.`
        );
        setStatus("error");
      }
    } catch (err) {
      console.error("[ResetPassword] Fetch error:", err);
      setErrorMsg(
        err instanceof TypeError && err.message === "Failed to fetch"
          ? "Unable to reach the server. Check your connection or CORS settings."
          : `Unexpected error: ${err.message}`
      );
      setStatus("error");
    }
  };

  // ── Invalid / missing token screen ──
  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center  p-5 bg-[url('/src/assets/istockphoto.png')]">
        <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md px-10 py-12 flex flex-col items-center gap-4 text-center">
          <div className="w-16 h-16 rounded-full bg-red-50 border-2 border-red-400 flex items-center justify-center">
            <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M12 3a9 9 0 100 18A9 9 0 0012 3z" />
            </svg>
          </div>
          <h2 className="text-2xl font-extrabold text-gray-900">Invalid Link</h2>
          <p className="text-sm text-gray-500 leading-relaxed">
            This password reset link is invalid or has expired. Please request a new one.
          </p>
          <button
            onClick={() => navigate("/ForgotPassword")}
            className="mt-2 w-full py-4 rounded-xl bg-[#05A301] hover:bg-[#5a7a4a] text-white font-bold text-base transition-all duration-200"
          >
            Back to Forgot Password
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-5 bg-[url('/src/assets/istockphoto.png')]">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md px-10 py-10 flex flex-col items-center">

        {status !== "success" ? (
          <>
            {/* ── Illustration placeholder ── */}
            <div className="w-52 h-48 rounded-2xl bg-gray-100 flex items-center justify-center mb-2 overflow-hidden">
              
              <img
                src={resetpic}
                alt="Reset password illustration"
                className="w-full h-full object-contain"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                  e.currentTarget.nextElementSibling.style.display = "flex";
                }}
              />
            </div>

            {/* ── Title ── */}
            <h1 className="text-3xl font-bold  mt-2 mb-2 tracking-tight font-[inter]">
              Reset Password
            </h1>
            <p className="text-sm text-gray-500 text-center mb-7 leading-relaxed max-w-xs">
              Choose a strong new password for your account.
            </p>

            {/* ── New Password ── */}
            <div className="relative w-full mb-5">
              {/* <label className="absolute -top-2.5 left-3 bg-white px-1 text-[10px] font-bold tracking-widest text-gray-500 uppercase z-10">
                New Password
              </label> */}
              <input
                type={showNew ? "text" : "password"}
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) => {
                  setNewPassword(e.target.value);
                  if (status === "error") setStatus("idle");
                }}
                className={`w-full px-4 py-4 pr-12 rounded-xl border text-sm text-gray-800 placeholder-gray-400 outline-none transition-colors duration-200
                  ${status === "error" ? "border-red-400 focus:border-red-500" : "border-gray-300 focus:border-[#6b8c5a]"}`}
              />
              <button
                type="button"
                onClick={() => setShowNew(!showNew)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <EyeIcon open={showNew} />
              </button>

              {/* Password strength bar */}
              {newPassword.length > 0 && strength && (
                <div className="mt-2 space-y-1">
                  <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full transition-all duration-300 ${strength.color} ${strength.width}`} />
                  </div>
                  <p className={`text-xs font-semibold ${
                    strength.label === "Strong" ? "text-[#6b8c5a]" :
                    strength.label === "Fair" ? "text-yellow-500" : "text-red-400"
                  }`}>
                    {strength.label}
                  </p>
                </div>
              )}
            </div>

            {/* ── Confirm Password ── */}
            <div className="relative w-full mb-5">
              {/* <label className="absolute -top-2.5 left-3 bg-white px-1 text-[10px] font-bold tracking-widest text-gray-500 uppercase z-10">
                Confirm Password
              </label> */}
              <input
                type={showConfirm ? "text" : "password"}
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  if (status === "error") setStatus("idle");
                }}
                onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                className={`w-full px-4 py-4 pr-12 rounded-xl border text-sm text-gray-800 placeholder-gray-400 outline-none transition-colors duration-200
                  ${status === "error" ? "border-red-400 focus:border-red-500" : "border-gray-300 focus:border-[#6b8c5a]"}`}
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <EyeIcon open={showConfirm} />
              </button>

              {/* Match indicator */}
              {confirmPassword.length > 0 && (
                <p className={`text-xs font-semibold mt-1.5 ml-1 ${
                  newPassword === confirmPassword ? "text-[#6b8c5a]" : "text-red-400"
                }`}>
                  {newPassword === confirmPassword ? "Passwords match" : " Passwords do not match."}
                </p>
              )}
            </div>

            {/* ── Error message ── */}
            {status === "error" && (
              <p className="text-red-500 text-xs mb-4 self-start ml-1"> {errorMsg}</p>
            )}

            {/* ── Submit button ── */}
            <button
              onClick={handleSubmit}
              disabled={status === "loading"}
              className="w-full py-4 rounded-xl bg-[#6b8c5a] hover:bg-[#5a7a4a] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed text-white font-bold text-base tracking-wide transition-all duration-200"
            >
              {status === "loading" ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                  Resetting...
                </span>
              ) : (
                "Reset Password"
              )}
            </button>
          </>
        ) : (
          /* ── Success state ── */
          <div className="flex flex-col items-center gap-4 py-4 w-full text-center">
            <div className="w-20 h-20 rounded-full bg-green-50 border-2 border-[#6b8c5a] flex items-center justify-center">
              <svg className="w-9 h-9 text-[#6b8c5a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-extrabold text-gray-900">Password Reset!</h2>
            <p className="text-sm text-gray-500 leading-relaxed">
              Your password has been updated successfully. You can now log in with your new password.
            </p>
            <button
              onClick={() => navigate("/login")}
              className="mt-2 w-full py-4 rounded-xl bg-[#6b8c5a] hover:bg-[#5a7a4a] text-white font-bold text-base transition-all duration-200"
            >
              Go to Login
            </button>
          </div>
        )}

      </div>
    </div>
  );
}