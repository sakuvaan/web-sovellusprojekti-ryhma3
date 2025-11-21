import { useState } from "react";
import '../css/SignUp.css';

const API_URL = "http://localhost:5050";

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/api/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("token", data.token);
        setMessage(`Account created for ${data.user.email}`);
      } else {
        setMessage(data.message || "Signup failed");
      }
    } catch (err) {
      setMessage(err.message);
    }
  };

  return (
    <div className="signUp-page">
      <div className="signUp-form">
        <form onSubmit={handleSubmit}>
          <div>
            <label>Email: </label>
            <input
              className="signUp-input"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Password: </label>
            <input
              className="signUp-input"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit">Sign Up</button>
        </form>
        <a href="../signin">Already have an account?</a>
        {message && <p>{message}</p>}
      </div>
    </div>
  );
};

export default SignUp;