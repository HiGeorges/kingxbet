import React, { useEffect } from 'react';
import { Navigate } from "react-router-dom";
import { useAuthStore } from "./authStore.ts";

const PrivateRoute: React.FC<{ element: React.ReactElement }> = ({ element }) => {
    const isLoggedIn = useAuthStore(state => state.isLoggedIn);
    const checkLoginStatus = useAuthStore(state => state.checkLoginStatus);

    useEffect(() => {
        checkLoginStatus();
    }, [checkLoginStatus]);

    if (!isLoggedIn) {
        return <Navigate to="/login" replace />;
    }

    return element;
};

export default PrivateRoute;
