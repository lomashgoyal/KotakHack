import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { Amplify } from "aws-amplify";
import SecurityModel from "./SecurityModel.tsx"
// import outputs from "../amplify_outputs.json";

//Amplify.configure(outputs);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
     <SecurityModel />
  </React.StrictMode>
);
