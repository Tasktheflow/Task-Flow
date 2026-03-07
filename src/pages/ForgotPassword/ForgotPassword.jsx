import { useState } from "react";
import forgotpic from "../../assets/forgotpass.png";

const BASE_URL = "https://task-flow-g8s6.vercel.app";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle"); // idle | loading | success | error
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async () => {
    if (!email.trim()) {
      setErrorMsg("Please enter your email address.");
      setStatus("error");
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setErrorMsg("Please enter a valid email address.");
      setStatus("error");
      return;
    }

    setStatus("loading");
    setErrorMsg("");

    try {
      const response = await fetch(`${BASE_URL}/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus("success");
      } else {
        setErrorMsg(data?.message || "Something went wrong. Please try again.");
        setStatus("error");
      }
    } catch (err) {
      setErrorMsg("Network error. Please check your connection and try again.");
      setStatus("error");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-5 bg-[url('/src/assets/istockphoto.png')]">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md px-10 py-10 flex flex-col items-center">

        {status !== "success" ? (
          <>
            {/* ── Illustration placeholder ── */}
            <div className="w-52 h-48 rounded-2xl bg-gray-100 flex items-center justify-center mb-2 overflow-hidden">
              <img
                src={forgotpic}
                alt="Forgot password illustration"
                className="w-full h-full object-contain"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                  e.currentTarget.nextElementSibling.style.display = "flex";
                }}
              />
              {/* <div style={{ display: "none" }} className="flex-col items-center gap-1 text-gray-400">
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="text-xs">Your illustration here</span>
              </div> */}
            </div>

            {/* ── Title ── */}
            <h1 className="text-3xl font-bold  mt-2 mb-2 tracking-tight font-[inter]">
              Forgot Password
            </h1>
            <p className="text-sm text-gray-500 text-center mb-7 leading-relaxed max-w-xs">
              Don't worry! It happens. Please enter the address associated with your account.
            </p>

            {/* ── Email input ── */}
            <div className=" w-full mb-5">
              {/* <label className=" bg-white px-1 text-[14px] font-bold tracking-widest text-gray-500 uppercase mb-3">
                Email Address
              </label> */}
              <input
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (status === "error") setStatus("idle");
                }}
                onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                className={`w-full px-4 py-4 rounded-xl border text-[16px] text-gray-800 placeholder-gray-400 outline-none transition-colors duration-200
                  ${status === "error"
                    ? "border-red-400 focus:border-red-500"
                    : "border-gray-300 focus:border-[#6b8c5a]"
                  }`}
              />
              {status === "error" && (
                <p className="text-red-500 text-xs mt-1.5 ml-1"> {errorMsg}</p>
              )}
            </div>

            {/* ── Submit button ── */}
            <button
              onClick={handleSubmit}
              disabled={status === "loading"}
              className="w-full py-4 rounded-xl bg-[#05A301] hover:bg-[#50a824] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed text-white font-bold text-base tracking-wide transition-all duration-200 cursor-pointer"
            >
              {status === "loading" ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                  Sending...
                </span>
              ) : (
                "Submit"
              )}
            </button>
          </>
        ) : (
          /* ── Success state ── */
          <div className="flex flex-col items-center gap-4 py-4 w-full">
            <div className="w-20 h-20 rounded-full bg-green-50 border-2 border-[#6b8c5a] flex items-center justify-center">
              <svg className="w-9 h-9 text-[#6b8c5a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-extrabold text-gray-900">Check your inbox!</h2>
            <p className="text-sm text-gray-500 text-center leading-relaxed">
              We've sent a password reset link to{" "}
              <span className="font-bold text-gray-700">{email}</span>.
              <br />
              The link will expire in <span className="font-bold">30 minutes</span>.
            </p>
            <p className="text-sm text-gray-500 mt-1">
              Didn't receive it?{" "}
              <button
                onClick={() => { setStatus("idle"); setEmail(""); }}
                className="text-[#6b8c5a] font-bold underline hover:text-[#5a7a4a] transition-colors"
              >
                Try again
              </button>
            </p>
          </div>
        )}

      </div>
    </div>
  );
}