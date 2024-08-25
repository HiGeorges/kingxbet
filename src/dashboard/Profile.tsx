import React from "react";
import { useNavigate } from "react-router-dom";
import {useAuthStore} from "../zustand/authStore.ts";

const Profile: React.FC = () => {
    const navigate = useNavigate();
    const setIsLoggedIn = useAuthStore(state => state.setIsLoggedIn);
    const user = JSON.parse(localStorage.getItem('UserInfos') || '{}');

    const handleLogout = () => {
        localStorage.removeItem('userToken');
        localStorage.removeItem('UserInfos');
        setIsLoggedIn(false);
        navigate('/login');
    };

    return (
        <main className="flex-grow p-6">
            <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-lg">
                <h2 className="text-3xl font-bold mb-6">Profile</h2>
                <div className="flex flex-col md:flex-row">
                    {/* Left section - Profile Picture and Actions */}
                    <div className="flex flex-col items-center md:w-1/3 mb-6 md:mb-0">
                        <div className="w-24 h-24 mb-4">
                            <img
                                className="rounded-full w-full h-full object-cover"
                                src="https://via.placeholder.com/150"
                                alt="Profile"
                            />
                        </div>
                        <button className="text-blue-600 hover:text-blue-800 font-semibold mb-4">
                            Modifier votre profile
                        </button>
                    </div>

                    {/* Right section - User Details */}
                    <div className="md:w-2/3">
                        <div className="mb-4">
                            <p className="text-gray-600 text-sm">Email Address</p>
                            <p className="font-semibold text-gray-800">{user.email}</p>
                        </div>
                        <div className="mb-4 flex items-center">
                            <div className="flex-grow">
                                <p className="text-gray-600 text-sm">Numéro de téléphone</p>
                                <p className="font-semibold text-gray-800">{user.phoneNumber}</p>
                            </div>
                            <button className="text-blue-600 hover:text-blue-800 ml-2">
                                <i className="fas fa-edit"></i>
                            </button>
                        </div>


                        <button
                            className="text-red-600 hover:text-red-800 font-semibold mt-4"
                            onClick={handleLogout}
                        >
                            Se déconnecter
                        </button>
                    </div>
                </div>

                {/* Promo Card */}
                <div className="bg-green-600 text-white p-6 rounded-lg shadow-lg mt-8">
                    <h3 className="text-xl font-bold mb-2">Profitez de cette offre exclusive !</h3>
                    <p>Utilisez le code promo <span className="bg-white text-green-600 font-bold py-1 px-2 rounded">PROMOCODE</span> pour avoir <span className="font-bold">200 % de bonus</span> sur votre premier dépôt sur 1xbet.</p>
                </div>
            </div>
        </main>
    );
};

export default Profile;
