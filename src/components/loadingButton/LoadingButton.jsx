import React from "react";

const LoadingButton = ({
  loading,
  text = "Submit",
  loadingText = "Loading...",
  onClick,
  type = "submit",
  className = "",
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={loading}
      className={`w-full flex items-center justify-center gap-2 py-2 rounded-lg transition disabled:opacity-70 ${className}`}
    >
      {loading ? (
        <>
          <svg
            className="animate-spin h-5 w-5"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
              fill="none"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
            />
          </svg>
          {loadingText}
        </>
      ) : (
        text
      )}
    </button>
  );
};

export default LoadingButton;
