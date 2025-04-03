import { Routes, Route, NavLink } from "react-router-dom";
import { useState } from "react";
import { WalletConnect } from "./components/WalletConnect";
import { TokenCreate } from "./components/TokenCreate";
import { TokenMint } from "./components/TokenMint";
import { TokenSend } from "./components/TokenSend";
import { TransactionHistory } from "./components/TransactionHistory";
import { Sun, Moon, Menu, X } from "lucide-react";

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div
      className={`min-h-screen p-6 transition-all duration-500 ${
        darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"
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
        {/* Header - Centered Logo and Title */}
        <div className="flex items-center justify-center mb-4">
          {!darkMode && (
            <img
              src="https://giffiles.alphacoders.com/136/13693.gif"
              alt=""
              className="h-20 w-20 rounded-full p-2"
            />
          )}
          <h1 className="text-4xl font-extrabold text-yellow-300 ml-3">SolSage</h1>
        </div>

        {/* Hamburger Menu Button - Centered on Small Screens */}
        <div className="flex justify-center md:hidden">
          <button
            className="p-2 rounded-md border-2 border-gray-700 dark:border-gray-300 bg-transparent flex items-center justify-center"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? (
              <X size={32} className="text-gray-900 dark:text-white" />
            ) : (
              <Menu size={32} className="text-gray-900 dark:text-white font-bold" />
            )}
          </button>
        </div>

        {/* Tagline */}
        <p className="text-center text-yellow-200 mt-2 text-lg font-semibold">
          Smart and insightful token management
        </p>

        {/* Desktop Navigation - Hidden on Small Screens */}
        <nav className="moshpit p-4 mb-6 hidden md:flex justify-around">
          {["/", "/create-token", "/mint-token", "/send-token", "/history"].map((path, index) => (
            <NavLink
              key={index}
              to={path}
              className={({ isActive }) =>
                `text-yellow-300 text-lg hover:text-red-400 transition font-extrabold ${
                  isActive ? "text-red-400" : ""
                }`
              }
            >
              {["Connect Wallet", "Create Token", "Mint Token", "Send Token", "Transaction History"][index]}
            </NavLink>
          ))}
        </nav>

        {/* Mobile Menu - Only Visible on Small Screens */}
        {menuOpen && (
          <div className="md:hidden bg-gray-800 p-4 rounded-lg shadow-lg text-center">
            {["/", "/create-token", "/mint-token", "/send-token", "/history"].map((path, index) => (
              <NavLink
                key={index}
                to={path}
                className="block py-2 text-yellow-300 text-lg font-extrabold hover:text-red-400"
                onClick={() => setMenuOpen(false)} // Close menu when link is clicked
              >
                {["Connect Wallet", "Create Token", "Mint Token", "Send Token", "Transaction History"][index]}
              </NavLink>
            ))}
          </div>
        )}

        {/* Main Content */}
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

        {/* Theme Toggle Button */}
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
