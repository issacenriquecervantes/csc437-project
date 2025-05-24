import { Link } from "react-router";
import { ProjectCard } from "../ProjectCard";
import { projects, type Project } from "../../src/projectsDatabase"

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

export default function DashboardPage() {
  
  return (
    <main className="dashboard-main-container">
      <h2>My Projects</h2>

      <Link to="/add-project" className="button">
        + Add New Project
      </Link>

      <div id="dashboard-projects-container">

        {loadProjects().filter(project => project.createdBy == "user@email.com").map((project) => <ProjectCard name={project.name} client={project.client} deadline={project.deadline} status={project.status} id={project.id} createdBy={project.createdBy} />)}

      </div>

      <h2>Shared with Me</h2>

      <div id="shared-with-me-projects-container">

        {loadProjects().filter(project => project.sharedWith.includes("user@email.com")).map((project) => <ProjectCard name={project.name} client={project.client} deadline={project.deadline} status={project.status} id={project.id} createdBy={project.createdBy} />)}

      </div>

    </main>
  );
}
