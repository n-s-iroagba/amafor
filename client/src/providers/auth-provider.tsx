'use client'
import { API_ROUTES } from "@/config/routes";
import { useGet } from "@/shared/hooks/useApiQuery";
import { AuthContext } from "@/shared/lib/context/AuthContext";
import { AuthUser } from "@/shared/types";
import { useState, useEffect } from "react";

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<AuthUser  | null>(null);

  const { data: fetchedUser,loading } = useGet<AuthUser >(
    API_ROUTES.AUTH.ME 
  );

  useEffect(() => {
    if (fetchedUser) {
      setUser(fetchedUser);
    }
  }, [fetchedUser]);

  // Fix: Pass an object to value prop, not comma-separated values
  return (
    <AuthContext.Provider value={{ user, setUser,loading }}>
      {children}
    </AuthContext.Provider>
  );
};