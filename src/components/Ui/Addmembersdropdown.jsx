import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IoIosArrowDown } from "react-icons/io";

const getInitials = (name) => {
  return name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
};

const MembersDropdown = ({ label, value, options, onChange, required }) => {
  const [open, setOpen] = useState(false);

  // ✅ Look up the full option object from the current value
  const selected = options.find((opt) => opt.value === value);

  return (
    <div className="relative">
      <label className="text-[16px] font-normal max-[500px]:text-[14px]">
        {label} {required && <span className="text-red-500">*</span>}
      </label>

      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="w-full mt-1 border rounded-lg px-6 py-[18.5px] text-sm flex justify-between items-center border-[#A1A3AB]"
      >
        {/* ✅ Show label with initials avatar if selected, otherwise placeholder */}
        {selected ? (
          <div className="flex items-center gap-2">
            <span className="w-7 h-7 rounded-full bg-green-600 text-white text-xs flex items-center justify-center font-semibold">
              {getInitials(selected.label)}
            </span>
            <span className="text-[16px]">{selected.label}</span>
          </div>
        ) : (
          <span className="text-[16px]">Select</span>
        )}
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
                  onChange(option.value); // ✅ sends the id
                  setOpen(false);
                }}
                className="px-3 py-2 text-sm hover:bg-gray-100 cursor-pointer flex items-center gap-2"
              >
                {/* ✅ Show initials only if option has multi-word label (a name) */}
                {option.label.includes(" ") || option.label.length > 3 ? (
                  <span className="w-7 h-7 rounded-full bg-green-600 text-white text-xs flex items-center justify-center font-semibold shrink-0">
                    {getInitials(option.label)}
                  </span>
                ) : null}
                {option.label}
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MembersDropdown;