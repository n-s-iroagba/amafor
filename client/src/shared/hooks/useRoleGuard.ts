"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthContext } from "@/shared/hooks/useAuthContext";
import { UserRole } from "@/shared/types";

export const useRoleGuard = (requiredRoles: UserRole[]) => {
    const router = useRouter();
    const { user, loading } = useAuthContext();

    useEffect(() => {
        if (loading) return;

        if (!user) {
            router.push("/auth/login");
            return;
        }

        const hasPermission = requiredRoles.some(role => user.roles.includes(role));

        if (!hasPermission) {
            // If user has multiple roles but not the required one for this specific dashboard,
            // redirect back to the selection page
            if (user.roles.length > 1) {
                router.push("/dashboard");
            } else {
                // Otherwise redirect to home or a generic access denied
                router.push("/");
            }
        }
    }, [user, loading, router, requiredRoles]);

    return { user, loading };
};
