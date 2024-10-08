import React, { useEffect, useState } from "react";
import { walletService } from "../service/wallet/walletService.ts";
import { historyService } from "../service/operation/historyService.ts";
import DepositModal from "./DepositModal.tsx";
import WithdrawalModal from "./WithdrawalModal.tsx";
import TransactionDetailModal from "./TransactionDetailModal.tsx";

const Home: React.FC = () => {
    const [balanceEarned, setBalanceEarned] = useState<string>('0 FCFA');
    const [transactions, setTransactions] = useState<any[]>([]);
    const [visibleTransactions, setVisibleTransactions] = useState<number>(5); // Nombre de transactions visibles
    const [isDepositModalOpen, setIsDepositModalOpen] = useState(false);
    const [isWithdrawalModalOpen, setIsWithdrawalModalOpen] = useState(false);
    const [selectedTransaction, setSelectedTransaction] = useState<any | null>(null);

    const openDepositModal = () => setIsDepositModalOpen(true);
    const closeDepositModal = () => setIsDepositModalOpen(false);

    const openWithdrawalModal = () => setIsWithdrawalModalOpen(true);
    const closeWithdrawalModal = () => setIsWithdrawalModalOpen(false);

    const openTransactionDetailModal = (transaction: any) => setSelectedTransaction(transaction);
    const closeTransactionDetailModal = () => setSelectedTransaction(null);

    const fetchBalance = async () => {
        try {
            const token = localStorage.getItem('userToken');
            if (token) {
                const response = await walletService(token);
                if (response.earnedBalance) {
                    localStorage.setItem('balanceEarned', response.earnedBalance);
                    setBalanceEarned(response.earnedBalance);
                }
            }
        } catch (error) {
            console.error('Failed to fetch balance:', error);
        }
    };

    const fetchTransactions = async () => {
        try {
            const response = await historyService();
            if (response && Array.isArray(response)) {
                const sortedTransactions = response.sort(
                    (a, b) => new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime()
                );
                setTransactions(sortedTransactions);
            } else {
                console.error('Unexpected data format:', response);
            }
        } catch (error) {
            console.error('Failed to fetch transactions:', error);
        }
    };

    useEffect(() => {
        fetchBalance();
        fetchTransactions();
    }, []);

    const handleShowMoreTransactions = () => {
        setVisibleTransactions(prevVisible => prevVisible + 5); // Affiche 5 transactions de plus
    };

    const getTypeLabel = (type: string) => {
        switch (type) {
            case 'deposit':
                return 'Dépot';
            case 'withdraw':
                return 'Retrait';
            default:
                return 'Transaction';
        }
    };

    return (
        <main className="flex-grow p-4">
            {/* Section 1: Carte de solde et actions principales */}
            <div className="max-w-4xl mx-auto mb-8">
                <div className="bg-white p-6 rounded-lg shadow-lg flex flex-col md:flex-row justify-between items-center">
                    <div className="mb-4 md:mb-0 text-center md:text-left">
                        <div className="text-3xl font-bold mb-2">{balanceEarned} FCFA</div>
                        <div className="text-sm text-gray-600">Solde de fidélité</div>
                    </div>
                    <DepositModal isOpen={isDepositModalOpen} onClose={closeDepositModal} />
                    <WithdrawalModal isOpen={isWithdrawalModalOpen} onClose={closeWithdrawalModal} />
                    <div className="flex space-x-4">
                        <button
                            className="bg-[#004aad] hover:bg-[#003780] text-white py-3 px-6 rounded-lg transition duration-300"
                            onClick={openDepositModal}>
                            Dépôt
                        </button>
                        <button
                            className="bg-[#c01333] hover:bg-[#a0112b] text-white py-3 px-6 rounded-lg transition duration-300"
                            onClick={openWithdrawalModal}>
                            Retrait
                        </button>
                    </div>
                </div>
            </div>

            {/* Section 3: Liste des 10 dernières transactions */}
            <div className="max-w-4xl mx-auto mb-8">
                <h2 className="text-xl font-bold mb-4">5 Dernières Transactions</h2>
                <div className="bg-white p-6 rounded-lg shadow-lg">
                    {transactions.length > 0 ? (
                        <>
                            <ul className="space-y-4">
                                {transactions.slice(0, visibleTransactions).map((transaction, index) => (
                                    <li
                                        key={transaction.id}
                                        className={`flex justify-between items-center p-4 rounded-lg ${index % 2 === 0 ? 'bg-gray-100' : 'bg-gray-200'}`}
                                    >
                                        <div className="flex items-center">
                                            <i className={`fas fa-${transaction.type === 'deposit' ? 'arrow-down' : 'arrow-up'} text-${transaction.type === 'deposit' ? 'green' : 'red'}-500 mr-2`}></i>
                                            <span className="font-medium">{getTypeLabel(transaction.type)}</span>
                                        </div>
                                        <span>{transaction.amount} FCFA</span>
                                        <span className={`font-medium text-${transaction.status === 'Succès' ? 'green' : 'red'}-500`}>{transaction.status || 'Succès'}</span>
                                        <button
                                            className="text-[#004aad] hover:text-[#003780] focus:outline-none ml-4"
                                            onClick={() => openTransactionDetailModal(transaction)}>
                                            <i className="fas fa-eye"></i>
                                        </button>
                                    </li>
                                ))}
                            </ul>
                            {visibleTransactions < transactions.length && (
                                <div className="flex justify-end mt-4">
                                    <button
                                        className="text-[#004aad] hover:text-[#003780] font-semibold focus:outline-none"
                                        onClick={handleShowMoreTransactions}>
                                        Voir plus
                                    </button>
                                </div>
                            )}
                        </>
                    ) : (
                        <p className="text-gray-500 text-center">Aucune transaction trouvée</p>
                    )}
                </div>
            </div>

            {/* Section 4: Promo Card */}
            <div className="max-w-4xl mx-auto bg-[#c01333] text-white p-6 rounded-lg shadow-lg flex flex-col md:flex-row items-center justify-between">
                <div>
                    <h3 className="text-2xl font-bold mb-2">Profitez de cette offre exclusive !</h3>
                    <p>Utilisez le code promo <span className="bg-white text-[#c01333] font-bold py-1 px-2 rounded">PROMOCODE</span> pour obtenir <span className="font-bold">200 % de bonus</span> sur votre premier dépôt.</p>
                </div>
            </div>

            {/* Section 2: Rejoignez notre canal Telegram */}
            <div className="max-w-4xl mx-auto mb-8 bg-[#004aad] text-white p-6 mt-8 rounded-lg shadow-lg flex flex-col md:flex-row items-center justify-between">
                <div>
                    <h3 className="text-2xl font-bold mb-2">Rejoignez notre canal Telegram !</h3>
                    <p>Telegram pour recevoir des coupons gratuits et rester informé des dernières offres.</p>
                </div>
                <a
                    href="https://t.me/spidcashcom"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 md:mt-0 bg-white text-[#004aad] py-2 px-4 rounded-lg"
                >
                    Rejoindre le Canal
                </a>
            </div>

            {/* Transaction Detail Modal */}
            {selectedTransaction && (
                <TransactionDetailModal
                    transaction={selectedTransaction}
                    onClose={closeTransactionDetailModal}
                />
            )}
        </main>
    );
};

export default Home;
