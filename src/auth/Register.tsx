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
    const [code, setCode] = useState('');
    const [loading, setLoading] = useState(false);
    const phoneNumber = ' ';
    const referral = '';
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

        try {
            setLoading(true);
            const response = await registerService({
                fullName,
                email,
                phoneNumber,
                referral,
            });
            if (!response.success) {
                setLoading(false);
                toast.error(response.message);
                return;
            }
            await otpService({ email });
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
            email,
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
            await otpService({ email });
            toast.success("Le code a été renvoyé à votre adresse email.");
            setLoading(false);
        } catch (error: any) {
            toast.error('Une erreur s\'est produite lors de l\'envoi du code. Veuillez réessayer.');
            setLoading(false);
        }
    };

    const handleChangeEmail = () => {
        setStep(1); // Retourne à l'étape 1 pour changer l'email
    };

    return (
        <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
                <h2 className="text-3xl font-bold text-center mb-6">Register</h2>

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
                                    placeholder="Full Name"
                                    className="w-full p-3 mb-4 border rounded"
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                />
                                <input
                                    type="email"
                                    placeholder="Email Address"
                                    className="w-full p-3 mb-4 border rounded"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                                <button
                                    className={`w-full bg-blue-600 text-white p-3 rounded mb-4 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    onClick={handleRegister}
                                    disabled={loading}
                                >
                                    Continue
                                </button>
                            </>
                        ) : (
                            <>
                                <p className="text-center mb-4">Nous avons envoyé un code à <strong>{email}</strong>.</p>
                                <input
                                    type="text"
                                    placeholder="Enter Code"
                                    className="w-full p-3 mb-4 border rounded"
                                    value={code}
                                    onChange={(e) => setCode(e.target.value)}
                                />
                                <button
                                    className={`w-full bg-green-600 text-white p-3 rounded mb-4 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    onClick={handleCodeVerification}
                                    disabled={loading}
                                >
                                    Verify Code
                                </button>
                                <button
                                    className="w-full text-blue-600 hover:text-blue-800 text-center mb-2"
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

                {/* Texte pour se connecter */}
                <p className="text-center text-gray-500 mt-4">
                    Vous avez déjà un compte?{" "}
                    <a href="/login" className="text-blue-600 hover:text-blue-800">
                        Connectez-vous
                    </a>.
                </p>
            </div>
        </div>
    );
};

export default Register;
