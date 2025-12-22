import React from 'react'
import './Landingpagecont3.css'
import { Link } from 'react-router'
import Checkbox from "../../assets/streamline-ultimate_check-square-bold.png"
import Right from "../../assets/ep_right.png";
import Mobile from "../../assets/ant-design_mobile-outlined.png";
import Checked from "../../assets/Group.png";
import People from "../../assets/bi_people-fill.png";
import People2 from "../../assets/bi_people-fill (1).png";
const Landingpagecont3 = () => {
  return (
    <div className='Landingpagecont3'>
        <div className='text-cont3'>
            <h6> Why Teams Choose TaskFlow</h6>
            <h5> We listened to project coordinators, team leads, and managers. Here's what makes TaskFlow different:</h5>
           
            <div className='checkbox-cont3'>
                 <img src={Checkbox} alt="logo" className="" />
                 <p> No more cluttered boards</p>
            </div>
             <div className='checkbox-cont3'>
                 <img src={Checkbox} alt="logo" className="" />
                 <p> More flexible than Microsoft Planner</p>
            </div>
             <div className='checkbox-cont3'>
                 <img src={Checkbox} alt="logo" className="" />
                 <p> Better than WhatsApp coordination</p>
            </div>
             <div className='checkbox-cont3'>
                 <img src={Checkbox} alt="logo" className="" />
                 <p> Works offline for Nigerian teams</p>
            </div>
             <div className='checkbox-cont3'>
                 <img src={Checkbox} alt="logo" className="" />
                 <p> Clear workload visibility</p>
            </div>
             <div className='checkbox-cont3'>
                 <img src={Checkbox} alt="logo" className="" />
                 <p> Simple enough for everyone</p>
            </div>

            <div className='btn-cont3'> 
                <Link to="/Signup" className='btns-cont3'>
                <p> Get Started </p>
                <img src={Right} alt="logo" className="arrow-icon3" />
                </Link>
            </div>
        
            
        </div>

        <div className='cards-cont3'>
           <div className='firstcard-cont3'>
           <div className='card1-cont3'>
             <img src={Mobile} alt="logo" className="" />
              <h6> Mobile Ready</h6>
              <p> Works perfectly on any device</p>
            </div>

           <div className='card2-cont3'>
             <img src={Checked} alt="logo" className="" />
              <h6>Secure</h6>
              <p> High-level encryption</p>
           </div>
           </div>
           
           
           <div className='secondcard-cont3'>
            <div className='card3-cont3'>
              <img src={People} alt="logo" className="" />
              <h6> Team First</h6>
              <p> Built for collaboration</p>
            </div>

            <div className='card4-cont3'>
              <img src={People2} alt="logo" className="" />
              <h6> Quick Optimization</h6>
              <p> Optimized for speed</p>
           </div>
           </div>




        </div>

    </div>

  )
}

export default Landingpagecont3