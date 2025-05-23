import { Link } from "react-router";

export default function NotFoundPage() {
  return (
    <main>
      <h2>404 - Page Not Found</h2>
      <p>Sorry, the page you’re looking for doesn’t exist.</p>
      <Link to="/" className="button">
        Go Back Home
      </Link>
    </main>
  );
}
