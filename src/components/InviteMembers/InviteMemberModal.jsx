import { useState } from "react";
import { motion } from "framer-motion";

const InviteMemberModal = ({ onClose, projectId }) => {
  const [email, setEmail] = useState("");
  const [copySuccess, setCopySuccess] = useState(false);
  const [sendSuccess, setSendSuccess] = useState(false);

  // Generate project link (adjust based on your actual URL structure)
  const projectLink = `${window.location.origin}/project/${projectId}`;

  const handleSendInvite = (e) => {
    e.preventDefault();

    if (!email.trim()) {
      alert("Please enter an email address");
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert("Please enter a valid email address");
      return;
    }

    // Here you would typically make an API call to send the invitation
    // For now, we'll just simulate it
    console.log("Sending invite to:", email);
    console.log("Project link:", projectLink);

    // Show success message
    setSendSuccess(true);
    setTimeout(() => {
      setSendSuccess(false);
      setEmail("");
    }, 2000);

    // In a real implementation, you would do something like:
    // await fetch('/api/send-invite', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ email, projectLink, projectId })
    // });
  };

  const handleCopyLink = () => {
    navigator.clipboard
      .writeText(projectLink)
      .then(() => {
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000);
      })
      .catch((err) => {
        console.error("Failed to copy:", err);
        alert("Failed to copy link");
      });
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 font-['Montserrat']">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-white rounded-xl max-w-[642px] p-8 relative w-[50%] min-h-[550px] flex flex-col"
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-6 h-[25px]">
          <div>
            <h2 className="text-[16px] font-semibold font-['Montserrat']">
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
          <div className="flex gap-2">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="sammieser99@gmail.com"
              className="flex-1 border border-gray-300 rounded-lg px-4 py-2.5 text-[14px] placeholder:text-gray-400 focus:outline-none focus:border-[#05A301]"
            />
            <button
              type="submit"
              className="bg-[#05A301] text-white px-6 py-2.5 rounded-lg text-[12px] font-medium hover:bg-[#048f01] transition-colors"
            >
              {sendSuccess ? "Sent! ✓" : "Send Invite"}
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
          <div className="flex gap-2">
            <input
              type="text"
              value={projectLink}
              readOnly
              className="flex-1 border border-gray-300 rounded-lg px-4 py-2.5 text-[14px] bg-gray-50 text-gray-600 focus:outline-none"
            />
            <button
              onClick={handleCopyLink}
              className="bg-[#05A301] text-white px-6 py-2.5 rounded-lg text-[12px] font-medium hover:bg-[#048f01] transition-colors min-w-[110px]"
            >
              {copySuccess ? "Copied! ✓" : "Copy Link"}
            </button>
          </div>
          {copySuccess && (
            <p className="text-green-600 text-sm mt-2">
              Link copied to clipboard!
            </p>
          )}
        </div>

        </div>

      </motion.div>
    </div>
  );
};

export default InviteMemberModal;
