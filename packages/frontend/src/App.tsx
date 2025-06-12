import { Routes, Route, useNavigate } from "react-router";

import Header from "../components/Header.tsx";
import LoginPage from "../components/pages/LoginPage.tsx";
import RegisterPage from "../components/pages/RegisterPage.tsx";
import DashboardPage from "../components/pages/DashboardPage.tsx";
import AddProjectPage from "../components/pages/AddProjectPage.tsx";
import ProjectDetailsPage from "../components/pages/ProjectDetailsPage.tsx";
import EditProjectPage from "../components/pages/EditProjectPage.tsx";
import NotFoundPage from "../components/pages/NotFoundPage.tsx";
import ProtectedRoute from "../../backend/src/routes/ProtectedRoute.tsx";
import type IProjectDocument from "../../backend/src/shared/IProjectDocument.ts";

import { useRef, useState } from "react";

export function waitDuration(numMs: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, numMs));
}

function App() {
  const [authToken, setAuthToken] = useState<string | null>(null);
  const navigate = useNavigate();

  const requestRef = useRef(0);

  const [projects, setProjects] = useState<{
    ownedProjects: IProjectDocument[];
    sharedProjects: IProjectDocument[];
  }>({ ownedProjects: [], sharedProjects: [] });

  const [fetchingProjects, setFetchingProjects] = useState(false);
  const [errorFetchingProjects, setErrorFetchingProjects] = useState(false);

  async function handleGeneratedToken(generatedToken: string) {
    setAuthToken(generatedToken);
    fetchProjectsFromAPI(generatedToken);
    navigate("/");
  }

  async function fetchProjectsFromAPI(authToken: string) {

    requestRef.current = requestRef.current + 1;
    let thisRequestRef = requestRef.current;

    setFetchingProjects(true);
    await fetch("/api/projects", {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    })
      .then(async (response) => {
        await waitDuration(Math.random() * 2500);
        return response;
      })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        if (requestRef.current === thisRequestRef) {
          setProjects(data);
          setErrorFetchingProjects(false);
        }
      })
      .catch(() => {
        requestRef.current === thisRequestRef && setErrorFetchingProjects(true);
      })
      .finally(() => {
        requestRef.current === thisRequestRef && setFetchingProjects(false);
      });
  }


  return (
    <>
      <Header handleDashboardReload={() => {
                    if (authToken) {
                      fetchProjectsFromAPI(authToken);
                    }
                  }} />
      <Routes>
        <Route
          path="/login"
          element={<LoginPage onTokenGenerated={handleGeneratedToken} />}
        />
        <Route
          path="/register"
          element={<RegisterPage onTokenGenerated={handleGeneratedToken} />}
        />
        <Route
          path="/"
          element={
            <ProtectedRoute
              authToken={authToken}
              children={
                <DashboardPage
                  projects={projects}
                  fetchingProjects={fetchingProjects}
                  errorFetchingProjects={errorFetchingProjects}
                />
              }
            />
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute
              authToken={authToken}
              children={
                <DashboardPage
                  projects={projects}
                  fetchingProjects={fetchingProjects}
                  errorFetchingProjects={errorFetchingProjects}
                />
              }
            />
          }
        />
        <Route
          path="/add-project"
          element={
            <ProtectedRoute
              authToken={authToken}
              children={
                <AddProjectPage
                  authToken={authToken}
                  handleNewProjectAdded={() => {
                    if (authToken) {
                      fetchProjectsFromAPI(authToken);
                    }
                  }}
                />
              }

            >
            </ProtectedRoute>
          }
        />
        <Route
          path="/project-details/:projectId"
          element={
            <ProtectedRoute
              authToken={authToken}
              children={<ProjectDetailsPage authToken={authToken} handleProjectDeleted={() => {
                    if (authToken) {
                      fetchProjectsFromAPI(authToken);
                    }
                  }} />}
            ></ProtectedRoute>
          }
        />
        <Route
          path="/edit/:projectId"
          element={
            <ProtectedRoute
              authToken={authToken}
              children={<EditProjectPage authToken={authToken}/>}
            />
          }
        />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </>
  );
}

export default App;
