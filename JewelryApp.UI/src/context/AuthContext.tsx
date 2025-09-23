// src/contexts/AuthContext.tsx
import React, { createContext, useContext } from "react";
import { getUserRoles } from "../apis/users.api/users.api";
import useLocalApi from "../hooks/useLocalApi";

interface AuthContextType {
  roles: string[];
  setRoles: any;
  isLoading: boolean;
  callGetUserRoles: () => Promise<string[]>;
}

const AuthContext = createContext<AuthContextType>({
  roles: [],
  setRoles: () => {},
  isLoading: true,
  callGetUserRoles: () => {},
});

export const AuthProvider = ({
  children,
}: {
  children: React.ReactElement;
}) => {
  const accessToken =
    localStorage.getItem("accessToken") ||
    sessionStorage.getItem("accessToken");

  const {
    data: allUserRoles,
    setData: setRoles,
    isLoading,
    fetchData: callGetUserRoles,
  } = useLocalApi({
    apiToCall: () => getUserRoles(),
    extraEffectCheck: !!accessToken,
    initallyIsLoading: true,
  }) as {
    data: string[];
    setData: any;
    isLoading: boolean;
    fetchData: () => void;
  };

  return (
    <AuthContext.Provider
      value={{ roles: allUserRoles, isLoading, callGetUserRoles, setRoles }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
