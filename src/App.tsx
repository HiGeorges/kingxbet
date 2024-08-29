import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import MainLayout from "./layout/MainLayout.tsx";
import Home from "./dashboard/Home.tsx";
import Profile from "./dashboard/Profile.tsx";
import NotFound from "./dashboard/NotFound.tsx";
import Register from "./auth/Register.tsx";
import Login from "./auth/Login.tsx";
import {ToastContainer} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import PrivateRoute from "./zustand/privateRoute.tsx";

const App: React.FC = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<PrivateRoute element={<MainLayout><Home /></MainLayout>} />} />
                <Route path="/profile" element={<PrivateRoute element={<MainLayout><Profile /></MainLayout>} />} />
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Login />} />
                <Route path="*" element={<NotFound />} />
            </Routes>
            <ToastContainer
                position="top-center"
                autoClose={3000}
                hideProgressBar
            />
        </Router>

);
};

export default App;
