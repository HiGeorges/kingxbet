import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {useAuthStore} from "../zustand/authStore.ts";

const Header: React.FC = () => {
    const navigate = useNavigate();
    const setIsLoggedIn = useAuthStore((state) => state.setIsLoggedIn);
    const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

    const userInfo = localStorage.getItem('UserInfos');
    const user = userInfo ? JSON.parse(userInfo) : null;

    const handleLogout = () => {
        // Supprimer les informations utilisateur du localStorage
        localStorage.removeItem('UserInfos');
        localStorage.removeItem('userToken');

        // Mettre à jour l'état pour indiquer que l'utilisateur n'est plus connecté
        setIsLoggedIn(false);

        // Afficher un message de succès
        toast.success("Vous avez été déconnecté avec succès.");

        // Rediriger vers la page de connexion
        navigate("/login");
    };

    return (
        <header className="bg-white shadow p-4">
            <div className="max-w-4xl mx-auto flex justify-between items-center">
                <div className="flex items-center mx-auto md:mx-0 md:flex-row text-center">
                    <h1 className="text-2xl font-bold text-blue-900">Hello</h1>
                    {user && (
                        <span className="ml-2 text-xl text-gray-600">
                            Hi {user.fullName} <span role="img" aria-label="wave">👋</span>
                        </span>
                    )}
                </div>
                <div className="hidden md:flex items-center space-x-4">
                    <button
                        className="text-red-600 hover:text-red-800 focus:outline-none"
                        onClick={() => setIsLogoutModalOpen(true)}  // Ouvrir le modal de confirmation
                    >
                        <i className="fas fa-sign-out-alt text-2xl"></i>
                    </button>
                </div>
            </div>

            {/* Modal de confirmation de déconnexion */}
            {isLogoutModalOpen && (
                <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md relative">
                        <h2 className="text-xl font-bold mb-4">Confirmation</h2>
                        <p className="mb-6">Êtes-vous sûr de vouloir vous déconnecter ?</p>
                        <div className="flex justify-end space-x-4">
                            <button
                                className="bg-gray-200 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-300"
                                onClick={() => setIsLogoutModalOpen(false)}  // Fermer le modal sans déconnecter
                            >
                                Annuler
                            </button>
                            <button
                                className="bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700"
                                onClick={handleLogout}  // Déconnecter l'utilisateur
                            >
                                Déconnexion
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
};

export default Header;
