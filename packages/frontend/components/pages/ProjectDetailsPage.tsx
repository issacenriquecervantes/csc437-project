import { useParams, Link, useNavigate } from "react-router";
import { useEffect, useRef, useState } from "react";
import moment from "moment";
import NotFoundPage from "./NotFoundPage";
import type IProjectDocument from "../../../backend/src/shared/IProjectDocument";
import { waitDuration } from "../../src/App";


interface IProjectDetailsPageProps {
  authToken: string | null
  handleProjectDeleted: () => void;
}
export default function ProjectDetailsPage(props: IProjectDetailsPageProps) {

  const requestRef = useRef(0);

  const [project, setProject] = useState<IProjectDocument>();
  const [owned, setOwned] = useState(false);

  const [fetchingProject, setFetchingProject] = useState(false)
  const [errorFetchingProject, setErrorFetchingProject] = useState(false)

  const [deletingProject, setDeletingProject] = useState(false)

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null)

  async function fetchProjectFromAPI(authToken: string, projectId: string) {
    requestRef.current = requestRef.current + 1;
    let thisRequestRef = requestRef.current;

    setFetchingProject(true);
    await fetch(`/api/projects/${projectId}`, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    })
      .then(async (response) => {
        await waitDuration(Math.random() * 2500);
        return response;
      })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        if (requestRef.current === thisRequestRef) {
          setProject(data.project);
          setOwned(data.owned)
          setErrorFetchingProject(false);
        }
      })
      .catch(() => {
        requestRef.current === thisRequestRef && setErrorFetchingProject(true);
      })
      .finally(() => {
        requestRef.current === thisRequestRef && setFetchingProject(false);
      });
  }

  function deleteProject() {

    fetch(`/api/projects/delete/${projectId}`, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${props.authToken}`
      }
    })
      .then(async (response) => {
        if (response.ok) {
          setStatusMessage("Project delete successfully!");
          setErrorMessage(null);
          props.handleProjectDeleted()
          navigate("/dashboard")
        } else {
          const data = await response.json();
          setErrorMessage(data.error || "Failed to delete project.");
          setStatusMessage(null);
        }
      })
      .catch((err) => {
        setErrorMessage("Network error: " + err.message);
        setStatusMessage(null);
      })
      .finally(() => setDeletingProject(false));
  }


  // gets project id from the URL
  const { projectId } = useParams();

  //initialize a useNavigate instance
  const navigate = useNavigate();

  // if a project id is found in the URL, an attempt to fetch from the API is made, where the data is used to set Project and set Loading to false
  useEffect(() => {
    if (projectId && props.authToken) {
      fetchProjectFromAPI(props.authToken, projectId);
    }
  }, [projectId]);

  async function handleDelete() {
    const confirmDelete = window.confirm("Are you sure you want to delete this project?");

    if (confirmDelete && projectId) {
      setDeletingProject(true);
      setErrorMessage(null)
      setStatusMessage("Attempting to delete project...")

      setTimeout(deleteProject, Math.random() * 2500)
    }
  };

  if (fetchingProject) return <h2 className="status-message">Loading project...</h2>;
  if (errorFetchingProject && project === undefined) return <NotFoundPage />

  return (
    <main className="project-details-main-container">
      <h2>Project Details</h2>
      {project ? (
        <dl id="project-details">
          <dt>Project Name</dt>
          <dd>{project.name}</dd>

          <dt>Client Name</dt>
          <dd>{project.client}</dd>

          <dt>Deadline</dt>
          <dd>
            <time dateTime={moment(project.deadline).format("YYYY-MM-DD")}>
              {moment(project.deadline).format("MMMM Do, YYYY")}
            </time>
          </dd>

          <dt>Status</dt>
          <dd>{project.status}</dd>

          {owned &&

            <>
              <dt>Shared With</dt>
              <dd>{project.sharedWith?.length ? project.sharedWith.join(", ") : "Not Shared with Anyone"}</dd></>
          }

          <dt>Notes</dt>
          <dd>{project.notes === "" ? "No Notes Added" : project.notes}</dd>
        </dl>
      ) : null}

      {project && owned && (
        <>
          {
            (deletingProject && statusMessage) ? <div aria-live="polite" className="status-message">
              {statusMessage}
            </div> : (!deletingProject && errorMessage) && <div aria-live="polite" className="error-message">
              {errorMessage}
            </div>
          }
          <Link to={`/edit/${project._id}`} className="button">
            Edit
          </Link>
          <button onClick={handleDelete} className="button">
            Delete
          </button>
        </>
      )}
    </main>
  );
}
