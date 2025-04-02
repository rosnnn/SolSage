import { Routes, Route, NavLink } from "react-router-dom";
import { useState } from "react";
import { WalletConnect } from "./components/WalletConnect";
import { TokenCreate } from "./components/TokenCreate";
import { TokenMint } from "./components/TokenMint";
import { TokenSend } from "./components/TokenSend";
import { TransactionHistory } from "./components/TransactionHistory";
import { Sun, Moon } from "lucide-react";

function App() {
  const [darkMode, setDarkMode] = useState(false);

  return (
    <div
      className={`min-h-screen p-6 transition-all duration-500 ${
        darkMode
          ? "bg-gray-900 text-white"
          : "bg-gray-100 text-gray-900"
      }`}
      style={{
        backgroundImage: darkMode
          ? "url('https://images.unsplash.com/photo-1448375240586-882707db888b?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')"
          : "url('https://cdn.pixabay.com/photo/2024/08/26/14/33/ai-generated-8999631_1280.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed"
      }}
    >
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-center mb-4">
          {!darkMode && (
            <img src="https://giffiles.alphacoders.com/136/13693.gif" alt="" className="h-20 w-20 rounded-full p-2" />
          )}
          <h1 className="text-4xl font-extrabold text-yellow-300 ml-3">SolSage</h1>
        </div>
        <p className="text-center text-yellow-200 mt-2 text-lg font-semibold">Smart and insightful token management</p>
        
        <nav className="moshpit p-4 mb-6 flex justify-around">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `text-yellow-300 text-lg hover:text-red-400 transition font-extrabold ${
                isActive ? "text-red-400" : ""
              }`
            }
            aria-label="Connect Wallet"
          >
            Connect Wallet
          </NavLink>
          <NavLink
            to="/create-token"
            className={({ isActive }) =>
              `text-yellow-300 text-lg hover:text-red-400 transition font-extrabold ${
                isActive ? "text-red-400" : ""
              }`
            }
            aria-label="Create Token"
          >
            Create Token
          </NavLink>
          <NavLink
            to="/mint-token"
            className={({ isActive }) =>
              `text-yellow-300 text-lg hover:text-red-400 transition font-extrabold ${
                isActive ? "text-red-400" : ""
              }`
            }
            aria-label="Mint Token"
          >
            Mint Token
          </NavLink>
          <NavLink
            to="/send-token"
            className={({ isActive }) =>
              `text-yellow-300 text-lg hover:text-red-400 transition font-extrabold ${
                isActive ? "text-red-400" : ""
              }`
            }
            aria-label="Send Token"
          >
            Send Token
          </NavLink>
          <NavLink
            to="/history"
            className={({ isActive }) =>
              `text-yellow-300 text-lg hover:text-red-400 transition font-extrabold ${
                isActive ? "text-red-400" : ""
              }`
            }
            aria-label="Transaction History"
          >
            Transaction History
          </NavLink>
        </nav>

        <div className="moshpit p-6">
          <Routes>
            <Route path="/" element={<WalletConnect />} />
            <Route path="/create-token" element={<TokenCreate />} />
            <Route path="/mint-token" element={<TokenMint />} />
            <Route path="/send-token" element={<TokenSend />} />
            <Route path="/history" element={<TransactionHistory />} />
            <Route path="*" element={<div className="text-center text-lg font-bold text-yellow-300">404 - Page Not Found</div>} />
          </Routes>
        </div>

        <div className="flex justify-center mt-6">
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-3 rounded-full bg-yellow-300 text-gray-900 hover:bg-yellow-400 transition flex items-center shadow-lg transform hover:scale-125 duration-300"
          >
            {darkMode ? <Sun className="h-8 w-8" /> : <Moon className="h-8 w-8" />}
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;