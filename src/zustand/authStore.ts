import { create } from 'zustand';

type AuthState = {
    isLoggedIn: boolean;
    setIsLoggedIn: (loggedIn: boolean) => void;
    checkLoginStatus: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
    isLoggedIn: false,
    setIsLoggedIn: (loggedIn: boolean) => {
        set({ isLoggedIn: loggedIn });
        localStorage.setItem('isLoggedIn', JSON.stringify(loggedIn));
    },
    checkLoginStatus: () => {
        const storedStatus = localStorage.getItem('isLoggedIn');
        if (storedStatus) {
            set({ isLoggedIn: JSON.parse(storedStatus) });
        }
    },
}));

useAuthStore.getState().checkLoginStatus();
