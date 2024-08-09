import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
  useLocation,
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
import Favourites from "./views/components/Favorites";
import NOIMap from "./views/components/NOIMap";
import Documents from "./views/components/Documents";
import BugReportFAB from "./views/components/BugReportFAB";

// Component to track and store the last visited path
const LocationWatcher = ({ children }) => {
  const location = useLocation();

  useEffect(() => {
    if (location.pathname !== "/" && location.pathname !== "/login") {
      localStorage.setItem("lastVisitedPath", location.pathname);
    }
  }, [location]);

  return <>{children}</>;
};

// Component to render BugReportFAB based on the current route
const RouteGuard = ({ user }) => {
  const location = useLocation();
  const isMapRoute = location.pathname === "/noimap";

  return <>{user && !isMapRoute && <BugReportFAB />}</>;
};

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(setUser);
    return () => unsubscribe();
  }, []);

  const getDefaultPath = () => {
    const lastVisitedPath = localStorage.getItem("lastVisitedPath");
    return user ? lastVisitedPath || "/home" : "/login";
  };

  return (
    <Router>
      <LocationWatcher>
        <Routes>
          <Route
            path="/login"
            element={!user ? <Login /> : <Navigate to={getDefaultPath()} />}
          />
          <Route
            path="/dashboard"
            element={
              user ? <Dashboard user={user} /> : <Navigate to="/login" />
            }
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
            element={
              user ? <NOIDetails user={user} /> : <Navigate to="/login" />
            }
          />
          <Route
            path="/noimap"
            element={user ? <NOIMap user={user} /> : <Navigate to="/login" />}
          />
          <Route
            path="/reporting"
            element={
              user ? <Reporting user={user} /> : <Navigate to="/login" />
            }
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
              user ? <Documents user={user} /> : <Navigate to="/login" />
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
            element={
              user ? <NOICreate user={user} /> : <Navigate to="/login" />
            }
          />
          <Route
            path="/favourites"
            element={
              user ? <Favourites user={user} /> : <Navigate to="/login" />
            }
          />
          <Route path="/" element={<Navigate to={getDefaultPath()} />} />
        </Routes>
        <RouteGuard user={user} />
      </LocationWatcher>
    </Router>
  );
}

export default App;
  