import React from "react";
import "./Landingpagecont4.css";
import Star1 from "../../assets/Frame 159.png";
import Star2 from "../../assets/Frame 159 (1).png"
import Star3 from "../../assets/Frame 159 (4).png"
import Circle from "../../assets/Ellipse 15.png";

const Landingpagecont4 = () => {
  return (
    <div className="Landingpagecont4">
      <div className="cont4">
        <h6> Loved by Teams Worldwide</h6>
        <p> See what project coordinators and team leads are saying</p>

        <div className="features-cont4">
          <div className="featurescard-cont4">
            <div className="cards-cont4">
              <img src={Star1} alt="logo" className="" />
              <h5>
                {" "}
                TaskFlow solved our biggest pain point - mixing personal and
                team tasks. The offline feature is a game-changer for our
                distributed team.
              </h5>
              <div className="circle-cont4">
                <img src={Circle} alt="logo" className="" />
                <h6> Sarah Johnson <br/>Project Coordinator, TechStart Inc</h6>
              </div>
            </div>
          </div>

          <div className="featurescard-cont4">
            <div className="cards-cont4">
              <img src={Star2} alt="logo" className="" />
              <h5>
                {" "}
                We switched from Trello and haven't looked back. TaskFlow is
                cleaner, faster, and actually helps us stay organized instead of
                overwhelmed.
              </h5>
              <div className="circle-cont4">
                <img src={Circle} alt="logo" className="" />
                <h6> Michael Chukudi <br/> Team Lead, Design Studio</h6>
              </div>
            </div>
          </div>

          <div className="featurescard-cont4">
            <div className="cards-cont4">
              <img src={Star3} alt="logo" className="" />
               <h5>
                  {" "}
                  Finally, a tool that works with our internet situation.
                  TaskFlow keeps our team coordinated even when connectivity is
                  spotty.
                </h5>
              <div className="circle-cont4">
                <img src={Circle} alt="logo" className="" />
                <h6> Amina Okafor <br/> Operations Manager, Lagos Digital</h6>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landingpagecont4;
