import { getAuth } from "@/features/auth/queries/get-auth";
import { redirect } from "next/navigation";
import { emailVerificationPath, signInPath } from "@/paths";

type GetAuthOrRedirectOptions = {
  checkEmailVerified?: boolean;
};

export const getAuthOrRedirect = async (options?: GetAuthOrRedirectOptions) => {
  const { checkEmailVerified = true } = options ?? {};

  const auth = await getAuth();

  if (!auth.user) {
    redirect(signInPath());
  }

  if (checkEmailVerified && !auth.user.emailVerified) {
    redirect(emailVerificationPath());
  }
  return auth;
};
