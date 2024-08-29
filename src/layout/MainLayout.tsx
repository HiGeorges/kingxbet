import React from 'react';
import Header from "./Header";
import Menu from "./Menu";

const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <div className="min-h-screen flex flex-col bg-gray-100 text-gray-900">
            <Header />
            <div className="flex-grow">
                {children}
            </div>
            <Menu />
        </div>
    );
};

export default MainLayout;
