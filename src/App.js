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
import Cases from "./views/components/Cases";
import Reporting from "./views/components/Reporting";
import NOICreate from "./views/NOI/NOICreate";
import Notifications from "./views/components/Notifications";
import Settings from "./views/components/Settings";
import Users from "./views/components/Users";
import NOIDetails from "./views/NOI/NOIDetails";
import Favourites from "./views/components/Favourites";
import NOIMap from "./views/components/NOIMap";
import Documents from "./views/components/Documents";

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
          path="/noidetails/:id"
          element={user ? <NOIDetails user={user} /> : <Navigate to="/login" />}
        />
        <Route
          path="/noimap"
          element={user ? <NOIMap user={user} /> : <Navigate to="/login" />}
        />
        <Route
          path="/reporting"
          element={user ? <Reporting user={user} /> : <Navigate to="/login" />}
        />
        <Route
          path="/notifications"
          element={
            user ? <Notifications user={user} /> : <Navigate to="/login" />
          }
        />
        <Route
          path="/documents"
          element={
            user ? <Documents user={user} /> : <Navigate to="/documents" />
          }
        />
        <Route
          path="/settings"
          element={user ? <Settings user={user} /> : <Navigate to="/login" />}
        />
        <Route
          path="/users"
          element={user ? <Users user={user} /> : <Navigate to="/login" />}
        />
        <Route
          path="/create-noi"
          element={user ? <NOICreate user={user} /> : <Navigate to="/login" />}
        />
        <Route
          path="/favourites"
          element={user ? <Favourites user={user} /> : <Navigate to="/login" />}
        />
        <Route
          path="/"
          element={user ? <Navigate to="/home" /> : <Navigate to="/login" />}
        />
      </Routes>
    </Router>
  );
}

export default App;
