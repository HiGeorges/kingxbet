import React from "react";

const NotFound: React.FC = () => {
    return (
        <main className="flex-grow flex items-center justify-center">
            <div className="text-center">
                <h1 className="text-4xl font-bold text-gray-700 mb-4">404 - Page Not Found</h1>
                <p className="text-lg text-gray-500 mb-4">Désolé, la page que vous cherchez n'existe pas.</p>
                <a href="/" className="text-blue-600 hover:text-blue-800 font-semibold">
                    Retourner à l'accueil
                </a>
            </div>
        </main>
    );
};

export default NotFound;
