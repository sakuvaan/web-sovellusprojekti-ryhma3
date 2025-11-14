import { useState, useEffect } from "react";

const API_URL = "http://localhost:5050";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userEmail = localStorage.getItem("userEmail");
    if (token && userEmail) {
      setMessage(`Logged in as ${userEmail}`);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/api/auth/signin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (res.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("userEmail", data.user.email);
        setMessage(`Logged in as ${data.user.email}`);
      } else {
        setMessage(data.message || "Login failed");
      }
    } catch (err) {
      setMessage(err.message);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userEmail");
    setMessage("Logged out");
    setEmail("");
    setPassword("");
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div>
          <label>email: </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>pass: </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">sisää</button>
      </form>

      <button onClick={handleLogout} style={{ marginTop: "10px" }}>
        Logout
      </button>

      {message && <p>{message}</p>}
    </div>
  );
};

export default SignIn;