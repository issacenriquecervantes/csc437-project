export default interface IProjectDocument {
    _id: string;
    name: string;
    owner: string;
    sharedWith: string[];
    client: string;
    deadline: string;
    status: string;
    notes: string;
}