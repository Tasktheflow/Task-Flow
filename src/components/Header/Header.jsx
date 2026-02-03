import React from 'react'
import { useState } from 'react'
import { Link } from 'react-router'
import './Header.css'
import Logo from '../../assets/flat-color-icons_todo-list.png'
import { motion } from "framer-motion";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);

  
  return (

    <motion.div className='navbar'
     initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}>
        <div className='logo-div'>
          <Link to ="/">  <img src ={Logo} alt='logo'/> </Link>
          <h4> 
           <span className="task">Task</span>
           <span className="flow">Flow</span>
          </h4>
        </div>

        {/* Hamburger icon */}
      <div className={`hamburger ${isOpen ? 'active' : ''}`} onClick={() => setIsOpen(!isOpen)}>
        <span className="bar"></span>
        <span className="bar"></span>
        <span className="bar"></span>
      </div>

      {/* nav-links */}

        <div className={`navlinks ${isOpen ? 'active' : ''}`}>
          <ul className='nav-ul'>
            <li>Features </li>
            <li> Benefits</li>
            <li> Testimonials</li>
            <li><Link to ='/Signin'> Log in </Link></li>
          </ul>
          <button className='nav-btn'>
            <Link to="/Signup">Get Started</Link>
           </button>
          
        </div>
        
     
       



    </motion.div>
  )
}

export default Header