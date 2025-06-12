import { Collection, MongoClient, ObjectId } from "mongodb";
import type IProjectDocument from "../shared/IProjectDocument";

export class ProjectProvider {
    private projectsCollection: Collection<IProjectDocument>;
    private db: ReturnType<MongoClient['db']>;

    constructor(mongoClient: MongoClient) {
        const PROJECTS_COLLECTION = process.env.PROJECTS_COLLECTION_NAME;
        if (!PROJECTS_COLLECTION) {
            throw new Error("Missing PROJECTS_COLLECTION_NAME from environment variables");
        }
        this.db = mongoClient.db();
        this.projectsCollection = mongoClient.db().collection<IProjectDocument>(PROJECTS_COLLECTION);
    }

    async getUserProjects(userEmail: string): Promise<{
        ownedProjects: IProjectDocument[];
        sharedProjects: IProjectDocument[];
    }> {
        const ownedProjects = await this.projectsCollection
            .find({ owner: userEmail })
            .toArray();

        const sharedProjects = await this.projectsCollection
            .find({ sharedWith: userEmail })
            .toArray();

        return {
            ownedProjects,
            sharedProjects,
        };
    }

    async getProjectById(userEmail: string, projectId: string): Promise<{ project: IProjectDocument, owned: boolean } | boolean> {
        const { ownedProjects, sharedProjects } = await this.getUserProjects(userEmail);

        const inOwned = ownedProjects.find((project) => project._id.toString() === projectId)
        const inSharedWith = sharedProjects.find((project) => project._id.toString() === projectId)

        const project = inOwned !== undefined ? inOwned : inSharedWith

        if (project === undefined) {
            return false;
        }

        const owned = inOwned !== undefined;

        return { project, owned }
    }

    async deleteProjectById(userEmail: string, projectId: string): Promise<boolean> {
        const ownedProjects = (await this.getUserProjects(userEmail)).ownedProjects;

        const inOwned = ownedProjects.find((project) => project._id.toString() === projectId);

        if (!inOwned) {
            return false;
        }

        const result = await this.projectsCollection.deleteOne({ _id: projectId });
        return result.acknowledged && result.deletedCount === 1;
    }

    async addProject(newProject: Omit<IProjectDocument, "_id">): Promise<string | null> {
        try {
            const _id = new ObjectId().toString();
            const projectWithId = { ...newProject, _id };
            await this.projectsCollection.insertOne(projectWithId);
            return _id;
        } catch (err) {
            console.error("Failed to add project:", err);
            return null;
        }
    }

    async editProject(updatedProject: IProjectDocument): Promise<boolean> {
    try {
        // Convert _id to ObjectId if needed
        const filter = { _id: updatedProject._id };
        // Remove _id from update fields to avoid immutable field error
        const { _id, ...updateFields } = updatedProject;
        const result = await this.projectsCollection.updateOne(
            filter,
            { $set: updateFields }
        );
        return result.acknowledged && result.modifiedCount === 1;
    } catch (err) {
        console.error("Failed to edit project:", err);
        return false;
    }
}

}
