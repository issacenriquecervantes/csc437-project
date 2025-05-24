export interface Project {
  id: string;
  name: string;
  client: string;
  deadline: string;
  status: 'Not Started' | 'In Progress' | 'Completed' | 'On Hold';
  notes: string;
  createdBy: string;
  sharedWith: string[];
}

export const projects: Project[] = [
  {
    id: "1",
    name: "Client Brochure",
    client: "Sunshine Corp",
    deadline: "2025-06-10",
    status: "In Progress",
    notes: "Waiting on logo assets",
    createdBy: "user@email.com",
    sharedWith: ["collab1@example.com"],
  },
  {
    id: "2",
    name: "Eco-Friendly Packaging",
    client: "Green Goods",
    deadline: "2025-07-01",
    status: "Not Started",
    notes: "Needs initial design concepts",
    createdBy: "user@email.com",
    sharedWith: [],
  },
  {
    id: "3",
    name: "Social Media Templates",
    client: "Fresh Start Wellness",
    deadline: "2025-08-15",
    status: "On Hold",
    notes: "Sent initial drafts to client",
    createdBy: "user@email.com",
    sharedWith: ["designer2@example.com"],
  },
  {
    id: "4",
    name: "Event Poster - Jazz Festival",
    client: "Local Arts Council",
    deadline: "2025-06-01",
    status: "Completed",
    notes: "Submitted and approved",
    createdBy: "designer@example.com",
    sharedWith: ["me@example.com", "user@email.com"],
  },
  {
    id: "5",
    name: "Workshop Flyer - Creative Writing",
    client: "Community Library",
    deadline: "2025-06-15",
    status: "Completed",
    notes: "Client requested last-minute color changes",
    createdBy: "designer@example.com",
    sharedWith: ["me@example.com", "user@email.com"],
  },
  {
    id: "6",
    name: "Open Mic Poster",
    client: "City Cultural Center",
    deadline: "2025-07-10",
    status: "In Progress",
    notes: "Illustrations still in progress",
    createdBy: "designer@example.com",
    sharedWith: ["me@example.com", "user@email.com"],
  }
];
