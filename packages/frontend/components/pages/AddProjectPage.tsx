import { useState } from "react";
import { useNavigate } from "react-router";

interface Project {
  id: string;
  name: string;
  client: string;
  deadline: string;
  status: string;
  notes: string;
  sharedWith?: string[];
}

// Mock create function
function createProject(newProject: Omit<Project, "id">): Promise<Project> {
  // Simulate API that returns created project with new id
  const createdProject = { id: "new-id-123", ...newProject };
  console.log("Creating project:", createdProject);
  return Promise.resolve(createdProject);
}

export default function AddProjectPage() {
  const navigate = useNavigate();

  // Form state
  const [name, setName] = useState("");
  const [client, setClient] = useState("");
  const [deadline, setDeadline] = useState("");
  const [status, setStatus] = useState("not-started");
  const [sharedWith, setSharedWith] = useState("");
  const [notes, setNotes] = useState("");

  const handleSubmit = async () => {

    const newProjectData = {
      name,
      client,
      deadline,
      status,
      notes,
      sharedWith: sharedWith.split(",").map(email => email.trim()).filter(Boolean),
    };

    const createdProject = await createProject(newProjectData);

    navigate(`/project-details/${createdProject.id}`);
  };

  return (
    <main id="edit-project-main-container">
      <h2>Add Project</h2>

      <form onSubmit={handleSubmit}>
        <label>
          Project Name
          <input
            type="text"
            id="add-project-name"
            placeholder="Big Brand Redesign"
            required
            aria-label="Project Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </label>

        <label>
          Client Name
          <input
            type="text"
            id="add-client-name"
            placeholder="Super Big Client"
            required
            aria-label="Client Name"
            value={client}
            onChange={(e) => setClient(e.target.value)}
          />
        </label>

        <label>
          Deadline
          <input
            type="date"
            id="add-deadline"
            required
            aria-label="Deadline"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
          />
        </label>

        <label>
          Status
          <select
            id="add-status"
            required
            aria-label="Status"
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
            type="text"
            id="add-shared-with"
            placeholder="client@email.com"
            aria-label="Shared With"
            value={sharedWith}
            onChange={(e) => setSharedWith(e.target.value)}
          />
        </label>

        <label>
          Notes
          <textarea
            id="add-notes"
            placeholder="These are some notes on this big brand redesign..."
            aria-label="Notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </label>

        <button type="submit" className="button">Add Project</button>
      </form>
    </main>
  );
}
