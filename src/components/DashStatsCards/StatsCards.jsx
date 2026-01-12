import React from "react";
import { Calendar, Clock, AlertCircle, Folder } from "lucide-react";
import StatCard from "../StatsCards/StatCard";

const StatsCards = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
      <StatCard
        label="Today's Task"
        value={stats.today}
        icon={
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M19 19H5V8H19M16 1V3H8V1H6V3H5C3.89 3 3 3.89 3 5V19C3 19.5304 3.21071 20.0391 3.58579 20.4142C3.96086 20.7893 4.46957 21 5 21H19C19.5304 21 20.0391 20.7893 20.4142 20.4142C20.7893 20.0391 21 19.5304 21 19V5C21 4.46957 20.7893 3.96086 20.4142 3.58579C20.0391 3.21071 19.5304 3 19 3H18V1M17 12H12V17H17V12Z"
              fill="#05A301"
            />
          </svg>
        }
        accent="text-green-600"
      />

      <StatCard
        label="In Progress"
        value={stats.inProgress}
        icon={<Clock size={24} />}
        accent="text-red-600"
      />

      <StatCard
        label="Overdue"
        value={stats.overdue}
        icon={<AlertCircle size={24} />}
        accent="text-red-600"
      />

      <StatCard
        label="Projects"
        value={stats.projects}
        icon={
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 12V6M7 14V6M17 16V6M5.4 3H18.6C19.2365 3 19.847 3.25286 20.2971 3.70294C20.7471 4.15303 21 4.76348 21 5.4V18.6C21 19.2365 20.7471 19.847 20.2971 20.2971C19.847 20.7471 19.2365 21 18.6 21H5.4C4.76348 21 4.15303 20.7471 3.70294 20.2971C3.25286 19.847 3 19.2365 3 18.6V5.4C3 5.08483 3.06208 4.77274 3.18269 4.48156C3.3033 4.19038 3.48008 3.9258 3.70294 3.70294C4.15303 3.25286 4.76348 3 5.4 3Z"
              stroke="#A845EF"
              stroke-width="2"
              stroke-miterlimit="10"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        }
        accent="text-purple-600"
      />
    </div>
  );
};

export default StatsCards;
