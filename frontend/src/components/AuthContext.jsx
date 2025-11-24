import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const email = localStorage.getItem("userEmail");
    const id = localStorage.getItem("userId");

    if (token && email && id) {
      setUser({ id: Number(id), email, token });
    }
  }, []);

  const login = (userData) => {

    localStorage.setItem("token", userData.token);
    localStorage.setItem("userEmail", userData.user.email);
    localStorage.setItem("userId", userData.user.id);

    setUser({
      id: userData.user.id,
      email: userData.user.email,
      token: userData.token
    });
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userId");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
