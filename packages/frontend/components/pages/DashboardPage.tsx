import { Link } from "react-router";
import { ProjectCard } from "../ProjectCard";

export default function DashboardPage() {
  // Placeholder mock data
  const myProjects = [
    {
      id: "1",
      name: "Client Brochure",
      client: "Sunshine Corp",
      deadline: "2025-06-10",
      status: "In Progress",
      notes: "Waiting on logo assets",
      createdBy: "user@example.com",
      sharedWith: ["collab1@example.com"],
    },
    {
      id: "2",
      name: "Eco-Friendly Packaging",
      client: "Green Goods",
      deadline: "2025-07-01",
      status: "Not Started",
      notes: "Needs initial design concepts",
      createdBy: "user@example.com",
      sharedWith: [],
    },
    {
      id: "3",
      name: "Social Media Templates",
      client: "Fresh Start Wellness",
      deadline: "2025-08-15",
      status: "Awaiting Client Feedback",
      notes: "Sent initial drafts to client",
      createdBy: "user@example.com",
      sharedWith: ["designer2@example.com"],
    },
  ];

  const sharedProjects = [
    {
      id: "4",
      name: "Event Poster - Jazz Festival",
      client: "Local Arts Council",
      deadline: "2025-06-01",
      status: "Complete",
      notes: "Submitted and approved",
      createdBy: "designer@example.com",
      sharedWith: ["me@example.com"],
    },
    {
      id: "5",
      name: "Workshop Flyer - Creative Writing",
      client: "Community Library",
      deadline: "2025-06-15",
      status: "Complete",
      notes: "Client requested last-minute color changes",
      createdBy: "designer@example.com",
      sharedWith: ["me@example.com"],
    },
    {
      id: "6",
      name: "Open Mic Poster",
      client: "City Cultural Center",
      deadline: "2025-07-10",
      status: "In Progress",
      notes: "Illustrations still in progress",
      createdBy: "designer@example.com",
      sharedWith: ["me@example.com"],
    },

  ];

  return (
    <main className="dashboard-main-container">
      <h2>My Projects</h2>

      <Link to="/add-project" className="button">
        + Add New Project
      </Link>

      <div id="dashboard-projects-container">

        {myProjects.map((project) => (
          <ProjectCard name={project.name} client={project.client} deadline={project.deadline} status={project.status} id={project.id} createdBy={project.createdBy} />
        ))}

      </div>

      <h2>Shared with Me</h2>

      <div id="shared-with-me-projects-container">

        {sharedProjects.map((project) => (
          <ProjectCard name={project.name} client={project.client} deadline={project.deadline} status={project.status} id={project.id} createdBy={project.createdBy} />
        ))}

      </div>

    </main>
  );
}
