import { useParams, useNavigate } from "react-router";
import { useEffect, useState } from "react";
import moment from "moment";

interface Project {
  id: string;
  name: string;
  client: string;
  deadline: string;
  status: string;
  notes: string;
  sharedWith?: string[];
}

// Mock fetch function
function fetchProjectById(projectId: string): Promise<Project> {
  return Promise.resolve({
    id: projectId,
    name: "Big Brand Redesign",
    client: "Super Big Client",
    deadline: "2025-04-20",
    status: "not-started",
    notes: "These are some notes on this big brand redesign...",
    sharedWith: ["client@email.com"],
  });
}

// Mock update function
function updateProject(updatedProject: Project): Promise<void> {
  console.log("Updating project:", updatedProject);
  return Promise.resolve();
}

export default function EditProjectPage() {
  //retrieves the project id from the URL
  const { projectId } = useParams();

  //initializes an instance of useNavigate
  const navigate = useNavigate();

  // Form state
  const [name, setName] = useState("");
  const [client, setClient] = useState("");
  const [deadline, setDeadline] = useState("");
  const [status, setStatus] = useState("not-started");
  const [sharedWith, setSharedWith] = useState("");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    if (projectId) {
      fetchProjectById(projectId).then((project) => {
        setName(project.name);
        setClient(project.client);
        setDeadline(moment(project.deadline).format("YYYY-MM-DD"));
        setStatus(project.status);
        setSharedWith(project.sharedWith?.join(", ") || "");
        setNotes(project.notes);
      });
    }
  }, [projectId]);

  const handleSubmit = async () => {
    
    if (!projectId) return;

    await updateProject({
      id: projectId,
      name,
      client,
      deadline,
      status,
      notes,
      sharedWith: sharedWith.split(",").map(email => email.trim()).filter(Boolean),
    });

    navigate(`/project-details/${projectId}`);
  };

  return (
    <main id="edit-project-main-container">
      <h2>Edit Project</h2>

      <form onSubmit={handleSubmit}>
        <label>
          Project Name
          <input
            type="text"
            id="edit-project-name"
            placeholder="Big Brand Redesign"
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
            placeholder="Super Big Client"
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
          >
            <option value="not-started">Not Started</option>
            <option value="in-progress">In Progress</option>
            <option value="awaiting-client-feedback">Awaiting Client Feedback</option>
            <option value="complete">Complete</option>
          </select>
        </label>

        <label>
          Shared With
          <input
            type="email"
            id="edit-shared-width"
            placeholder="client@email.com"
            aria-label="Edit Shared With"
            value={sharedWith}
            onChange={(e) => setSharedWith(e.target.value)}
          />
        </label>

        <label>
          Notes
          <textarea
            id="edit-notes"
            placeholder="These are some notes on this big brand redesign..."
            aria-label="Edit Notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </label>

        <button type="submit" className="button">Update Project</button>
      </form>
    </main>
  );
}
