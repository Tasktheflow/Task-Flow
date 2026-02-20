import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { motion } from "framer-motion";
import { acceptInvitation } from "../../services/authService";

const Acceptinvitepage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState("loading"); // "loading" | "success" | "error"
  const [message, setMessage] = useState("");

  useEffect(() => {
    const token = searchParams.get("token");

    if (!token) {
      setStatus("error");
      setMessage("Invalid invite link. No token found.");
      return;
    }

    const accept = async () => {
      try {
        const res = await acceptInvitation(token);
        setStatus("success");
        setMessage(res.message || "You have successfully joined the project!");

        // Redirect to dashboard after 2.5 seconds
        setTimeout(() => navigate("/dashboard/projects"), 2500);
      } catch (err) {
        setStatus("error");
        setMessage(
          err.response?.data?.message ||
            "This invite link is invalid or has expired.",
        );
      }
    };

    accept();
  }, [searchParams, navigate]);
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 font-['inter']">
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
              onClick={() => navigate("/dashboard/projects")}
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
