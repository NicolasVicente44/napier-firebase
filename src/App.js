import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import { auth } from "./firebase/firebase";
import Login from "./views/Login";
import Dashboard from "./views/components/Dashboard"; // Ensure Dashboard is correctly exported
import Home from "./views/components/Home"; // Ensure Home is correctly exported
import Cases from "./views/components/Cases"; // Ensure Cases is correctly exported
import Reporting from "./views/components/Reporting"; // Ensure Reporting is correctly exported
import NOICreate from "./views/NOI/NOICreate";
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
        <Route
          path="/create-noi"
          element={
            user ? <NOICreate user={user} /> : <Navigate to="/create-noi" />
          }
        />
        <Route path="/" element={<Navigate to={user ? "/home" : "/login"} />} />
      </Routes>
    </Router>
  );
}

export default App;
