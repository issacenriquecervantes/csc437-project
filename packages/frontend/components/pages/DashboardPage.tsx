import { Link } from "react-router";
import { ProjectCard } from "../ProjectCard";
import { projects, type Project } from "../../src/projectsDatabase"
import type IProjectDocument from "../../../backend/src/shared/IProjectDocument";

const STORAGE_KEY = 'project_data';

if (!localStorage.getItem(STORAGE_KEY)) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
}

export const loadProjects = (): Project[] => {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
};

export const saveProjects = (projects: Project[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
};

export const addProject = (project: Project) => {
  const current = loadProjects();
  saveProjects([...current, project]);
};

export const getProjectById = (id: string): Project | undefined => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return undefined;

  const projects: Project[] = JSON.parse(stored);
  return projects.find(p => p.id === id);
};

export const updateProject = (id: string, updates: Partial<Project>) => {
  const current = loadProjects().map(p =>
    p.id === id ? { ...p, ...updates } : p
  );
  saveProjects(current);
};

export const deleteProject = (id: string) => {
  const current = loadProjects().filter(p => p.id !== id);
  saveProjects(current);
};

interface IDashboardPageProps {
  projects: { ownedProjects: IProjectDocument[], sharedProjects: IProjectDocument[] }
  fetchingProjects: boolean;
  errorFetchingProjects: boolean;
}

export default function DashboardPage(props: IDashboardPageProps) {

  console.log(props.projects)

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
