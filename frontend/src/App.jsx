import React from "react";
import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Home from "./pages/Home";
import NowAiring from "./pages/NowAiring";
import Reviews from "./pages/Reviews";
import Groups from "./pages/Groups";
import Favorites from "./pages/Favorites";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import { AuthProvider } from "./components/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

const App = () => {
  return (
    <AuthProvider>
      <Header />
      <main style={{ padding: "2rem", textAlign: "center" }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/now-airing" element={<NowAiring />} />
          <Route path="/reviews/:id" element={<ProtectedRoute><Reviews /></ProtectedRoute>} />
          <Route path="/groups" element={<Groups />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
        </Routes>
      </main>
    </AuthProvider>
  );
};

export default App;