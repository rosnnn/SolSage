import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { SolanaProvider } from "./context/SolanaContext";
import "./styles/tailwind.css";

// Polyfill Buffer for browser environment
import { Buffer } from "buffer";
globalThis.Buffer = Buffer;

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <SolanaProvider>
        <App />
      </SolanaProvider>
    </BrowserRouter>
  </React.StrictMode>
);