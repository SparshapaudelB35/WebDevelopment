import React, { useState, useEffect, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(null); // Start with null to prevent flashing login screen

  useEffect(() => {
    const loggedInStatus = localStorage.getItem("loggedIn") === "true";
    setIsLoggedIn(loggedInStatus);
  }, []);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const Mainpage = React.lazy(() => import("./component/public/Mainpage"));
  const Cart = React.lazy(() => import("./component/public/cart"));
  const Login = React.lazy(() => import("./component/public/login"));
  const Signup = React.lazy(() => import("./component/public/signup"));
  const Adminpage = React.lazy(() => import("./component/private/adminpage"));
  const Users = React.lazy(() => import("./component/private/users"));
  const Addbooks = React.lazy(() => import("./component/private/addbook"));
  const Updatebook = React.lazy(() => import("./component/private/updatebookpage"));

  if (isLoggedIn === null) return <div>Loading...</div>; // Prevents flash of login page on refresh

  return (
    <Router>
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path="/" element={<Navigate to="/Mainpage" replace />} />
          <Route path="/Mainpage" element={<Mainpage />} />
          <Route path="/login" element={<Login onLoginSuccess={handleLogin}/>} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/signup" element={<Signup />} />
          
          <Route path="/addbook" element={isLoggedIn ? <Addbooks /> : <Navigate to="/login" replace />}/>
          <Route path="/updatebook/:bookId" element={isLoggedIn ? <Updatebook /> : <Navigate to="/login" replace />} />

          <Route path="/users" element={isLoggedIn ? <Users /> : <Navigate to="/login" replace />} />
          
          <Route 
            path="/adminpage" 
            element={isLoggedIn ? <Adminpage /> : <Navigate to="/login" replace />} 
          />
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
