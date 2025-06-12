import React from "react";
import { Navigate } from "react-router";

interface IProtectedRouteProps {
    authToken: string | null;
    children: React.ReactNode;
}

export default function ProtectedRoute(props: IProtectedRouteProps) {
    if (!props.authToken || props.authToken === null) {
        return <Navigate to="/login" replace />
    }
    return props.children;
}
