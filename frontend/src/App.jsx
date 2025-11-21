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
import Settings from "./pages/Settings";
import Profile from "./pages/Profile";
import { AuthProvider } from "./components/AuthContext";

const App = () => {
  return (
    <AuthProvider>
      <Header />
      <main style={{ padding: "2rem" }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/now-airing" element={<NowAiring />} />
          <Route path="/reviews" element={<Reviews />} />
          <Route path="/groups" element={<Groups />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/profiles/:id" element={<Profile />} />
        </Routes>
      </main>
    </AuthProvider>
  );
};

export default App;