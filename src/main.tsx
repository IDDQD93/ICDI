import React from "react";
import ReactDOM from "react-dom/client";
import App from "./components/App";
import "./components/App.css"; //  ← так правильно при твоей структуре

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
