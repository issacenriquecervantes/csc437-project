import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router";

export default function RegisterPage() {
  const navigate = useNavigate();

  // Controlled inputs state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {

    // For now, just log and navigate on submit
    console.log({ email, password, confirmPassword }, event);
    // Add authentication logic here
    navigate("/dashboard");
  }

  return (
    <main id="register-main-container">
      <h2>Register</h2>
      <p>
        Already have an account? <Link to="/login">Login</Link>
      </p>
      <form onSubmit={handleSubmit}>
        <label htmlFor="register-email">
          Email
          <input
            id="register-email"
            type="email"
            required
            autoComplete="email"
            placeholder="alice@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>

        <label htmlFor="register-password">
          Password
          <input
            id="register-password"
            type="password"
            required
            autoComplete="current-password"
            placeholder="*****"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>

        <label htmlFor="register-confirm-password">
          Confirm Password
          <input
            id="register-confirm-password"
            type="password"
            required
            autoComplete="current-password"
            placeholder="*****"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </label>

        <button type="submit" className="button">Register</button>
      </form>
    </main>
  );
}
