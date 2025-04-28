import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MoodSelector from "./components/MoodSelector";
import Player from "./pages/Player";
import './App.css'; // you can keep this if needed

function App() {
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-indigo-400 via-purple-500 to-pink-500 p-8">
              <MoodSelector />
            </div>
          }
        />
        <Route
          path="/player"
          element={<Player />}
        />
      </Routes>
    </Router>
  );
}

export default App;
