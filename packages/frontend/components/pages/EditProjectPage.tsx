import { useParams, useNavigate } from "react-router";
import { useEffect, useState } from "react";
// import { type Project } from "../../src/projectsDatabase"
import moment from "moment";
import { getProjectById, updateProject } from "./DashboardPage";

// Mock fetch function
function fetchProjectById(projectId: string) {
  return getProjectById(projectId)
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
  const [status, setStatus] = useState<'Not Started' | 'In Progress' | 'Completed' | 'On Hold'>("Not Started");
  const [sharedWith, setSharedWith] = useState("");
  const [notes, setNotes] = useState("");
  const [createdBy, setCreatedBy] = useState("");

  useEffect(() => {
    if (projectId) {
      
      const retrievedProject = fetchProjectById(projectId);

      if (retrievedProject) {
        setName(retrievedProject.name);
        setClient(retrievedProject.client);
        setDeadline(moment(retrievedProject.deadline).format("YYYY-MM-DD"));
        setStatus(retrievedProject.status);
        setSharedWith(retrievedProject.sharedWith?.join(", ") || "");
        setNotes(retrievedProject.notes);
        setCreatedBy(retrievedProject.createdBy);
      }
    }
  }, [projectId]);

  const handleSubmit = async () => {

    if (!projectId) return;

    updateProject(
      projectId,
      {
        name,
        client,
        deadline,
        status,
        notes,
        sharedWith: sharedWith.split(",").map(email => email.trim()).filter(Boolean),
        createdBy
      }
    );

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
            onChange={(e) => setStatus(e.target.value as 'Not Started' | 'In Progress' | 'Completed' | 'On Hold')}
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
