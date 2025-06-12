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
  owned: boolean;
}

export function ProjectCard(props: IProjectCardProps) {
  const formattedDeadline = moment(props.deadline).format("MMMM D, YYYY");

  return (
    <div className={`project-tile ${props.status.toLowerCase().split(" ").join("-")}`}>
      <h3>{props.name}</h3>
      <p className="project-tile-client">{props.client}</p>

      <dl className="project-tile-details">
        <div>
          <dt>Due:</dt> <dd>{formattedDeadline}</dd>
        </div>

        <div>
          <dt>Status:</dt> <dd>{props.status}</dd>
        </div>

        {props.owned ? (
          <div>
            {props.sharedWith && props.sharedWith.length > 0 && (
              <>
                <dt>Shared With:</dt> <dd>{props.sharedWith.join(", ")}</dd>
              </>
            )}
          </div>
        ) : (
          <div>
            <dt>Created By:</dt> <dd>{props.createdBy}</dd>
          </div>
        )}
      </dl>

      <Link to={`/project-details/${props.id}`} className="button">
        Open Project
      </Link>
    </div>
  );
}
