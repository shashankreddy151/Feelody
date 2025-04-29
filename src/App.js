import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import MoodSelector from "./components/MoodSelector";
import Player from "./pages/Player";
import Logo from "./components/Logo";
import './App.css';

function AnimatedRoutes() {
  const location = useLocation();
  
  return (
    <div className="relative min-h-screen pt-12"> {/* Reduced from pt-20 to pt-12 */}
      <Logo />
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route
            path="/"
            element={
              <div className="min-h-[calc(100vh-3rem)] flex flex-col items-center justify-center"> {/* Reduced from 5rem to 3rem */}
                <MoodSelector />
              </div>
            }
          />
          <Route
            path="/player"
            element={<Player />}
          />
        </Routes>
      </AnimatePresence>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AnimatedRoutes />
    </Router>
  );
}

export default App;
