import { useParams, Link, useNavigate } from "react-router";
import { useEffect, useState } from "react";
import moment from "moment";
import NotFoundPage from "./NotFoundPage";

interface Project {
  id: string;
  name: string;
  client: string;
  deadline: string;
  status: string;
  notes: string;
  createdBy?: string;
  sharedWith?: string[];
}

// to be replaced with real data fetching
function fetchProjectById(projectId: string): Promise<Project> {
  return Promise.resolve({
    id: projectId,
    name: "Client Brochure",
    client: "Sunshine Corp",
    deadline: "2025-06-10",
    status: "In Progress",
    notes: "Waiting on logo assets",
    createdBy: "user@example.com",
    sharedWith: ["collab1@example.com", "collab2@example.com"],
  });
}

export default function ProjectDetailsPage() {

  // gets project id from the URL
  const { projectId } = useParams();

  //initialize a useNavigate instance
  const navigate = useNavigate();


  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);


// if a project id is found in the URL, an attempt to fetch from the API is made, where the data is used to set Project and set Loading to false
  useEffect(() => {
    if (projectId) {
      fetchProjectById(projectId).then((data) => {
        setProject(data);
        setLoading(false);
      });
    }
  }, [projectId]);

  const handleDelete = () => {
    // replace with actual deletion logic with API
    const confirmDelete = window.confirm("Are you sure you want to delete this project?");

    if (confirmDelete) {
      // simulate deletion then redirect
      console.log(`Deleted project: ${projectId}`);
      navigate("/");
    }
  };

  if (loading) return <p>Loading project...</p>;
  if (!project) return <NotFoundPage />;

  //deconstructs project
  const { name, client, deadline, status, notes, sharedWith } = project;

  return (
    <main className="project-details-main-container">
      <h2>Project Details</h2>
      <dl id="project-details">
        <dt>Project Name</dt>
        <dd>{name}</dd>

        <dt>Client Name</dt>
        <dd>{client}</dd>

        <dt>Deadline</dt>
        <dd>
          <time dateTime={moment(deadline).format("YYYY-MM-DD")}>
            {moment(deadline).format("MMMM Do, YYYY")}
          </time>
        </dd>

        <dt>Status</dt>
        <dd>{status}</dd>

        <dt>Shared With</dt>
        <dd>{sharedWith?.length ? sharedWith.join(", ") : "Not Shared with Anyone"}</dd>

        <dt>Notes</dt>
        <dd>{notes}</dd>
      </dl>

        <Link to={`/edit/${project.id}`} className="button">
          Edit
        </Link>
        <button onClick={handleDelete} className="button">
          Delete
        </button>
    </main>
  );
}
