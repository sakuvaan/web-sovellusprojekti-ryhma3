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
import FavoriteDetail from "./pages/FavoriteDetail";
import Search from './pages/Search'
import GroupPage from "./pages/GroupPage";
import { AuthProvider } from "./components/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

const App = () => {
  return (
    <AuthProvider>
      <Header />
      <main style={{ padding: "2rem" }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/now-airing" element={<NowAiring />} />
          <Route path="/reviews/:id" element={<Reviews />} />
          <Route path="/groups" element={<ProtectedRoute><Groups /></ProtectedRoute>} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/search" element={<Search />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/favorites/:id" element={<FavoriteDetail />} />
          <Route path="/groups/:id" element={<ProtectedRoute><GroupPage /></ProtectedRoute>} />
        </Routes>
      </main>
    </AuthProvider>
  );
};

export default App;