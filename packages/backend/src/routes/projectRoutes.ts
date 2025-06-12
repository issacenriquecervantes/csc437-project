import express, { Request, response, Response } from "express";
import { ProjectProvider } from "../providers/ProjectProvider";
import { verifyAuthToken } from "../verifyAuthToken";
import { ObjectId } from "mongodb";
import IProjectDocument from "shared/IProjectDocument";

export function registerProjectRoutes(
    app: express.Application,
    projectProvider: ProjectProvider
) {
    // Route for getting all projects
    app.get(
        "/api/projects",
        verifyAuthToken,
        async (req: Request, res: Response) => {
            const email = req.user?.email;
            if (!email) {
                res.status(400).json({ error: "Email is missing from request." });
                return;
            }

            try {
                const projects = await projectProvider.getUserProjects(email);
                res.json(projects);
            } catch (err) {
                res.status(500).json({ error: "Failed to fetch projects." });
            }
        }
    );

    // Route for getting a specific project by ID
    app.get(
        "/api/projects/:id",
        verifyAuthToken,
        async (req: Request, res: Response) => {
            const projectId = req.params.id;
            const email = req.user?.email;
            const validId = ObjectId.isValid(projectId)

            if (!email) {
                res.status(400).json({ error: "Email is missing from request." });
                return;
            }

            if (!validId) {
                res.status(404).send({
                    error: "Not Found",
                    message: "Project does not exist. Invalid ObjectId."
                });
                return;
            }

            try {
                const project = await projectProvider.getProjectById(email, projectId);

                if (project) { res.json(project); }
                else {
                    res.status(404).send("Project not found in neither created nor shared projects.")
                }
            } catch (err) {
                res.status(500).json({
                    err: `Failed to fetch project with ID ${projectId}.`,
                });
            }
        }
    );


    // Route for deleting a specific project by ID
    app.delete(
        "/api/projects/delete/:id",
        verifyAuthToken,
        async (req: Request, res: Response) => {
            const projectId = req.params.id;
            const email = req.user?.email;
            const validId = ObjectId.isValid(projectId)

            if (!email) {
                res.status(400).json({ error: "Email is missing from request." });
                return;
            }

            if (!validId) {
                res.status(404).send({
                    error: "Not Found",
                    message: "Project does not exist. Invalid ObjectId."
                });
                return;
            }

            try {
                const deleted = await projectProvider.deleteProjectById(email, projectId);

                if (deleted) {
                    res.json({ message: "Project successfully deleted." });
                } else {
                    res.status(404).send("Project not found in created projects.");
                }
            } catch (err) {
                res.status(500).json({
                    err: `Failed to delete project with ID ${projectId}.`,
                });
            }
        }
    );

    app.post(
        "/api/projects/add/",
        verifyAuthToken,
        async (req: Request, res: Response) => {
            const email = req.user?.email;

            if (!email) {
                res.status(400).json({ error: "Email is missing from request." });
                return;
            }

            const {
                name,
                client,
                deadline,
                status,
                sharedWith,
                notes
            } = req.body;

            if (!name || !client || !deadline || !status) {
                res.status(400).json({ error: "Missing required project fields." });
                return;
            }

            try {
                // Build the new project document


                const newProject: Omit<IProjectDocument, "_id"> = {
                    name,
                    owner: email, // Always use the authenticated user's email as owner
                    // sharedWith: sharedWith.split(",").map((email: string) => email.trim()).filter((email: string) => email.length > 0) ? sharedWith : [],
                    sharedWith,
                    client,
                    deadline,
                    status,
                    notes: notes,
                };

                // Insert into the collection
                const resultId = await projectProvider.addProject(newProject);

                if (resultId !== null) {
                    res.status(201).json({ message: "Project added successfully.", id: resultId });
                } else {
                    res.status(500).json({ error: "Failed to add project." });
                }
            } catch (err) {
                res.status(500).json({ error: "Failed to add project.", details: err });
            }
        }
    );

    app.patch(
        "/api/projects/edit/:id",
        verifyAuthToken,
        async (req: Request, res: Response) => {
            const projectId = req.params.id;
            const email = req.user?.email;
            const validId = ObjectId.isValid(projectId);

            if (!email) {
                res.status(400).json({ error: "Email is missing from request." });
                return;
            }

            if (!validId) {
                res.status(404).send({
                    error: "Not Found",
                    message: "Project does not exist. Invalid ObjectId."
                });
                return;
            }

            const updates = req.body;

            try {

                const updated = await projectProvider.editProject({
                    ...updates,
                    _id: projectId,
                });

                if (updated) {
                    res.json({ message: "Project successfully updated." });
                } else {
                    res.status(404).send("Project not found or not owned by user.");
                }
            } catch (err) {
                res.status(500).json({
                    err: `Failed to update project with ID ${projectId}.`,
                });
            }
        }
    );

    
}
