import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import MoodSelector from "./components/MoodSelector";
import Player from "./pages/Player";
import Logo from "./components/Logo";
import './App.css';

function AnimatedRoutes() {
  const location = useLocation();
  
  return (
    <>
      <Logo />
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route
            path="/"
            element={
              <div className="min-h-screen flex flex-col items-center justify-center">
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
    </>
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
