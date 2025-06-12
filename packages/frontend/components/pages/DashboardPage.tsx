import { Link } from "react-router";
import { ProjectCard } from "../ProjectCard";
import type IProjectDocument from "../../../backend/src/shared/IProjectDocument";


interface IDashboardPageProps {
  projects: { ownedProjects: IProjectDocument[], sharedProjects: IProjectDocument[] }
  fetchingProjects: boolean;
  errorFetchingProjects: boolean;
}

export default function DashboardPage(props: IDashboardPageProps) {

  return (
    <main className="dashboard-main-container">
      <h2>My Projects</h2>

      <Link to="/add-project" className="button">
        + Add New Project
      </Link>

      <div id="dashboard-projects-container">

        {(!props.fetchingProjects && !props.errorFetchingProjects) ? props.projects.ownedProjects.length !== 0 ? props.projects.ownedProjects.map((project) => <ProjectCard key={project._id} name={project.name} client={project.client} deadline={project.deadline} status={project.status} id={project._id} createdBy={project.owner} owned={true} sharedWith={project.sharedWith} />) : <h4 className="status-message">Projects you have created will be displayed here. Start by adding a new project.</h4> : props.fetchingProjects ? <h4 className="status-message">Loading...</h4> : <h4 className="error-message">Error Retrieving Projects</h4>}

      </div>

      <h2>Shared with Me</h2>

      <div id="shared-with-me-projects-container">

        {(!props.fetchingProjects && !props.errorFetchingProjects) ? props.projects.sharedProjects.length !== 0 ? props.projects.sharedProjects.map((project) => <ProjectCard key={project._id} name={project.name} client={project.client} deadline={project.deadline} status={project.status} id={project._id} createdBy={project.owner} owned={false}/>) : <h4 className="status-message">Projects that have been shared with you will be displayed here.</h4> : props.fetchingProjects ? <h4 className="status-message">Loading...</h4> : <h4 className="error-message">Error Retrieving Projects</h4>}

      </div>

    </main>
  );
}
