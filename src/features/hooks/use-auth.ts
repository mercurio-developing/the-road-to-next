import { User as AuthUser } from "lucia";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { getAuth } from "@/features/auth/queries/get-auth";

export const useAuth = () =>{
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isFetched,setFetched] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const fetchUser = async () => {
      const { user } = await getAuth();
      setUser(user);
      setFetched(true)
    };
    fetchUser();
  }, [pathname]);

  return {user,isFetched}
}