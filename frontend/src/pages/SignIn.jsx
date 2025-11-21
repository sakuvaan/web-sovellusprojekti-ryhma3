import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../components/AuthContext";
import '../css/SignIn.css';

const API_URL = "http://localhost:5050";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userEmail = localStorage.getItem("userEmail");
    if (token && userEmail) {
      setMessage(`Logged in as ${userEmail}`);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch(`${API_URL}/api/auth/signin`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (res.ok) {
      login({ email: data.user.email, token: data.token });

      navigate("/");
    } else {
      setMessage(data.message || "Login failed");
    }
  };

  return (
    <div className="signIn-page">
      <div className="signIn-form">
        <form onSubmit={handleSubmit}>
          <div>
            <label>Email: </label>
            <input
              className="signIn-input"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Password: </label>
            <input
              className="signIn-input"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit">Sign In</button>
        </form>
        <a href="../signup">Not a member? Sign Up</a>
        {message && <p>{message}</p>}
      </div>
    </div>
  );
};

export default SignIn;