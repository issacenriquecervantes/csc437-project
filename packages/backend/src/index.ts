import express, { Request, Response } from "express";
import dotenv from "dotenv";
import { connectMongo } from "./database/connectMongo";
import { registerAuthRoutes } from "./routes/authRoutes";
import { registerProjectRoutes } from "./routes/projectRoutes";
import { CredentialsProvider } from "./providers/CredentialsProvider";
import { ProjectProvider } from "./providers/ProjectProvider";

dotenv.config(); // Read the .env file in the current working directory, and load values into process.env.
const mongoClient = connectMongo();

const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET;

const app = express();

app.use(express.json());

app.locals.JWT_SECRET = JWT_SECRET;

registerProjectRoutes(app, new ProjectProvider(mongoClient));
registerAuthRoutes(app, new CredentialsProvider(mongoClient));

// Serve static frontend files
import path from "path";
app.use(express.static(path.join(__dirname, "../../frontend/dist")));
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../../frontend/dist/index.html"));
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
