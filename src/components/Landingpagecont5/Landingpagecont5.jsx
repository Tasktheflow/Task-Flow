import React from "react";
import "./Landingpagecont5.css";
import { Link } from "react-router";
import Right2 from "../../assets/Vector (22).png";
import { motion } from "framer-motion";

const Landingpagecont5 = () => {
  return (
    <motion.div
      className="Landingpagecont5"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
    >
      <div className="cont5">
        <h5> Ready to Transform Your Team's Productivity?</h5>
        <h6>
          {" "}
          Join thousands of teams using TaskFlow to stay organized and get work
          done.
        </h6>
        <div className="btn1-cont5">
          <Link to="/Signup" className="btns-cont5">
            <p> Get Started </p>
            <img src={Right2} alt="logo" className="arrow-icon5" />
          </Link>

          <button className="btn2-cont5">
            {" "}
            <Link to="/Signin">Sign in </Link>
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default Landingpagecont5;
