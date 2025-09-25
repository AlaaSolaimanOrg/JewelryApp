// src/contexts/AuthContext.tsx
import React, { createContext, useContext } from "react";
import { getUserInfo } from "../apis/users.api/users.api";
import useLocalApi from "../hooks/useLocalApi";

interface User {
  id: number;
  userName: string;
  email: string;
  fullName: string | null;
  lastName: string | null;
  phoneNumber: string | null;
  isActive: boolean;
  roles: string[];
  createdAt: string;
  updatedAt: string | null;
}

interface AuthContextType {
  userInfo: User | null;
  setUserInfo: any;
  isLoading: boolean;
  callGetUserInfo: () => Promise<string[]>;
}

const AuthContext = createContext<AuthContextType>({
  userInfo: null,
  setUserInfo: () => {},
  isLoading: true,
  callGetUserInfo: () => {},
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
    data: userInfo,
    setData: setUserInfo,
    isLoading,
    fetchData: callGetUserInfo,
  } = useLocalApi({
    apiToCall: () => getUserInfo(),
    extraEffectCheck: !!accessToken,
    initallyIsLoading: true,
  }) as {
    data: User;
    setData: any;
    isLoading: boolean;
    fetchData: () => void;
  };

  return (
    <AuthContext.Provider
      value={{ userInfo: userInfo, isLoading, callGetUserInfo, setUserInfo }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
