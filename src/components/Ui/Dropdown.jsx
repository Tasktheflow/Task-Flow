import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IoIosArrowDown } from "react-icons/io";

const Dropdown = ({ label, value, options, onChange, required }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <label className="text-[20px] font-normal">
        {label} {required && <span className="text-red-500">*</span>}
      </label>

      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="w-full mt-1 border rounded-lg px-6 py-[18.5px] text-sm flex justify-between items-center border-[#A1A3AB]"
      >
        <span className=" text-[16px]">{value || "Select"}</span>
        <IoIosArrowDown />
      </button>

      <AnimatePresence>
        {open && (
          <motion.ul
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className="absolute z-10 w-full bg-white border rounded-lg mt-1 shadow-md"
          >
            {options.map((option) => (
              <li
                key={option.value}
                onClick={() => {
                  onChange(option.value);
                  setOpen(false);
                }}
                className="px-3 py-2 text-sm hover:bg-gray-100 cursor-pointer"
              >
                {option.label}
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Dropdown;
