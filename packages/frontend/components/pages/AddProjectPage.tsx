import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router";

interface IAddProjectPageProps {
  authToken: string | null;
  handleNewProjectAdded: () => void;
}

export default function AddProjectPage(props: IAddProjectPageProps) {

  const [name, setName] = useState<string | null>(null);
  const [client, setClient] = useState<string | null>(null);
  const [deadline, setDeadline] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>("Not Started");
  const [sharedWith, setSharedWith] = useState<string | null>(null);
  const [notes, setNotes] = useState<string | null>(null)

  const [addingProject, setAddingProject] = useState(false)

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null)

  const navigate = useNavigate()

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setAddingProject(true);
    setErrorMessage(null)
    setStatusMessage("Attempting to add project...")

    setTimeout(addProject, Math.random() * 2500)
  }

  function addProject() {
    const sharedWithArray = sharedWith
      ? sharedWith.split(",").map(email => email.trim()).filter(email => email.length > 0)
      : [];

    fetch("/api/projects/add/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${props.authToken}`
      },
      body: JSON.stringify({
        name,
        client,
        deadline,
        status,
        sharedWith: sharedWithArray,
        notes
      })
    })
      .then(async (response) => {
        if (response.ok) {
          setStatusMessage("Project added successfully!");
          setErrorMessage(null);
          props.handleNewProjectAdded()
          navigate("/dashboard")
        } else {
          const data = await response.json();
          setErrorMessage(data.error || "Failed to add project.");
          setStatusMessage(null);
        }
      })
      .catch((err) => {
        setErrorMessage("Network error: " + err.message);
        setStatusMessage(null);
      })
      .finally(() => setAddingProject(false));
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  function validateSharedWith(input: string): boolean {
    if (!input.trim()) return true; // allow empty
    return input
      .split(",")
      .map(email => email.trim())
      .every(email => emailRegex.test(email));
  }

  return (
    <main id="edit-project-main-container">
      <h2>Add Project</h2>

      <form onSubmit={handleSubmit}>
        <label>
          Project Name
          <input
            type="text"
            required
            value={name ? name : ""}
            onChange={(e) => setName(e.target.value)}
          />
        </label>

        <label>
          Client Name
          <input
            type="text"
            required
            value={client ? client : ""}
            onChange={(e) => setClient(e.target.value)}
          />
        </label>

        <label>
          Deadline
          <input
            type="date"
            required
            value={deadline ? deadline : ""}
            onChange={(e) => setDeadline(e.target.value)}
          />
        </label>

        <label>
          Status
          <select
            required
            value={status ? status : undefined}
            onChange={(e) =>
              setStatus(e.target.value)
            }
            disabled={addingProject}
          >
            <option value="Not Started">Not Started</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
            <option value="On Hold">On Hold</option>
          </select>
        </label>

        <label>
          Shared With (comma-separated)
          <input
            type="text"
            value={sharedWith ? sharedWith : ""}
            onChange={(e) => {
              setSharedWith(e.target.value);
              if (!validateSharedWith(e.target.value)) {
                e.target.setCustomValidity("Please enter valid email(s), separated by commas.");
                e.target.reportValidity();
              } else {
                e.target.setCustomValidity("");
              }
            }}
            disabled={addingProject}
          />
        </label>

        <label>
          Notes
          <textarea
            value={notes ? notes : ""}
            onChange={(e) => setNotes(e.target.value)}
            disabled={addingProject}
          />
        </label>

        {
          (addingProject && statusMessage) ? <div aria-live="polite" className="status-message">
            {statusMessage}
          </div> : (!addingProject && errorMessage) && <div aria-live="polite" className="error-message">
            {errorMessage}
          </div>
        }

        <button type="submit" className="button" disabled={addingProject}>Add Project</button>
      </form>
    </main>
  );
}
