import { useState } from "react";
import { useNavigate } from "react-router";
import { type Project } from "../../src/projectsDatabase";
import { addProject } from "./DashboardPage";

export default function AddProjectPage() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [client, setClient] = useState("");
  const [deadline, setDeadline] = useState("");
  const [status, setStatus] = useState<'Not Started' | 'In Progress' | 'Completed' | 'On Hold'>("Not Started");
  const [sharedWith, setSharedWith] = useState("");
  const [notes, setNotes] = useState("");

  const handleSubmit = () => {

    const newProjectData: Project = {
      id: crypto.randomUUID(),
      name,
      client,
      deadline,
      status,
      notes,
      createdBy: "user@email.com",
      sharedWith: sharedWith
        .split(",")
        .map(email => email.trim())
        .filter(Boolean),
    };

    addProject(newProjectData);
    navigate(`/project-details/${newProjectData.id}`);
  };

  return (
    <main id="edit-project-main-container">
      <h2>Add Project</h2>

      <form onSubmit={handleSubmit}>
        <label>
          Project Name
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </label>

        <label>
          Client Name
          <input
            type="text"
            required
            value={client}
            onChange={(e) => setClient(e.target.value)}
          />
        </label>

        <label>
          Deadline
          <input
            type="date"
            required
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
          />
        </label>

        <label>
          Status
          <select
            required
            value={status}
            onChange={(e) =>
              setStatus(e.target.value as Project["status"])
            }
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
            value={sharedWith}
            onChange={(e) => setSharedWith(e.target.value)}
          />
        </label>

        <label>
          Notes
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </label>

        <button type="submit" className="button">Add Project</button>
      </form>
    </main>
  );
}
