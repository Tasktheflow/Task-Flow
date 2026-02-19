import { useState } from "react";
import { motion } from "framer-motion";
import { inviteMember } from "../../services/authService";
import { toast } from "react-toastify";

const InviteMemberModal = ({ onClose, projectId }) => {
  const [email, setEmail] = useState("");
  const [copySuccess, setCopySuccess] = useState(false);
  const [sendSuccess, setSendSuccess] = useState(false);
  const [isSending, setIsSending] = useState(false);

  // Generate project link - trim projectId and ensure it's not empty
  const projectLink = projectId && projectId.toString().trim() 
    ? `${window.location.origin}/dashboard/projects/${projectId.toString().trim()}` 
    : "";

  const handleSendInvite = async (e) => {
    e.preventDefault();

    if (!email.trim()) {
      toast.error("Please enter an email address");
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    if (!projectId) {
      toast.error("Project ID is missing");
      return;
    }

    try {
      setIsSending(true);
      const res = await inviteMember(projectId.toString().trim(), email.trim());
      setSendSuccess(true);
      setEmail("");
      setTimeout(() => setSendSuccess(false), 2000);
    } catch (err) {
      console.error("Invite failed:", err);
      const message = err?.response?.data?.message || err.message || "Failed to send invite";
      toast.error(message);
    } finally {
      setIsSending(false);
    }
  };

  const handleCopyLink = () => {
    if (!projectLink) {
      toast.error("Project link is not available");
      return;
    }
    navigator.clipboard
      .writeText(projectLink)
      .then(() => {
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000);
      })
      .catch((err) => {
        console.error("Failed to copy:", err);
        toast.error("Failed to copy link");
      });
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 font-['Montserrat']">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-white rounded-xl max-w-[642px] p-8 relative w-[50%] min-h-[550px] flex flex-col max-[1020px]:w-[60%] max-[900px]:w-[70%] max-[750px]:w-[80%] max-[600px]:w-[95%] max-[500px]:px-4 max-[500px]:min-h-[480px] max-[500px]:pt-9"
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-6 h-[25px] max-[370px]:flex-col-reverse max-[370px]:items-start max-[370px]:gap-2">
          <div>
            <h2 className="text-[16px] font-semibold font-['Montserrat'] max-[450px]:text-[12px]">
              Send an invite to a new member
            </h2>
            <span className=" w-[98px] block h-0.5 bg-[#05A301]"></span>
          </div>
          <button
            onClick={onClose}
            className="text-[#05A301] text-[14px] font-semibold underline cursor-pointer font-['Montserrat']"
          >
            Go Back
          </button>
        </div>

        <div className=" border border-[#A1A3ABA3] px-[9px] py-[17px] flex-1">
        {/* Email Section */}
        <form onSubmit={handleSendInvite} className="mb-[45px]">
          <label className="block text-[14px] font-semibold mb-[9px]">Email</label>
          <div className="flex gap-2 max-[450px]:flex-col">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="sammieser99@gmail.com"
              className="flex-1 border border-gray-300 rounded-lg px-4 py-2.5 text-[14px] placeholder:text-gray-400 focus:outline-none focus:border-[#05A301]"
            />
            <button
              type="submit"
              disabled={isSending}
              className={`px-6 py-2.5 rounded-lg text-[12px] font-medium transition-colors ${
                isSending
                  ? "bg-gray-400 text-white cursor-not-allowed"
                  : "bg-[#05A301] text-white hover:bg-[#048f01]"
              }`}
            >
              {isSending ? "Sending..." : sendSuccess ? "Sent!" : "Send Invite"}
            </button>
          </div>
          {sendSuccess && (
            <p className="text-green-600 text-sm mt-2">
              Invitation sent successfully!
            </p>
          )}
        </form>

        {/* Project Link Section */}
        <div>
          <label className="block text-[14px] font-semibold mb-[9px]">
            Project Link
          </label>
          <div className="flex gap-2 max-[450px]:flex-col">
            <input
              type="text"
              value={projectLink}
              readOnly
              className="flex-1 border border-gray-300 rounded-lg px-4 py-2.5 text-[14px] bg-gray-50 text-gray-600 focus:outline-none"
            />
            <button
              onClick={handleCopyLink}
              disabled={!projectLink}
              className={`text-white px-6 py-2.5 rounded-lg text-[12px] font-medium transition-colors min-w-[110px] ${
                projectLink
                  ? "bg-[#05A301] hover:bg-[#048f01] cursor-pointer"
                  : "bg-gray-400 cursor-not-allowed"
              }`}
            >
              {copySuccess ? "Copied!" : "Copy Link"}
            </button>
          </div>
          {copySuccess && (
            <p className="text-green-600 text-sm mt-2">
              Link copied to clipboard!
            </p>
          )}
          {!projectLink && (
            <p className="text-red-600 text-sm mt-2">
              Project link is not available
            </p>
          )}
        </div>

        </div>

      </motion.div>
    </div>
  );
};

export default InviteMemberModal;
