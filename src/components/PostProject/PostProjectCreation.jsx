import React, { useEffect, useState } from "react";
import StatsCards from "../DashStatsCards/StatsCards";
import { useProjects } from "../Contexts/ProjectsContext";
import { getTasks } from "../../services/authService";

const PostProjectCreation = () => {
  const { projects } = useProjects();
  const user = JSON.parse(localStorage.getItem("user"));
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getTasks();
        setTasks(res.data || []);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const today = new Date().toDateString();

  const stats = {
    today: tasks.filter((t) => new Date(t.dueDate).toDateString() === today).length,
    inProgress: tasks.filter((t) => t.status === "Inprogress").length,
    overdue: tasks.filter((t) => t.dueDate && new Date(t.dueDate) < new Date() && t.status !== "Done").length,
    projects: projects.length,
  };

  // Task list — all tasks sorted by dueDate
  const taskList = [...tasks].sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));

  // Upcoming deadlines — not done, has dueDate, sorted soonest first
  const upcomingDeadlines = tasks
    .filter((t) => t.dueDate && t.status !== "Done")
    .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
    .slice(0, 5);

  const formatDate = (dateStr) => {
    if (!dateStr) return "No date";
    return new Date(dateStr).toLocaleDateString("en-US", {
      weekday: "short", day: "numeric", month: "short", year: "numeric",
    });
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "Done": return "bg-green-100 text-green-600";
      case "Inprogress": return "bg-purple-100 text-purple-600";
      case "Review": return "bg-yellow-100 text-yellow-600";
      default: return "bg-gray-100 text-gray-400";
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case "Done": return "Done";
      case "Inprogress": return "In Progress";
      case "Review": return "Review";
      default: return "Not Started";
    }
  };

  return (
    <div className="bg-[url('/src/assets/dashbg.png')] pt-[62px] min-h-screen px-[54px] max-[500px]:px-3.5 max-[500px]:pt-3 pb-10">
      {/* Header */}
      <div className="mb-[30px] font-['inter']">
        <h1 className="text-[24px] font-medium">
          Welcome back, {user?.username} <span>👋</span>
        </h1>
        <p className="text-[20px] font-light">
          You have {stats.today} task{stats.today !== 1 ? "s" : ""} to complete today
        </p>
      </div>

      {/* Stats */}
      <StatsCards stats={stats} />

      {/* Task List + Deadlines
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">

        Task List
        <div className="bg-white rounded-2xl border border-[#A1A3AB80] p-6">
          <h2 className="font-semibold text-[18px] mb-5">Task list</h2>
          {loading ? (
            <p className="text-sm text-gray-400">Loading...</p>
          ) : taskList.length === 0 ? (
            <p className="text-sm text-gray-400">No tasks yet</p>
          ) : (
            <ul className="space-y-3">
              {taskList.slice(0, 5).map((task) => (
                <li
                  key={task._id}
                  className="flex items-center justify-between p-3 rounded-xl bg-gray-50"
                >
                  <div className="flex flex-col gap-1">
                    <span className={`font-medium text-[15px] ${task.status === "Done" ? "line-through text-gray-400" : "text-gray-800"}`}>
                      {task.title}
                    </span>
                    <div className="flex items-center gap-3 text-xs text-gray-400">
                      {task.project?.projectTitle && (
                        <span className="flex items-center gap-1">
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                            <rect x="3" y="3" width="18" height="18" rx="2" stroke="#9CA3AF" strokeWidth="2"/>
                          </svg>
                          {task.project.projectTitle}
                        </span>
                      )}
                      {task.dueDate && (
                        <span className="flex items-center gap-1">
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                            <circle cx="12" cy="12" r="9" stroke="#9CA3AF" strokeWidth="2"/>
                            <path d="M12 7v5l3 3" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round"/>
                          </svg>
                          {formatDate(task.dueDate)}
                        </span>
                      )}
                    </div>
                  </div>
                  {task.status === "Done" ? (
                    <div className="w-7 h-7 rounded-full bg-green-500 flex items-center justify-center shrink-0">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                        <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                  ) : (
                    <div className="w-7 h-7 rounded-full border-2 border-gray-300 shrink-0" />
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>

        Upcoming Deadlines
        <div className="bg-white rounded-2xl border border-[#A1A3AB80] p-6">
          <h2 className="font-semibold text-[18px] mb-5">Task Status</h2>
          {loading ? (
            <p className="text-sm text-gray-400">Loading...</p>
          ) : upcomingDeadlines.length === 0 ? (
            <p className="text-sm text-gray-400">No upcoming deadlines 🎉</p>
          ) : (
            <ul className="divide-y divide-gray-50">
              {upcomingDeadlines.map((task) => (
                <li key={task._id} className="flex items-center justify-between py-3">
                  <div className="flex flex-col gap-1">
                    <span className="font-medium text-[15px] text-gray-800">{task.title}</span>
                    <span className="flex items-center gap-1 text-xs text-gray-400">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                        <circle cx="12" cy="12" r="9" stroke="#9CA3AF" strokeWidth="2"/>
                        <path d="M12 7v5l3 3" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round"/>
                      </svg>
                      {formatDate(task.dueDate)}
                    </span>
                  </div>
                  <span className={`text-xs px-3 py-1.5 rounded-lg font-medium ${getStatusStyle(task.status)}`}>
                    {getStatusLabel(task.status)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

      </div> */}

      
    </div>
  );
};

export default PostProjectCreation;