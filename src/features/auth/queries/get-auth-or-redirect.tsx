

import { getAuth } from "@/features/auth/queries/get-auth";
import { redirect } from "next/navigation";

export const getAuthOrRedirect = async (path:string)=> {
  const auth = await getAuth();

  if (!auth) {
    redirect(path);
  }
  return auth
};
