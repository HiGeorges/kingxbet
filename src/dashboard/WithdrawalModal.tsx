import React, { useState } from 'react';
import { toast } from "react-toastify";
import { withdrawOperationService } from "../service/operation/withdrawService.ts";

interface WithdrawModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const WithdrawModal: React.FC<WithdrawModalProps> = ({ isOpen, onClose }) => {
    const [xbetId, setXbetId] = useState('');
    const [code, setCode] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [paymentNetwork, setPaymentNetwork] = useState('');
    const [loading, setLoading] = useState(false); // État de chargement

    // Mapping pour les réseaux de paiement
    const mapPaymentNetwork = (network: string): string | undefined => {
        const paymentNetworkMapping: { [key: string]: string } = {
            'MTN Benin': 'mtn_bj',
            'Moov Benin': 'moov_bj',
            'Moov Togo': 'moov_tg',
        };
        return paymentNetworkMapping[network];
    };

    // Gestion de l'opération de retrait
    const handleWithdraw = async () => {
        if (!xbetId || !code || !phoneNumber || !paymentNetwork) {
            toast.error('Tous les champs sont obligatoires');
            return;
        }

        const mappedNetwork = mapPaymentNetwork(paymentNetwork);
        if (!mappedNetwork) {
            toast.error('Réseau de paiement invalide');
            return;
        }

        setLoading(true); // Commence le chargement

        try {
            const withdraw = await withdrawOperationService({
                xbetId: Number(xbetId),
                code,
                phoneNumber,
                network: mappedNetwork,
            });

            if (withdraw.success) {
                toast.success('Retrait effectué avec succès');
                onClose(); // Ferme le modal après le succès
            } else {
                toast.error(withdraw.message);
            }
        } catch (error) {
            console.error('Erreur lors du retrait:', error);
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
                <h2 className="text-xl font-bold mb-4">Effectuer un retrait 1XBET</h2>
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
                        <label className="block text-gray-700">Code de Retrait</label>
                        <input
                            type="text"
                            placeholder="Entrez le code de retrait"
                            className="w-full p-2 border rounded"
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
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
                    onClick={handleWithdraw}
                    disabled={loading} // Désactive le bouton pendant le chargement
                >
                    {loading ? (
                        <div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-6 w-6"></div>
                    ) : (
                        'Effectuer le retrait'
                    )}
                </button>
            </div>
        </div>
    );
};

export default WithdrawModal;
