import React from 'react';

interface TransactionDetailModalProps {
    transaction: any;
    onClose: () => void;
}

const TransactionDetailModal: React.FC<TransactionDetailModalProps> = ({ transaction, onClose }) => {
    if (!transaction) return null;

    return (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md relative">
                <button
                    className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 focus:outline-none"
                    onClick={onClose}
                >
                    <i className="fas fa-times text-xl"></i>
                </button>
                <h2 className="text-xl font-bold mb-4">Détails de la Transaction</h2>
                <div className="space-y-4">
                    <div>
                        <p className="text-gray-600 text-sm">ID de la Transaction</p>
                        <p className="font-semibold text-gray-800">{transaction.id}</p>
                    </div>
                    <div>
                        <p className="text-gray-600 text-sm">Type</p>
                        <p className="font-semibold text-gray-800">{transaction.type}</p>
                    </div>
                    <div>
                        <p className="text-gray-600 text-sm">Montant</p>
                        <p className="font-semibold text-gray-800">{transaction.amount} FCFA</p>
                    </div>
                    <div>
                        <p className="text-gray-600 text-sm">Status</p>
                        <p className={`font-semibold text-${transaction.status === 'Succès' ? 'green' : 'red'}-500`}>{transaction.status}</p>
                    </div>
                    <div>
                        <p className="text-gray-600 text-sm">Date de Création</p>
                        <p className="font-semibold text-gray-800">{new Date(transaction.createdDate).toLocaleString()}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TransactionDetailModal;
