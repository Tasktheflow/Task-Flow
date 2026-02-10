import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { BrowserRouter } from "react-router";
import { ProjectsProvider } from "./components/Contexts/ProjectsContext.jsx";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <StrictMode>
      <ProjectsProvider>
        <App />
      </ProjectsProvider>
    </StrictMode>
  </BrowserRouter>,
);
