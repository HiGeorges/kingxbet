import React, { useState } from 'react';
import { toast } from "react-toastify";
import { depositOperationService } from "../service/operation/depositService.ts";

interface DepositModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const DepositModal: React.FC<DepositModalProps> = ({ isOpen, onClose }) => {
    const [xbetId, setXbetId] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [amount, setAmount] = useState('');
    const [paymentNetwork, setPaymentNetwork] = useState('');
    const [loading, setLoading] = useState(false); // État de chargement

    const mapPaymentNetwork = (network: string): string | undefined => {
        const paymentNetworkMapping: { [key: string]: string } = {
            'MTN Benin': 'mtn_bj',
            'Moov Benin': 'moov_bj',
            'Moov Togo': 'moov_tg',
        };
        return paymentNetworkMapping[network];
    };

    // Gestion de l'opération de dépôt
    const handleDeposit = async () => {
        if (!xbetId || !phoneNumber || !amount || !paymentNetwork) {
            toast.error('Tous les champs sont obligatoires');
            return;
        }

        const mappedNetwork = mapPaymentNetwork(paymentNetwork);
        if (!mappedNetwork) {
            toast.error('Réseau de paiement invalide');
            return;
        }

        if (Number(amount) < 100 || Number(amount) > 10000000) {
            toast.error('Le montant doit être compris entre 100 et 10000000 FCFA');
            return;
        }

        setLoading(true); // Commence le chargement

        try {
            const deposit = await depositOperationService({
                xbetId: Number(xbetId),
                amount: Number(amount),
                phoneNumber,
                network: mappedNetwork,
            });

            if (deposit.success) {
                toast.success('Dépôt effectué avec succès');
                onClose();
            } else {
                toast.error(deposit.message);
            }
        } catch (error) {
            console.error('Erreur lors du dépôt:', error);
            toast.error('Une erreur s\'est produite. Veuillez réessayer.');
        } finally {
            setLoading(false); // Termine le chargement
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md relative">
                <button
                    className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 focus:outline-none"
                    onClick={onClose}
                    disabled={loading} // Désactive le bouton de fermeture pendant le chargement
                >
                    <i className="fas fa-times text-xl"></i>
                </button>
                <h2 className="text-xl font-bold mb-4">Effectuer un dépôt 1XBET</h2>
                <div className="space-y-4">
                    <div>
                        <label className="block text-gray-700">1XBET ID</label>
                        <input
                            type="text"
                            placeholder="Entrez votre 1XBET ID"
                            className="w-full p-2 border rounded"
                            value={xbetId}
                            onChange={(e) => setXbetId(e.target.value)}
                            disabled={loading} // Désactive les champs pendant le chargement
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700">Numéro de paiement</label>
                        <input
                            type="text"
                            placeholder="Entrez votre numéro de téléphone"
                            className="w-full p-2 border rounded"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            disabled={loading} // Désactive les champs pendant le chargement
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700">Montant</label>
                        <input
                            type="number"
                            placeholder="Entrez le montant"
                            className="w-full p-2 border rounded"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            disabled={loading} // Désactive les champs pendant le chargement
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700">Réseau de paiement</label>
                        <select
                            className="w-full p-2 border rounded"
                            value={paymentNetwork}
                            onChange={(e) => setPaymentNetwork(e.target.value)}
                            disabled={loading} // Désactive les champs pendant le chargement
                        >
                            <option value="">Selectionner le réseau de paiement</option>
                            <option value="MTN Benin">MTN Benin</option>
                            <option value="Moov Benin">Moov Benin</option>
                            <option value="Moov Togo">Moov Togo</option>
                        </select>
                    </div>
                </div>
                <button
                    className={`mt-4 bg-blue-600 text-white py-2 px-4 rounded w-full flex justify-center items-center ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    onClick={handleDeposit}
                    disabled={loading}
                >
                    {loading ? (
                        <div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-6 w-6"></div>
                    ) : (
                        'Effectuer le dépôt'
                    )}
                </button>
            </div>
        </div>
    );
};

export default DepositModal;
