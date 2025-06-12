import { useId, useRef, useState, type FormEvent } from "react";
import { Link } from "react-router";

interface IRegisterPageProps {
  onTokenGenerated: (generatedToken: string) => void;
}

export default function RegisterPage(props: IRegisterPageProps) {

  const [email, setEmail] = useState<string | null>(null);
  const [password, setPassword] = useState<string | null>(null);
  const [confirmPassword, setConfirmPassword] = useState<string | null>(null);

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null)

  const [registrationPending, setRegistrationPending] = useState(false);

  const emailInputId = useId();
  const passInputId = useId();
  const confirmPassInputId = useId();
  const confirmPassRef = useRef<HTMLInputElement>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setRegistrationPending(true);
    setErrorMessage(null)
    setStatusMessage("Attempting to register new account...")

    setTimeout(registerUser, Math.random() * 2000)
  }

  function registerUser() {
    fetch("/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email: email, password: password })
    }).then(async (response) => {
      if (response.ok) {
        console.log("Successfully created account.");
        const token = await response.text();
        props.onTokenGenerated(token);
        setErrorMessage(null);
        setStatusMessage("Successfully registered new account.")
      } else {
        if (response.status === 409) {
          setErrorMessage("Email is already registered. Try again with a different email.");
        }
        else if (response.status === 400) {
          setErrorMessage("Missing email or password.");
        }
        else {
          setErrorMessage("Failed to register user. Please try again.");
        }
      }
    }).catch((err) => {
      setErrorMessage("Registration failed. Please try again.");
      console.log(err)
      setRegistrationPending(false);
    }).finally(() =>
      setRegistrationPending(false))
  }

  return (
    <main id="register-main-container">
      <h2>Register</h2>
      <p>
        Already have an account? <Link to="/login">Login</Link>
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
            disabled={registrationPending}
          />
        </label>

        <label htmlFor={passInputId}>
          Password
          <input
            id={passInputId}
            type="password"
            required
            autoComplete="new-password"
            placeholder="*****"
            value={password ? password : ""}
            onChange={(e) => setPassword(e.target.value)}
            disabled={registrationPending}
          />
        </label>

        <label htmlFor={confirmPassInputId}>
          Confirm Password
          <input
            id={confirmPassInputId}
            type="password"
            required
            autoComplete="new-password"
            placeholder="*****"
            value={confirmPassword ? confirmPassword : ""}
            ref={confirmPassRef}
            onChange={(e) => {
              setConfirmPassword(e.target.value);
              if (password !== e.target.value) {
                e.target.setCustomValidity("Passwords do not match.");
                e.target.reportValidity();
                return;
              } else {
                e.target.setCustomValidity("");
              }
            }
            }
            disabled={registrationPending}
          />
        </label>
        {
          (registrationPending && statusMessage) ? <div aria-live="polite" className="status-message">
            {statusMessage}
          </div> : (!registrationPending && errorMessage) && <div aria-live="polite" className="error-message">
            {errorMessage}
          </div>
        }
        <button type="submit" className="button" disabled={registrationPending}>Register Account</button>
      </form>
    </main>
  );
}