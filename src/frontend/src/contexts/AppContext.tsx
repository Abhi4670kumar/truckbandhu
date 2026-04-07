import type React from "react";
import { createContext, useContext, useState } from "react";
import type { AppRole } from "../types/appTypes";

export type { AppRole };

interface AppContextType {
  currentRole: AppRole;
  setCurrentRole: (role: AppRole) => void;
  isLoggedIn: boolean;
  setIsLoggedIn: (v: boolean) => void;
  userName: string;
  setUserName: (name: string) => void;
  userPhone: string;
  setUserPhone: (phone: string) => void;
}

const AppContext = createContext<AppContextType>({
  currentRole: "driver",
  setCurrentRole: () => {},
  isLoggedIn: false,
  setIsLoggedIn: () => {},
  userName: "",
  setUserName: () => {},
  userPhone: "",
  setUserPhone: () => {},
});

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [currentRole, setCurrentRole] = useState<AppRole>("driver");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");
  const [userPhone, setUserPhone] = useState("");

  return (
    <AppContext.Provider
      value={{
        currentRole,
        setCurrentRole,
        isLoggedIn,
        setIsLoggedIn,
        userName,
        setUserName,
        userPhone,
        setUserPhone,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  return useContext(AppContext);
}
