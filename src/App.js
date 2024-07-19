import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { auth } from "./firebase/firebase";
import Login from "./views/Login";
import Dashboard from "./views/Dashboard"; // Create this component for authenticated users

function App() {
  const [user, setUser] = React.useState(null);

  React.useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(setUser);
    return () => unsubscribe();
  }, []);

  return (
    <Router>
      <Routes>
        {!user ? (
          <Route path="/" element={<Login />} />
        ) : (
          <Route path="/" element={<Dashboard user={user} />} />
        )}
      </Routes>
    </Router>
  );
}

export default App;
