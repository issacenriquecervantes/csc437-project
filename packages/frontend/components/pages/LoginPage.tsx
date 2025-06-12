import { useId, useState, type FormEvent } from "react";
import { Link } from "react-router";

interface ILoginPageProps {
  onTokenGenerated: (generatedToken: string) => void;
}

export default function LoginPage(props: ILoginPageProps) {

  const [email, setEmail] = useState<string | null>(null);
  const [password, setPassword] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null)

  const [loginPending, setLoggingPending] = useState(false);

  const emailInputId = useId();
  const passInputId = useId();

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoggingPending(true);
    setErrorMessage(null)
    setStatusMessage("Attempting to log in user...")

    setTimeout(loginUser, Math.random() * 2000)

  }

  function loginUser() {
    fetch("/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email: email, password: password })
    }).then(async (response) => {
      if (response.ok) {
        console.log("Sucessfully logged in.")
        const token = await response.text();
        props.onTokenGenerated(token);
        setErrorMessage(null);
        setStatusMessage("Successfully logged into  account.")
      } else {
        if (response.status === 401) {
          setErrorMessage("There is no user registered with the given email and password pair.")
        }
        else {
          setErrorMessage("Failed to log in user. Please try again.")
        }
      }
    }).catch((err) => {
      setErrorMessage("Login failed. Please try again.")
      console.log(err)
      setLoggingPending(false)
    }).finally(() =>
      setLoggingPending(false))
  }

  return (
    <main id="login-main-container">
      <h2>Login</h2>
      <p>
        Don’t have an account? <Link to="/register">Register</Link>
      </p>
      <form onSubmit={handleSubmit}>
        <label htmlFor={emailInputId}>
          Email
          <input
            id={emailInputId}
            type="email"
            required
            autoComplete="email"
            placeholder="alice@email.com"
            value={email ? email : ""}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loginPending}
          />
        </label>

        <label htmlFor={passInputId}>
          Password
          <input
            id={passInputId}
            type="password"
            required
            autoComplete="current-password"
            placeholder="*****"
            value={password ? password : ""}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loginPending}
          />
        </label>

        {
          (loginPending && statusMessage) ? <div aria-live="polite" className="status-message">
            {statusMessage}
          </div> : (!loginPending && errorMessage) && <div aria-live="polite" className="error-message">
            {errorMessage}
          </div>
        }

        <button type="submit" className="button" disabled={loginPending}>Log In</button>
      </form>
    </main>
  );
}
