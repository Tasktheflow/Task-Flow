import React from "react";
import { Link } from "react-router";
import "./Landingpagecont1.css";
import Thunder from "../../assets/akar-icons_thunder.png";
import Right from "../../assets/ep_right (2).png";
import Istock from "../../assets/Frame 137 (2).png";
import { motion } from "framer-motion";

const Landingpagecont1 = () => {
  return (
    <div className="Landingpagecont1">
      <div className="flex-cont1">
        <div className="smart-cont1">
          <div className="simple-cont1">
            <img src={Thunder} alt="logo" className="" />
            <p> Simple yet Structured</p>
          </div>
          <motion.h4
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            The Smarter Way to Manage Your Project Tasks
          </motion.h4>
          <motion.p
            className="stay-cont1"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          >
            Stay on top of every project, track progress in real time, and drive
            your business forward effortlessly
          </motion.p>

          <Link to="/Signup" className="Get-cont1">
            <p> Get Started </p>
            <img src={Right} alt="logo" className="arrow-icon1" />
          </Link>
        </div>

        <motion.div
          className="img-cont1"
          animate={{ y: [0, -15, 0] }}
          transition={{ duration: 4, ease: "easeInOut" }}
        >
          <img src={Istock} alt="logo" className="" />
        </motion.div>
      </div>

      {/* section 2 */}
      <motion.div
        className="section2-cont1"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
      >
        <div className="users-cont1">
          <div className="Active-users">
            <h4> 10,000+ Active Users</h4>
          </div>
          <div className="Task-cont1">
            <h4>500K+ Tasks Completed </h4>
          </div>
          <div className="uptime-cont1">
            <h4> 99.9% Uptime </h4>
          </div>
          <div className="rating-cont1">
            <h4> 4.9/5 User Rating</h4>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Landingpagecont1;
