import { useState } from "react";
import "./App.css";
import { Routes, Route } from "react-router";
import Landingpage from "./pages/Landingpage/Landingpage";
import SignupPage from "../src/pages/SignupPage/SignupPage";
import SigninPage from "../src/pages/SigninPage/Signinpage";
import Dashboard from "../src/pages/Dashboard/Dashboard";
import DashHome from "./pages/Dashboard/DashHome";
import Projects from "./pages/Projects/Projects";
import Recyclebin from "./pages/Recyclebin/Recyclebin";
import Calender from "./pages/Calender/Calender";
import "react-big-calendar/lib/css/react-big-calendar.css";
import Settings from "./pages/Settings/Settings";
import { ProjectsProvider } from "./components/Contexts/ProjectsContext";
import ScrollToTop from "./components/ScrollToTop";
import ProjectDetails from "./pages/Projects/ProjectDetails";
import { ToastContainer } from "react-toastify";
import Acceptinvitepage from "./pages/Acceptinvitepage/Acceptinvitepage";

function App() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <ProjectsProvider>
        <ScrollToTop />
        <ToastContainer />
        <Routes>
          <Route path="/" element={<Landingpage />} />
          <Route path="/Signup" element={<SignupPage />} />
          <Route path="/Signin" element={<SigninPage />} />
          <Route path="/dashboard" element={<Dashboard />}>
            <Route index element={<DashHome />} />
            <Route path="projects" element={<Projects />}>
              <Route path=":projectId" element={<ProjectDetails />} />
            </Route>

            <Route path="recyclebin" element={<Recyclebin />} />
            <Route path="calender" element={<Calender />} />
            <Route path="settings" element={<Settings />} />
          </Route>
          <Route path="/invite/accept" element={<Acceptinvitepage />} />
        </Routes>
      </ProjectsProvider>
    </div>
  );
}

export default App;
