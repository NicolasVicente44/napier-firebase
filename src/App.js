import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import { auth } from "./firebase/firebase";
import Login from "./views/Login";
import Dashboard from "./views/components/Dashboard";
import Home from "./views/components/Home";
import Cases from "./views/components/Cases"; // Make sure to import Cases if it's being used
import Reporting from "./views/components/Reporting"; // Make sure to import Reporting if it's being used

function App() {
  const [user, setUser] = React.useState(null);

  React.useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(setUser);
    return () => unsubscribe();
  }, []);

  return (
    <Router>
      <Routes>
        <Route
          path="/login"
          element={!user ? <Login /> : <Navigate to="/home" />}
        />
        <Route
          path="/dashboard"
          element={user ? <Dashboard user={user} /> : <Navigate to="/login" />}
        />
        <Route
          path="/home"
          element={user ? <Home user={user} /> : <Navigate to="/login" />}
        />
        <Route
          path="/cases"
          element={user ? <Cases user={user} /> : <Navigate to="/login" />}
        />
        <Route
          path="/reporting"
          element={user ? <Reporting user={user} /> : <Navigate to="/login" />}
        />
        <Route path="/" element={<Navigate to={user ? "/home" : "/login"} />} />
      </Routes>
    </Router>
  );
}

export default App;
