import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import DepositModal from "../dashboard/DepositModal.tsx";
import WithdrawalModal from "../dashboard/WithdrawalModal.tsx";

const Menu: React.FC = () => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [isDepositModalOpen, setIsDepositModalOpen] = useState(false);
    const [isWithdrawalModalOpen, setIsWithdrawalModalOpen] = useState(false);
    const navigate = useNavigate();

    const toggleMenu = () => {
        setIsExpanded(!isExpanded);
    };

    const openDepositModal = () => {
        setIsExpanded(false); // Fermer le menu avant d'ouvrir le modal
        setIsDepositModalOpen(true);
    };

    const openWithdrawalModal = () => {
        setIsExpanded(false); // Fermer le menu avant d'ouvrir le modal
        setIsWithdrawalModalOpen(true);
    };

    const closeDepositModal = () => setIsDepositModalOpen(false);
    const closeWithdrawalModal = () => setIsWithdrawalModalOpen(false);

    return (
        <>
            <div className="bg-white p-4 shadow fixed bottom-0 left-0 w-full z-10">
                <div className="max-w-4xl mx-auto flex justify-around">
                    <button
                        className="flex flex-col items-center text-green-500 focus:outline-none"
                        onClick={() => navigate("/")}
                    >
                        <i className="fas fa-home text-2xl"></i>
                    </button>
                    <button
                        className="flex flex-col items-center text-blue-500 focus:outline-none"
                        onClick={toggleMenu}
                    >
                        <div className="bg-yellow-500 p-4 rounded-full">
                            <i className={`fas fa-${isExpanded ? 'times' : 'plus'} text-2xl text-white`}></i>
                        </div>
                    </button>
                    <button
                        className="flex flex-col items-center text-gray-500 focus:outline-none"
                        onClick={() => navigate("/profile")}
                    >
                        <i className="fas fa-user text-2xl"></i>
                    </button>
                </div>
            </div>

            {isExpanded && (
                <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-end z-20">
                    <div className="bg-white rounded-t-lg p-6 w-full max-w-md relative mb-48">
                        <button
                            className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 focus:outline-none"
                            onClick={toggleMenu}
                        >
                            <i className="fas fa-times text-2xl"></i>
                        </button>
                        <div className="text-center mb-4">
                            <h3 className="text-xl font-bold">Faire une opération</h3>
                        </div>
                        <div className="flex justify-around mb-4">
                            <button
                                className="bg-blue-600 text-white py-2 px-4 rounded-lg focus:outline-none"
                                onClick={openDepositModal} // Ouvrir le modal de dépôt
                            >
                                Dépôt
                            </button>
                            <button
                                className="bg-green-600 text-white py-2 px-4 rounded-lg focus:outline-none"
                                onClick={openWithdrawalModal} // Ouvrir le modal de retrait
                            >
                                Retrait
                            </button>
                        </div>
                        <p className="text-xs text-gray-500 text-center">
                            Les dépôts et retraits sont automatiques une fois que vous approuvez la transaction sur
                            votre compte mobile Money.
                        </p>
                    </div>
                </div>
            )}

            {/* Modals pour dépôt et retrait */}
            <DepositModal isOpen={isDepositModalOpen} onClose={closeDepositModal} />
            <WithdrawalModal isOpen={isWithdrawalModalOpen} onClose={closeWithdrawalModal} />
        </>
    );
};

export default Menu;
