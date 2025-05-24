import { useParams, Link, useNavigate } from "react-router";
import { useEffect, useState } from "react";
import moment from "moment";
import NotFoundPage from "./NotFoundPage";
import { getProjectById, deleteProject } from "./DashboardPage";
import { type Project } from "../../src/projectsDatabase"

// to be replaced with real data fetching
function fetchProjectById(projectId: string) {
  return getProjectById(projectId)
}

export default function ProjectDetailsPage() {

  // gets project id from the URL
  const { projectId } = useParams();

  //initialize a useNavigate instance
  const navigate = useNavigate();

  const [project, setProject] = useState<Project | undefined>(undefined);
  const [loading, setLoading] = useState(true);

// if a project id is found in the URL, an attempt to fetch from the API is made, where the data is used to set Project and set Loading to false
  useEffect(() => {
    if (projectId) {
      setProject(fetchProjectById(projectId));
      setLoading(false);
    }
  }, [projectId]);

  const handleDelete = () => {
    // replace with actual deletion logic with API
    const confirmDelete = window.confirm("Are you sure you want to delete this project?");

    if (confirmDelete && projectId) {
      // simulate deletion then redirect
      deleteProject(projectId)
      navigate("/");
    }
  };

  if (loading) return <p>Loading project...</p>;
  if (!project || project === undefined) return <NotFoundPage />;

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
