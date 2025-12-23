import React from "react";
import "./Landingpagecont2.css";
import Picon from "../../assets/picon_board.png";
import Picon1 from "../../assets/picon_board (1).png";
import Picon2 from "../../assets/picon_board (2).png";
import Picon3 from "../../assets/picon_board (3).png";
import Picon4 from "../../assets/picon_board (4).png";
import Picon5 from "../../assets/picon_board (5).png";

const Landingpagecont2 = () => {
  return (
    <div>
      <div className="landingpagecont2">
        <div className="text-cont2">
          <h5> Everything You Need to Stay Organized</h5>
          <p>
            {" "}
            Built from comprehensive UX research analyzing pain points with
            Trello, Microsoft Planner, and WhatsApp-based coordination.
          </p>
        </div>
      </div>

      <div className="featurescard-cont2">
        <div className="features-cont2">
          <div className="cards-cont2" style={{ maxWidth: 311 }}>
            <img src={Picon5} alt="img" className="" />
            <p> Clean Kanban Boards</p>
            <h6 style={{ maxWidth: 319 }}>
              {" "}
              Simple yet structured boards that avoid clutter. Organize tasks
              with To-Do, In Progress, Review, and Done columns.{" "}
            </h6>
          </div>
        </div>

        <div className="features-cont2">
          <div className="cards-cont2" style={{ maxWidth: 314 }}>
            <img src={Picon1} alt="img" className="" />
            <p> Unified Dashboard</p>
            <h6 style={{ maxWidth: 314 }}>
              {" "}
              See both personal and team tasks in one place. Perfect for
              coordinators managing mixed workloads.
            </h6>
          </div>
        </div>

        <div className="features-cont2">
          <div className="cards-cont2" style={{ maxWidth: 313 }}>
            <img src={Picon2} alt="img" className="" />
            <p> Simple Set-Up</p>
            <h6 style={{ maxWidth: 313 }}>
              {" "}
              Designed for a straightforward, no-friction setup that allows
              users to get started within minutes.
            </h6>
          </div>
        </div>

        <div className="features-cont2">
          <div className="cards-cont2" style={{ maxWidth: 305 }}>
            <img src={Picon3} alt="img" className="" />
            <p> Smart Scheduling</p>
            <h6 style={{ maxWidth: 305 }}>
              {" "}
              Visual calendar views with deadline tracking. Never miss an
              important date again.
            </h6>
          </div>
        </div>

        <div className="features-cont2">
          <div className="cards-cont2" style={{ maxWidth: 301 }}>
            <img src={Picon4} alt="img" className="" />
            <p> Smart Notifications</p>
            <h6 style={{ maxWidth: 285 }}>
              {" "}
              Get notified about what matters without the overwhelm. Stay in
              sync with your team.
            </h6>
          </div>
        </div>

        <div className="features-cont2">
          <div className="cards-cont2" style={{ maxWidth: 308}}>
            <img src={Picon5} alt="img" className="" />
            <p> Fast Collaboration</p>
            <h6 style={{ maxWidth: 308 }}>
              {" "}
              Comments, attachments, and real-time updates. Collaborate without
              switching apps.
            </h6>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landingpagecont2;
