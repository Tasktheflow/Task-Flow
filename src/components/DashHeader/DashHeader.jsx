import React from "react";
import { Search, Bell, Plus } from "lucide-react";
import Tasklogo from "../../assets/Tasklogo.png";

const DashHeader = () => {
  return (
    <div>
      <header className="bg-white  px-[57px] py-5 shadow-[0px_4px_12px_0px_#00000012] ">
        <div className="flex items-center justify-between ">
          <div>
            <img src={Tasklogo} alt="logo" />
          </div>
          <div className=" max-w-[695px] w-[48.3%]">
            <div className="relative flex items-center gap-2">
              <div className="relative flex-1 shadow-[-1px_4px_10px_0px_#0000000A,-4px_17px_18px_0px_#00000008,-9px_39px_24px_0px_#00000005,-17px_69px_28px_0px_#00000003,-26px_108px_31px_0px_#00000000] rounded-lg">
                <input
                  type="text"
                  placeholder="Search your task here..."
                  className="w-full pl-4 pr-12 py-2.75 bg-gray-50 border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-300 text-gray-600 placeholder-gray-400 placeholder:font-['Montserrat', sans-serif;] placeholder:text-[12px] placeholder:font-semibold"
                />
                <button className="absolute right-0 top-1/2 -translate-y-1/2 w-11  bg-[#05A301] rounded-lg flex items-center justify-center hover:bg-green-500 transition-colors cursor-pointer h-full">
                  <Search className="text-white" size={16} />
                </button>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-[30px] ">
            <button className="relative p-3  rounded-lg  transition-colors">
              <svg
                width="21"
                height="23"
                viewBox="0 0 21 23"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M10.4279 0C8.26192 0 6.1847 0.860414 4.65315 2.39196C3.1216 3.92351 2.26119 6.00073 2.26119 8.16667V12.2827C2.26136 12.4636 2.21942 12.6422 2.13869 12.8042L0.135523 16.8093C0.0376708 17.005 -0.00853432 17.2224 0.0012965 17.441C0.0111273 17.6596 0.0766676 17.872 0.191692 18.0581C0.306717 18.2442 0.467408 18.3978 0.658501 18.5043C0.849595 18.6108 1.06475 18.6667 1.28352 18.6667H19.5722C19.791 18.6667 20.0061 18.6108 20.1972 18.5043C20.3883 18.3978 20.549 18.2442 20.664 18.0581C20.779 17.872 20.8446 17.6596 20.8544 17.441C20.8642 17.2224 20.818 17.005 20.7202 16.8093L18.7182 12.8042C18.6371 12.6423 18.5947 12.4637 18.5945 12.2827V8.16667C18.5945 6.00073 17.7341 3.92351 16.2026 2.39196C14.671 0.860414 12.5938 0 10.4279 0ZM10.4279 22.1667C9.70376 22.167 8.99737 21.9428 8.40604 21.5249C7.81471 21.107 7.36755 20.516 7.12619 19.8333H13.7295C13.4882 20.516 13.041 21.107 12.4497 21.5249C11.8583 21.9428 11.1519 22.167 10.4279 22.1667Z"
                  fill="#05A301"
                />
              </svg>

              <span className="absolute top-2.5 right-2.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <div className=" flex items-center gap-2">
                <div className="w-10 h-10 bg-gray-300  rounded-full flex items-center justify-center text-white font-semibold">
              AO
            </div>
            <span className="font-medium text-gray-800 font-['Inter', sans-serif;] text-[15px]">Ada Ogunleye</span>
            </div>
          </div>
        </div>
      </header>
    </div>
  );
};

export default DashHeader;
