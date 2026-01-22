import React from 'react'
import { useState } from 'react'
import { Link } from 'react-router'
import './Header.css'
import Logo from '../../assets/flat-color-icons_todo-list.png'

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);

  
  return (

    <div className='navbar'>
        <div className='logo-div'>
          <Link to ="/">  <img src ={Logo} alt='logo'/> </Link>
          <h4> 
           <span className="task">Task</span>
           <span className="flow">Flow</span>
          </h4>
        </div>

        {/* Hamburger icon */}
      <div className="hamburger" onClick={() => setIsOpen(!isOpen)}>
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
        
     
       



    </div>
  )
}

export default Header