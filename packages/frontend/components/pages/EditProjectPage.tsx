import { useParams, useNavigate } from "react-router";
import { useState, useEffect, type FormEvent } from "react";
import moment from "moment";

interface IEditProjectPageProps {
  authToken: string | null;
}

export default function EditProjectPage(props: IEditProjectPageProps) {
  const { projectId } = useParams();
  const [editingProject, setEditingProject] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const navigate = useNavigate();

  // Form state
  const [name, setName] = useState<string>("");
  const [client, setClient] = useState<string>("");
  const [deadline, setDeadline] = useState<string>("");
  const [status, setStatus] = useState<string>("Not Started");
  const [sharedWith, setSharedWith] = useState<string>("");
  const [notes, setNotes] = useState<string>("");

  // Fetch project details and prefill form
  useEffect(() => {
    async function fetchProject() {
      if (!projectId || !props.authToken) return;
      setEditingProject(true);
      setErrorMessage(null);
      try {
        const response = await fetch(`/api/projects/${projectId}`, {
          headers: {
            Authorization: `Bearer ${props.authToken}`,
          },
        });
        if (!response.ok) throw new Error("Failed to fetch project.");
        const data = await response.json();
        const project = data.project;
        setName(project.name || "");
        setClient(project.client || "");
        setDeadline(project.deadline ? moment(project.deadline).format("YYYY-MM-DD") : "");
        setStatus(project.status || "Not Started");
        setSharedWith(project.sharedWith ? project.sharedWith.join(", ") : "");
        setNotes(project.notes || "");
      } catch (err: any) {
        setErrorMessage(err.message || "Error loading project.");
      } finally {
        setEditingProject(false);
      }
    }
    fetchProject();
    // eslint-disable-next-line
  }, [projectId, props.authToken]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setEditingProject(true);
    setErrorMessage(null);
    setStatusMessage("Attempting to update project...");
    setTimeout(editProject, Math.random() * 2500);
  }

  function editProject() {
    const sharedWithArray = sharedWith
      ? sharedWith.split(",").map(email => email.trim()).filter(email => email.length > 0)
      : [];
    const deadlineFormatted = moment(deadline).format("YYYY-MM-DD");
    fetch(`/api/projects/edit/${projectId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${props.authToken}`
      },
      body: JSON.stringify({
        name,
        client,
        deadline: deadlineFormatted,
        status,
        sharedWith: sharedWithArray,
        notes
      })
    })
      .then(async (response) => {
        if (response.ok) {
          setStatusMessage("Project updated successfully!");
          setErrorMessage(null);
          navigate(`/project-details/${projectId}`);
        } else {
          const data = await response.json();
          setErrorMessage(data.error || "Failed to update project.");
          setStatusMessage(null);
        }
      })
      .catch((err) => {
        setErrorMessage("Network error: " + err.message);
        setStatusMessage(null);
      })
      .finally(() => setEditingProject(false));
  }

  return (
    <main id="edit-project-main-container">
      <h2>Edit Project</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Project Name
          <input
            type="text"
            id="edit-project-name"
            placeholder="Retro Logo Design"
            required
            aria-label="Edit Project Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </label>
        <label>
          Client Name
          <input
            type="text"
            id="edit-client-name"
            placeholder="Client Inc."
            required
            aria-label="Edit Client Name"
            value={client}
            onChange={(e) => setClient(e.target.value)}
          />
        </label>
        <label>
          Deadline
          <input
            type="date"
            id="edit-deadline"
            required
            aria-label="Edit Deadline"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
          />
        </label>
        <label>
          Status
          <select
            id="edit-status"
            required
            aria-label="Edit Status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            disabled={editingProject}
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
            id="edit-shared-width"
            placeholder="client@email.com"
            aria-label="Edit Shared With"
            value={sharedWith}
            onChange={(e) => setSharedWith(e.target.value)}
            disabled={editingProject}
          />
        </label>
        <label>
          Notes
          <textarea
            id="edit-notes"
            placeholder="Notes..."
            aria-label="Edit Notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            disabled={editingProject}
          />
        </label>
        {(editingProject && statusMessage) ? (
          <div aria-live="polite" className="status-message">{statusMessage}</div>
        ) : (!editingProject && errorMessage) && (
          <div aria-live="polite" className="error-message">{errorMessage}</div>
        )}
        <button type="submit" className="button">Update Project</button>
      </form>
    </main>
  );
}