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
        setIsExpanded(false);
        setIsDepositModalOpen(true);
    };

    const openWithdrawalModal = () => {
        setIsExpanded(false);
        setIsWithdrawalModalOpen(true);
    };

    const closeDepositModal = () => setIsDepositModalOpen(false);
    const closeWithdrawalModal = () => setIsWithdrawalModalOpen(false);

    return (
        <>
            <div className="bg-white p-3 shadow fixed bottom-0 left-0 w-full z-10">
                <div className="max-w-4xl mx-auto flex justify-around">
                    <button
                        className="flex flex-col items-center text-[#c01333] focus:outline-none"
                        onClick={() => navigate("/")}
                    >
                        <i className="fas fa-home text-xl"></i>
                    </button>
                    <button
                        className="flex flex-col items-center text-[#004aad] focus:outline-none"
                        onClick={toggleMenu}
                    >
                        <div className="bg-yellow-500 p-3 rounded-full shadow-md">
                            <i className={`fas fa-${isExpanded ? 'times' : 'plus'} text-xl text-white`}></i>
                        </div>
                    </button>
                    <button
                        className="flex flex-col items-center text-gray-500 focus:outline-none"
                        onClick={() => navigate("/profile")}
                    >
                        <i className="fas fa-user text-xl"></i>
                    </button>
                </div>
            </div>

            {isExpanded && (
                <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-end z-20">
                    <div className="bg-white rounded-t-lg p-5 w-full max-w-sm relative mb-48 shadow-lg">
                        <button
                            className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 focus:outline-none"
                            onClick={toggleMenu}
                        >
                            <i className="fas fa-times text-xl"></i>
                        </button>
                        <div className="text-center mb-3">
                            <h3 className="text-lg font-bold">Faire une opération</h3>
                        </div>
                        <div className="flex justify-around mb-3">
                            <button
                                className="bg-[#004aad] text-white py-2 px-3 rounded-lg shadow-sm focus:outline-none"
                                onClick={openDepositModal}
                            >
                                Dépôt
                            </button>
                            <button
                                className="bg-[#c01333] text-white py-2 px-3 rounded-lg shadow-sm focus:outline-none"
                                onClick={openWithdrawalModal}
                            >
                                Retrait
                            </button>
                        </div>
                        <p className="text-xs text-gray-500 text-center">
                            Les dépôts et retraits sont automatiques après approbation sur votre compte mobile Money.
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
