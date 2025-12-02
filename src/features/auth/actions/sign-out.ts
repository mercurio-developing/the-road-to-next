"use server"

import { getAuth } from "@/features/auth/queries/get-auth";
import { signInPath } from "@/paths";
import { redirect } from "next/navigation";
import { deleteSessionCookie } from "../utils/session-cookie";
import { invalidateSession } from "@/lib/lucia";

export const signOut = async ()=>{
  const { session } = await getAuth();

  if(!session){
    redirect(signInPath())
  }

  await invalidateSession(session.id);
  await deleteSessionCookie();
  redirect(signInPath())
}
