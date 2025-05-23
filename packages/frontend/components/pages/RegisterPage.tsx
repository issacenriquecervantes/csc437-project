import type { FormEvent } from "react";
import { Link } from "react-router";

export default function RegisterPage() {

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    console.log(event)

    // const form = event.currentTarget;
    // const formData = new FormData(form);
    // const email = formData.get("email")?.toString() || "";
    // const password = formData.get("password")?.toString() || "";
    // const confirm = formData.get("confirm")?.toString() || "";

    // if (password !== confirm) {
    //   alert("Passwords do not match.");
    //   return;
    // }

    // // Simulate registration
    // console.log({ email, password });

    // // TODO: Replace with registration logic
  }

  return (
    <main id="register-main-container">
      <h2>Register</h2>
      <p>
        Already have an account? <Link to="/login">Log In</Link>
      </p>
      <form onSubmit={handleSubmit}>
        <label>Email<input id="email" type="email" required autoComplete="email" placeholder="alice@email.com" /></label>

        <label>Password<input id="password" type="password" required autoComplete="new-password" placeholder="*****"/>
        </label>

        <label>Confirm Password<input id="confirm" name="confirm" required placeholder="*****"/>
        </label>

        <button type="submit">Register</button>
      </form>

    </main>
  );
}
