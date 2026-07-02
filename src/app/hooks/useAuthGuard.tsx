"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { toast } from "sonner";
import { API_BASE_URL } from "../../../lib/api";
export function useAuthGuard() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const router = useRouter();
  const pathname = usePathname(); 

  useEffect(() => {
    const checkSession = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        handleUnauthenticated();
        return;
      }

      try {
        const response = await fetch(`${API_BASE_URL}/auth/profile`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const userData = await response.json();
          const role = userData.role;
          setIsAuthenticated(true);
          setUserRole(role);

          if (pathname.startsWith("/admin")) {
            if (role !== "ADMIN") {
              toast.dismiss();
              toast.error("Access Denied: Admin privileges required.");
              router.push("/admin/login");
            }
          }
        } else {
          handleUnauthenticated();
        }
      } catch (error) {
        console.error("Session verification failed", error);
        setIsAuthenticated(false);
      }
    };

    const handleUnauthenticated = () => {
      setIsAuthenticated(false);
      setUserRole(null);
      toast.dismiss();
      toast.error("Please sign in to access this page.");

      if (pathname.startsWith("/admin")) {
        router.push("/admin/login");
      } else {
        router.push("/user/auth/login");
      }
    };

    checkSession();
  }, [router, pathname]);

  return { isAuthenticated, userRole };
}
