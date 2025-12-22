import { useState } from "react";
import "./App.css";
import { Routes, Route } from "react-router-dom";
import Landingpage from "./pages/Landingpage/Landingpage";
import SignupPage from "../src/pages/SignupPage/SignupPage";
import SigninPage from "../src/pages/SigninPage/Signinpage";
import Dashboard from "../src/pages/Dashboard/Dashboard";
import DashHome from "./pages/Dashboard/DashHome";
import Projects from "./pages/Projects/Projects";
import Inbox from "./pages/Inbox/Inbox";
import Calender from "./pages/Calender/Calender";
import Settings from "./pages/Settings/Settings";
import { ProjectsProvider } from "./components/Contexts/ProjectsContext";

function App() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <ProjectsProvider>

      <Routes>
        <Route path="/" element={<Landingpage />} />
        <Route path="/Signup" element={<SignupPage />} />
        <Route path="/Signin" element={<SigninPage />} />
        <Route path="/dashboard" element={<Dashboard />}>
          <Route index element={<DashHome />} />
          <Route path="projects" element={<Projects />} />
          <Route path="inbox" element={<Inbox />} />
          <Route path="calender" element={<Calender />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
      </ProjectsProvider>
    </div>
  );
}

export default App;
