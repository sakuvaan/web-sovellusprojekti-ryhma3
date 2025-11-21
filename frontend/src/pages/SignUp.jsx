import { useState, useContext } from "react";
import { AuthContext } from "../components/AuthContext";

const API_URL = "http://localhost:5050";

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const { login } = useContext(AuthContext);

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

        login({
          token: data.token,
          user: {
            id: data.user.id,
            email: data.user.email
          }
        });

        setMessage(`Account created for ${data.user.email}`);
      } else {
        setMessage(data.message || "Signup failed");
      }

    } catch (err) {
      setMessage(err.message);
    }
  };

  return (
    <div>
      <br /><br />
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

        <button type="submit">luo tili</button>
      </form>

      {message && <p>{message}</p>}
    </div>
  );
};

export default SignUp;