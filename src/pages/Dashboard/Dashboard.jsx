import React, { useState } from "react";
import DashHeader from "../../components/DashHeader/DashHeader";
import { Link, Outlet } from "react-router";
import { NavLink } from "react-router-dom";
import { RiLayoutMasonryFill } from "react-icons/ri";
import { FaCalendarAlt } from "react-icons/fa";
import { TbMailFilled } from "react-icons/tb";
import { IoMdSettings } from "react-icons/io";
import { IoMdCheckboxOutline } from "react-icons/io";
import { IoMdCalendar } from "react-icons/io";
import { Users } from "lucide-react";
import ScrollToTopContainer from "../../components/ScrollToTopContainer";

const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className=" h-screen flex flex-col max-w-[2000px] mx-auto">
      <div className=" sticky top-0 z-10">
        <DashHeader setSidebarOpen={setSidebarOpen} />
      </div>

      {/* sidebar Navigation */}

      <div className=" flex flex-1 overflow-hidden">
        {sidebarOpen && (
          <div
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 bg-black/30 z-40 max-[1250px]:block hidden"
          />
        )}
        <aside
          className={`
    w-[326px] px-[17px] py-10 flex flex-col justify-between
    max-[1390px]:w-[250px] max-[1320px]:w-[200px]

    transition-transform duration-300

    max-[1250px]:fixed max-[1250px]:top-0 max-[1250px]:left-0 
    max-[1250px]:h-screen max-[1250px]:z-50 max-[1250px]:bg-white
    max-[1250px]:pt-24

    ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
  min-[1250px]:translate-x-0
  `}
        >
          <div className=" flex flex-col gap-3">
            <NavLink
              to="/dashboard"
              end
              className={({ isActive }) =>
                `rounded-2xl flex items-center gap-[21px] pl-[25px] max-[1320px]:gap-[19px]  py-[17.5px] transition 
     ${
       isActive ? "bg-[#05A301] text-white" : "text-[#05A301] hover:bg-green-50"
     }`
              }
            >
              <RiLayoutMasonryFill size={24} />

              <span className="font-medium">Dashboard</span>
            </NavLink>
            <NavLink
              to="projects"
              className={({ isActive }) =>
                `rounded-2xl flex items-center gap-[21px] pl-[25px] py-[17.5px] transition
     ${
       isActive ? "bg-[#05A301] text-white" : "text-[#05A301] hover:bg-green-50"
     }`
              }
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M13.2535 5.98003L12.0005 13.5L10.7475 5.98003C10.7174 5.7982 10.7273 5.612 10.7764 5.43437C10.8256 5.25674 10.9128 5.09193 11.032 4.95138C11.1512 4.81084 11.2996 4.69792 11.4668 4.62048C11.6341 4.54304 11.8162 4.50293 12.0005 4.50293C12.1848 4.50293 12.3669 4.54304 12.5341 4.62048C12.7013 4.69792 12.8497 4.81084 12.969 4.95138C13.0882 5.09193 13.1754 5.25674 13.2245 5.43437C13.2736 5.612 13.2835 5.7982 13.2535 5.98003Z"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M12 20C12.5523 20 13 19.5523 13 19C13 18.4477 12.5523 18 12 18C11.4477 18 11 18.4477 11 19C11 19.5523 11.4477 20 12 20Z"
                  stroke="currentColor"
                  strokeWidth="2"
                />
              </svg>

              <span className="font-medium">Projects</span>
            </NavLink>
            <NavLink
              to="calender"
              className={({ isActive }) =>
                `rounded-2xl flex items-center gap-[21px] pl-[25px] py-[17.5px] transition
     ${
       isActive ? "bg-[#05A301] text-white" : "text-[#05A301] hover:bg-green-50"
     }`
              }
            >
              <FaCalendarAlt size={24} />
              <span className="font-medium ">Calender</span>
            </NavLink>
            <NavLink
              to="inbox"
              className={({ isActive }) =>
                `rounded-2xl flex items-center gap-[21px] pl-[25px] py-[17.5px] transition
     ${
       isActive ? "bg-[#05A301] text-white" : "text-[#05A301] hover:bg-green-50"
     }`
              }
            >
              <TbMailFilled size={24} />
              <span className="font-medium ">Inbox</span>
            </NavLink>
            <NavLink
              to="settings"
              className={({ isActive }) =>
                `rounded-2xl flex items-center gap-[21px] pl-[25px] py-[17.5px] transition
     ${
       isActive ? "bg-[#05A301] text-white" : "text-[#05A301] hover:bg-green-50"
     }`
              }
            >
              <IoMdSettings size={24} />
              <span className="font-medium ">Settings</span>
            </NavLink>
          </div>
          <div className=" rounded-2xl flex items-center gap-[21px] pl-[25px] py-[17.5px]">
            <svg
              width="25"
              height="24"
              viewBox="0 0 25 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M18.9259 6.66667L17.0333 8.53333L19.1963 10.6667H8.11111V13.3333H19.1963L17.0333 15.4667L18.9259 17.3333L24.3333 12L18.9259 6.66667ZM2.7037 2.66667H12.1667V0H2.7037C1.21667 0 0 1.2 0 2.66667V21.3333C0 22.8 1.21667 24 2.7037 24H12.1667V21.3333H2.7037V2.66667Z"
                fill="#05A301"
              />
            </svg>
            <p className=" text-[#05A301] cursor-pointer">Logout</p>
          </div>
        </aside>

        {/* Different pages showcase */}

        <div id="dashboard-scroll" className="  flex-1 overflow-y-auto">
          <div className="w-full ">
            <ScrollToTopContainer />
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
