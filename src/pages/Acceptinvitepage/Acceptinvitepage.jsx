import { useEffect, useState, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { motion } from "framer-motion";
import { acceptInvitation } from "../../services/authService";
import { RiLoginBoxLine } from "react-icons/ri";

const Acceptinvitepage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState("loading"); // "loading" | "success" | "error"
  const [message, setMessage] = useState("");
  const hasRun = useRef(false);

useEffect(() => {
  if (hasRun.current) return;
  hasRun.current = true;

  const token = new URLSearchParams(window.location.search).get("token");

  if (!token) {
    setStatus("error");
    setMessage("Invalid invite link. No token found.");
    return;
  }

  // If not logged in, save token and redirect to login
  const authToken = localStorage.getItem("token");
  if (!authToken) {
    localStorage.setItem("inviteToken", token);
    navigate("/Signin");
    return;
  }

  // Already logged in — accept immediately
  const accept = async () => {
    try {
      const res = await acceptInvitation(token);
      setStatus("success");
      setMessage(res.message || "You have successfully joined the project!");
      setTimeout(() => navigate(`/dashboard/projects/${res.projectId}`), 2500);
    } catch (err) {
      setStatus("error");
      setMessage(err.response?.data?.message || "This invite link is invalid or has expired.");
    }
  };

  accept();
}, []);
  return (
    <div className="min-h-screen bg-[url('/src/assets/istockphoto.png')] flex items-center justify-center px-4 font-['inter']">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="bg-white rounded-2xl shadow-sm border border-gray-100 p-10 w-full max-w-[420px] text-center"
      >
        {/* ── Loading ── */}
        {status === "loading" && (
          <>
            <div className="w-14 h-14 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-5">
              <svg
                className="w-7 h-7 text-green-500 animate-spin"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                />
              </svg>
            </div>
            <h1 className="text-lg font-semibold text-gray-900 mb-1">
              Accepting Invite...
            </h1>
            <p className="text-sm text-gray-400">
              Please wait while we verify your invitation.
            </p>
          </>
        )}

        {/* ── Success ───*/}
        {status === "success" && (
          <>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-5"
            >
              <svg
                className="w-7 h-7 text-green-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </motion.div>
            <h1 className="text-lg font-semibold text-gray-900 mb-1">
              You're in!
            </h1>
            <p className="text-sm text-gray-500 mb-5">{message}</p>
            <p className="text-xs text-gray-400">
              Redirecting you to your projects...
            </p>
            <div className="mt-4 h-1 w-full bg-gray-100 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-green-500 rounded-full"
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 2.5, ease: "linear" }}
              />
            </div>
          </>
        )}

        {/* ── Error ─ */}
        {status === "error" && (
          <>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-5"
            >
              <svg
                className="w-7 h-7 text-red-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </motion.div>
            <h1 className="text-lg font-semibold text-gray-900 mb-1">
              Invite Failed
            </h1>
            <p className="text-sm text-gray-500 mb-6">{message}</p>
            <button
              onClick={() => navigate("/dashboard")}
              className="w-full py-2.5 bg-green-600 text-white rounded-xl text-sm font-medium hover:bg-green-700 transition"
            >
              Go to Dashboard
            </button>
          </>
        )}

     
      </motion.div>
    </div>
  );
};

export default Acceptinvitepage;
