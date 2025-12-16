import { useState } from "react";
import "./App.css";
import { Routes, Route } from "react-router";
import Landingpage from "../src/pages/Landingpage/Landingpage";
import SignupPage from "../src/pages/SignupPage/SignupPage";
import SigninPage from "../src/pages/SigninPage/Signinpage";
import Dashboard from "../src/pages/Dashboard/Dashboard";

function App() {
  const [count, setCount] = useState(0);

  return (
    <div>
        <Routes>
          <Route path="/" element={<Landingpage />} />
          <Route path="/Signup" element={<SignupPage />} />
          <Route path="/Signin" element={<SigninPage />} />
          <Route path="/Dashboard" element={<Dashboard />} />
        </Routes>
    </div>
  );
}

export default App;
