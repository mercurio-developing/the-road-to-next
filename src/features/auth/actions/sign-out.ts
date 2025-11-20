"use server"

import { getAuth } from "@/features/auth/queries/get-auth";
import { signInPath } from "@/app/paths";
import { redirect } from "next/navigation";
import { lucia } from "@/lib/lucia";
import { cookies } from "next/headers";

export const signOut = async ()=>{
  const { session } = await getAuth();

  if(!session){
    redirect(signInPath())
  }

  await lucia.invalidateSession(session.id)

  const sessionCookie = lucia.createBlankSessionCookie()
  if(sessionCookie){
    (await cookies()).set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes
    )
  }
  redirect(signInPath())
}
