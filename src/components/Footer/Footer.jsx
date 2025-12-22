import React from 'react'
import './Footer.css'
import { Link } from 'react-router'
import Facebook from "../../assets/Vector (21).png"
import Twitter from "../../assets/prime_twitter.png"
import Linklden from "../../assets/uiw_linkedin.png"
import Tasklogo from "../../assets/Frame 130.png"
import Linefoot from"../../assets/Line 2 (1).png"

const Footer = () => {
  return (
    <div className='Footer'>
        <div className='Cont-foot'>
            <div className='text-foot'>
                 <img src={Tasklogo} alt="logo" className="" />
                 <h6> Simple yet structured task management for modern teams.</h6>
                 
                </div> 
                <div className='links-foot'>
                    <div className='link1-foot'>
                        <h6> Product </h6>
                        <ul>
                            <li>Features</li>
                            <li> Pricing</li>
                            <li> Updates</li>
                        </ul>
                    </div>

                    <div className='link2-foot'>
                        <h6> Company </h6>
                        <ul>
                            <li>About </li>
                            <li>Blog</li>
                            <li> Careers</li>
                        </ul>
                    </div>

                      <div className='link3-foot'>
                        <h6> Support</h6>
                        <ul>
                            <li>Help centre </li>
                            <li>Contact</li>
                            <li> Privacy</li>
                        </ul>
                    </div>

                </div>

        </div>
         <img src={Linefoot} alt="logo" className="line-foot" />
         <div className='flex-foot'>
            <div className='flex1-foot'>
                <h6> © 2025 TaskFlow. All rights reserved.</h6>
            </div>
            <div className='flex2-foot'>
                 <img src={Facebook} alt="logo" className="" />
                  <img src={Twitter} alt="logo" className="" />
                   <img src={Linklden} alt="logo" className="" />

            </div>
         </div>


    </div>
  )
}

export default Footer