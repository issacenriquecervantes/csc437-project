import moment from "moment";
import { Link } from "react-router";

interface IProjectCardProps {
  id: string;
  name: string;
  client: string;
  deadline: string;
  status: string;
  createdBy?: string;
  sharedWith?: string[];
}

// Placeholder for the current user's email
const CURRENT_USER_EMAIL = "user@email.com";

export function ProjectCard({
  id,
  name,
  client,
  deadline,
  status,
  createdBy,
  sharedWith,
}: IProjectCardProps) {

  const isCreatedByUser = createdBy === CURRENT_USER_EMAIL;
  const formattedDeadline = moment(deadline).format("MMMM D, YYYY");

  return (
    <div className="project-tile">

      <h3>{name}</h3>
      <p className="project-tile-client">{client}</p>

      <dl className="project-tile-details">
        <div>
          <dt>Due:</dt>
          {" "}
          <dd>{formattedDeadline}</dd>
        </div>

        <div>
          <dt>Status:</dt>
          {" "}
          <dd>{status}</dd>
        </div>

        {isCreatedByUser ? (
          <div>
            <dt>Shared With:</dt>
            {" "}
            <dd>
              {sharedWith && sharedWith.length > 0
                ? sharedWith.join(", ")
                : "Not Shared"}
            </dd>
          </div>
        ) : (
          <div>
            <dt>Created By:</dt>
            {" "}
            <dd>{createdBy}</dd>
          </div>
        )}
      </dl>

      <Link to={`/project-details/${id}`} className="button">Open Project</Link>
    </div>
  );
}
