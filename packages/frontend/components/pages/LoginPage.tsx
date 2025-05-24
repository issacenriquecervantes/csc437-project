import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router";

export default function LoginPage() {
  const navigate = useNavigate();

  // Controlled inputs state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {

    // For now, just log and navigate on submit
    console.log({ email, password }, event);
    // Add authentication logic here
    navigate("/dashboard");
  }

  return (
    <main id="login-main-container">
      <h2>Login</h2>
      <p>
        Don’t have an account? <Link to="/register">Register</Link>
      </p>
      <form onSubmit={handleSubmit}>
        <label htmlFor="login-email">
          Email
          <input
            id="login-email"
            type="email"
            required
            autoComplete="email"
            placeholder="alice@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>

        <label htmlFor="login-password">
          Password
          <input
            id="login-password"
            type="password"
            required
            autoComplete="current-password"
            placeholder="*****"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>

        <button type="submit" className="button">Log In</button>
      </form>
    </main>
  );
}
