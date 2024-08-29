import React, { useState } from 'react';
import { toast } from "react-toastify";
import { otpService } from "../service/authService/optService.ts";
import { registerService } from "../service/authService/registerService.ts";
import { loginService } from "../service/authService/loginService.ts";
import { useNavigate } from 'react-router-dom';

const Register: React.FC = () => {
    const [step, setStep] = useState(1);
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [referral, setReferral] = useState('');  // Champ pour le code parrain (optionnel)
    const [code, setCode] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleRegister = async () => {
        if (!fullName) {
            toast.error('Nom complet est obligatoire.');
            return;
        }

        if (!email) {
            toast.error('Adresse email est obligatoire.');
            return;
        }

        if (!phoneNumber) {
            toast.error('Numéro de téléphone est obligatoire.');
            return;
        }

        try {
            setLoading(true);
            const response = await registerService({
                fullName,
                email,
                phoneNumber,
                referral,  // Inclure le code parrain dans les données envoyées
            });
            if (!response.success) {
                setLoading(false);
                toast.error(response.message);
                return;
            }
            await otpService({ email: email || phoneNumber });  // Envoie OTP à l'email ou au téléphone
            setLoading(false);
            setStep(2); // Passe à l'étape 2 pour entrer le code
        } catch (error: any) {
            if (
                error.response &&
                error.response.data &&
                error.response.data.message
            ) {
                toast.error(error.response.data.message);
            } else {
                toast.error('Inscription échouée. Veuillez réessayer.');
            }
            setLoading(false);
        }
    };

    const handleCodeVerification = async () => {
        const response = await loginService({
            email: email || phoneNumber,
            otpCode: code,
        });
        if (!response.success) {
            toast.error(response.message);
            return;
        }
        toast.success('Vous êtes connecté avec succès.');
        navigate('/');
    };

    const handleResendCode = async () => {
        try {
            setLoading(true);
            await otpService({ email: email || phoneNumber });
            toast.success("Le code a été renvoyé à votre adresse.");
            setLoading(false);
        } catch (error: any) {
            toast.error('Une erreur s\'est produite lors de l\'envoi du code. Veuillez réessayer.');
            setLoading(false);
        }
    };

    const handleChangeEmailOrPhone = () => {
        setStep(1); // Retourne à l'étape 1 pour changer l'email ou le numéro de téléphone
    };

    return (
        <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
                {/* Logo */}
                <div className="flex justify-center mb-6">
                    <img
                        src='https://allesive.sirv.com/SPIDCASH/logo'
                        alt="Logo"
                        className="w-32 h-auto"
                    />
                </div>

                <h2 className="text-3xl font-bold text-center mb-6">Créer un compte</h2>

                {loading ? (
                    <div className="flex justify-center items-center mb-6">
                        <div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12"></div>
                    </div>
                ) : (
                    <>
                        {step === 1 ? (
                            <>
                                <input
                                    type="text"
                                    placeholder="Nom complet"
                                    className="w-full p-3 mb-4 border rounded"
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                />
                                <input
                                    type="email"
                                    placeholder="Adresse email"
                                    className="w-full p-3 mb-4 border rounded"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                                <input
                                    type="tel"
                                    placeholder="Numéro de téléphone"
                                    className="w-full p-3 mb-4 border rounded"
                                    value={phoneNumber}
                                    onChange={(e) => setPhoneNumber(e.target.value)}
                                />
                                <input
                                    type="text"
                                    placeholder="Code de parrainage (optionnel)"
                                    className="w-full p-3 mb-4 border rounded"
                                    value={referral}
                                    onChange={(e) => setReferral(e.target.value)}
                                />
                                <button
                                    className={`w-full bg-[#004aad] text-white p-3 rounded mb-4 ${loading ? 'opacity-50 cursor-not-allowed' : ''} hover:bg-[#003780] transition-colors duration-300`}
                                    onClick={handleRegister}
                                    disabled={loading}
                                >
                                    Continuer
                                </button>
                            </>
                        ) : (
                            <>
                                <p className="text-center mb-4">Nous avons envoyé un code à <strong>{email || phoneNumber}</strong>.</p>
                                <input
                                    type="text"
                                    placeholder="Entrez le code"
                                    className="w-full p-3 mb-4 border rounded"
                                    value={code}
                                    onChange={(e) => setCode(e.target.value)}
                                />
                                <button
                                    className={`w-full bg-green-600 text-white p-3 rounded mb-4 ${loading ? 'opacity-50 cursor-not-allowed' : ''} hover:bg-green-700 transition-colors duration-300`}
                                    onClick={handleCodeVerification}
                                    disabled={loading}
                                >
                                    Vérifier le code
                                </button>
                                <button
                                    className="w-full text-[#004aad] hover:text-[#003780] text-center mb-2"
                                    onClick={handleResendCode}
                                    disabled={loading}
                                >
                                    Renvoyer le code
                                </button>
                                <button
                                    className="w-full text-gray-600 hover:text-gray-800 text-center"
                                    onClick={handleChangeEmailOrPhone}
                                >
                                    Changer l'adresse email ou le numéro de téléphone
                                </button>
                            </>
                        )}
                    </>
                )}

                {/* Texte pour se connecter */}
                <p className="text-center text-gray-500 mt-4">
                    Vous avez déjà un compte?{" "}
                    <a href="/login" className="text-[#004aad] hover:text-[#003780]">
                        Connectez-vous
                    </a>.
                </p>
            </div>
        </div>
    );
};

export default Register;
