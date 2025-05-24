import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router";
import Header from "../components/Header.tsx";

import LoginPage from "../components/pages/LoginPage.tsx";
import RegisterPage from "../components/pages/RegisterPage.tsx";
import DashboardPage from "../components/pages/DashboardPage.tsx";
import AddProjectPage from "../components/pages/AddProjectPage.tsx";
import ProjectDetailsPage from "../components/pages/ProjectDetailsPage.tsx";
import EditProjectPage from "../components/pages/EditProjectPage.tsx";
import NotFoundPage from "../components/pages/NotFoundPage.tsx";

// Replace this with real authentication logic
const loggedIn = true;

function App() {

    return (
        <Router>
            <Header />
            <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />

                <Route path="/" element={loggedIn ? <DashboardPage /> : <Navigate to="/login" replace />} />
                <Route path="/dashboard" element={loggedIn ? <DashboardPage /> : <Navigate to="/login" replace />} />
                <Route path="/add-project" element={loggedIn ? <AddProjectPage /> : <Navigate to="/login" replace />} />
                <Route path="/project-details/:projectId" element={loggedIn ? <ProjectDetailsPage /> : <Navigate to="/login" replace />} />
                <Route path="/edit/:projectId" element={loggedIn ? <EditProjectPage /> : <Navigate to="/login" replace />} />
                
                <Route path="*" element={<NotFoundPage />} />
            </Routes>
        </Router>
    );
}

export default App;
