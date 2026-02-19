import React from "react";
import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import { getMyNotifications } from "../../services/authService";


const timeAgo = (dateStr) => {
  if (!dateStr) return "";
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins} minute${mins > 1 ? "s" : ""} ago`;
  if (hours < 24) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  if (days === 1) return "Yesterday";
  return `${days} days ago`;
};

const getInitials = (name) => {
  if (!name) return "?";
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
};

// Notification type → icon
const NotifIcon = ({ type }) => {
  if (type === "deadline" || type === "due") {
    return (
      <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center shrink-0">
        <svg className="w-5 h-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
    );
  }
  if (type === "invite" || type === "team") {
    return (
      <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center shrink-0">
        <svg className="w-5 h-5 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      </div>
    );
  }
  return null; // falls back to avatar
};

// Avatar with initials
const Avatar = ({ name, color = "#05A301" }) => (
  <div
    className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-semibold shrink-0"
    style={{ backgroundColor: color }}
  >
    {getInitials(name)}
  </div>
);

// Pick avatar color based on name
const AVATAR_COLORS = [
  "#05A301", "#3B82F6", "#8B5CF6", "#F59E0B",
  "#EF4444", "#06B6D4", "#EC4899",
];
const avatarColor = (name = "") => {
  const idx = name.charCodeAt(0) % AVATAR_COLORS.length;
  return AVATAR_COLORS[idx];
};

// ─── Single notification row ──────────────────────────────────────────────────
const NotifRow = ({ notif, onMarkRead }) => {
  const showAvatar = !["deadline", "due", "invite", "team"].includes(notif.type);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -10 }}
      className={`flex gap-3 px-4 py-3.5 border-b border-gray-100 last:border-0 transition-colors ${
        !notif.read ? "bg-white" : "bg-gray-50/60"
      }`}
    >
      {/* Avatar / Icon */}
      {showAvatar ? (
        <Avatar
          name={notif.senderName || notif.sender}
          color={avatarColor(notif.senderName || notif.sender)}
        />
      ) : (
        <NotifIcon type={notif.type} />
      )}

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-gray-900 leading-snug">
          {notif.title || notif.type}
        </p>
        <p className="text-sm text-gray-500 mt-0.5 leading-snug">
          {notif.message || notif.body}
        </p>
        <div className="flex items-center gap-3 mt-1.5">
          <span className="text-xs text-gray-400">{timeAgo(notif.createdAt)}</span>
          {!notif.read && (
            <button
              onClick={() => onMarkRead(notif.id || notif._id)}
              className="text-xs text-green-600 flex items-center gap-1 hover:text-green-700 transition"
            >
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
              Mark as read
            </button>
          )}
        </div>
      </div>

      {/* Unread dot */}
      {!notif.read && (
        <span className="w-2 h-2 rounded-full bg-green-500 mt-1.5 shrink-0" />
      )}
    </motion.div>
  );
};

// ─── Main NotificationModal ───────────────────────────────────────────────────
const Notificationmodal = ({ onClose }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const modalRef = useRef(null);

  const unreadCount = notifications.filter((n) => !n.read).length;

  // ─── Fetch ────────────────────────────────────────────────────────────────
  const fetchNotifications = useCallback(async () => {
    try {
      const res = await getMyNotifications();
      const data = Array.isArray(res.data) ? res.data : [];
      // Normalize id field
      setNotifications(data.map((n) => ({ ...n, id: n.id || n._id })));
    } catch (err) {
      console.error(err);
      toast.error("Failed to load notifications");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  // ─── Close on outside click ───────────────────────────────────────────────
  useEffect(() => {
    const handleClick = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [onClose]);

  // ─── Actions (local state only until backend adds endpoints) ──────────────
  const handleMarkRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
    // TODO: await api.patch(`/api/notifications/${id}/read`);
  };

  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    // TODO: await api.patch("/api/notifications/read-all");
  };

  const handleClearAll = () => {
    setNotifications([]);
    // TODO: await api.delete("/api/notifications");
  };

  return (
    <motion.div
      ref={modalRef}
      initial={{ opacity: 0, y: -8, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -8, scale: 0.97 }}
      transition={{ duration: 0.18, ease: "easeOut" }}
      className="absolute right-0 top-full mt-3 w-[380px] max-w-[calc(100vw-24px)] bg-white rounded-2xl shadow-xl border border-gray-100 z-50 overflow-hidden font-['inter']"
    >
      {/* ── Header ──────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between px-4 py-3.5 border-b border-gray-100">
        <div className="flex items-center gap-2.5">
          <svg className="w-5 h-5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
              d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
          <span className="font-semibold text-gray-900">Notifications</span>
          {unreadCount > 0 && (
            <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full min-w-[22px] text-center">
              {unreadCount}
            </span>
          )}
        </div>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 transition"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clipRule="evenodd" />
          </svg>
        </button>
      </div>

      {/* ── Actions row ─────────────────────────────────────────────────── */}
      {notifications.length > 0 && (
        <div className="flex items-center justify-between px-4 py-2 border-b border-gray-100 bg-gray-50/50">
          <button
            onClick={handleMarkAllRead}
            disabled={unreadCount === 0}
            className="text-sm text-green-600 font-medium hover:text-green-700 transition disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Mark all as read
          </button>
          <button
            onClick={handleClearAll}
            className="text-sm text-gray-500 hover:text-gray-700 transition"
          >
            Clear all
          </button>
        </div>
      )}

      {/* ── Notification list ────────────────────────────────────────────── */}
      <div className="max-h-[420px] overflow-y-auto [&::-webkit-scrollbar]:w-0">
        {loading ? (
          <div className="flex items-center justify-center py-12 text-gray-400 text-sm">
            Loading...
          </div>
        ) : notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center px-4">
            <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-3">
              <svg className="w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </div>
            <p className="text-sm font-medium text-gray-500">You're all caught up!</p>
            <p className="text-xs text-gray-400 mt-1">No notifications right now</p>
          </div>
        ) : (
          <AnimatePresence mode="popLayout">
            {notifications.map((notif) => (
              <NotifRow
                key={notif.id}
                notif={notif}
                onMarkRead={handleMarkRead}
              />
            ))}
          </AnimatePresence>
        )}
      </div>
    </motion.div>
  );
};

export default Notificationmodal;