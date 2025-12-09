import { createContext, useContext, useState } from "react";

export const ContextApi = createContext();

export const ContextProvider = ({ children }) => {
    // Get raw token (stored as string)
    const storedToken = localStorage.getItem("JWT_TOKEN");

    const [token, setToken] = useState(storedToken || null);

    const sendData = {
        token,
        setToken: (value) => {
            setToken(value);
            if (value) {
                localStorage.setItem("JWT_TOKEN", value); // store as plain string
            } else {
                localStorage.removeItem("JWT_TOKEN");
            }
        }
    };

    return (
        <ContextApi.Provider value={sendData}>
            {children}
        </ContextApi.Provider>
    );
};

export const useStoreContext = () => useContext(ContextApi);
