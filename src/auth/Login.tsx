import React, { useState } from 'react';
import { toast } from "react-toastify";
import { otpService } from "../service/authService/optService.ts";
import { loginService } from "../service/authService/loginService.ts";
import { useNavigate } from "react-router-dom";

const Login: React.FC = () => {
    const [step, setStep] = useState(1);
    const [email, setEmail] = useState('');
    const [code, setCode] = useState('');
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        if (!email) {
            toast.error("Veuillez saisir votre adresse email.");
            return;
        }
        if (!/\S+@\S+\.\S+/.test(email)) {
            toast.error("Veuillez saisir une adresse email valide.");
            return;
        }
        try {
            setLoading(true);
            const sendEmail = await otpService({ email });
            setLoading(false);

            if (!sendEmail.success) {
                toast.error(sendEmail.message);
                return;
            }

            toast.success("Un code a été envoyé à votre adresse email.");
            setStep(2);
        } catch (error: any) {
            setLoading(false);
            toast.error("Une erreur s'est produite. Veuillez réessayer.");
        }
    };

    const handleCodeVerification = async () => {
        try {
            setLoading(true);
            const response = await loginService({
                email,
                otpCode: code,
            });
            setLoading(false);

            if (!response.success) {
                toast.error(response.message);
                return;
            }

            toast.success('Vous êtes connecté avec succès.');
            navigate('/');
        } catch (error: any) {
            setLoading(false);
            toast.error("Échec de la vérification du code. Veuillez réessayer.");
        }
    };

    const handleResendCode = async () => {
        try {
            setLoading(true);
            const sendEmail = await otpService({ email });
            setLoading(false);

            if (sendEmail.success) {
                toast.success("Le code a été renvoyé à votre adresse email.");
            } else {
                toast.error(sendEmail.message);
            }
        } catch (error: any) {
            setLoading(false);
            toast.error("Une erreur s'est produite lors de l'envoi du code.");
        }
    };

    const handleChangeEmail = () => {
        setStep(1); // Retourne à l'étape 1 pour changer l'email
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

                <h2 className="text-3xl font-bold text-center mb-6">Se connecter à nouveau,</h2>
                <p className="text-center text-gray-500 mb-6">Veuillez saisir votre adresse pour vous connecter.</p>

                {loading ? (
                    <div className="flex justify-center items-center mb-6">
                        <div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12"></div>
                    </div>
                ) : (
                    <>
                        {step === 1 ? (
                            <>
                                <input
                                    type="email"
                                    placeholder="Adresse Email"
                                    className="w-full p-3 mb-4 border rounded"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                                <button
                                    className="w-full bg-[#004aad] text-white p-3 rounded mb-4 hover:bg-[#003780] transition-colors duration-300"
                                    onClick={handleLogin}
                                    disabled={loading}
                                >
                                    Continuer
                                </button>
                            </>
                        ) : (
                            <>
                                <p className="text-center mb-4">Nous avons envoyé un code à <strong>{email}</strong>.</p>
                                <input
                                    type="text"
                                    placeholder="Entrez le code"
                                    className="w-full p-3 mb-4 border rounded"
                                    value={code}
                                    onChange={(e) => setCode(e.target.value)}
                                />
                                <button
                                    className="w-full bg-green-600 text-white p-3 rounded mb-4 hover:bg-green-700 transition-colors duration-300"
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
                                    onClick={handleChangeEmail}
                                >
                                    Changer l'adresse email
                                </button>
                            </>
                        )}
                    </>
                )}

                {/* Texte pour la création de compte */}
                <p className="text-center text-gray-500 mt-4">
                    Vous n'avez pas encore de compte ?{" "}
                    <a href="/register" className="text-[#004aad] hover:text-[#003780]">
                        Créez-en un
                    </a>.
                </p>
            </div>
        </div>
    );
};

export default Login;
