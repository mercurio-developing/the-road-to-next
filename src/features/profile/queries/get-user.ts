import { prisma } from "@/lib/prisma";
import { getAuth } from "@/features/auth/queries/get-auth";
import { getAuthOrRedirect } from "@/features/auth/queries/get-auth-or-redirect";

export const getUser = async () => {
  const { user } = await getAuth();

  if (!user) {
    return null;
  }
  const result = await prisma.user.findUniqueOrThrow({
    where: { id: user.id },
  });
  if (!result) {
    return null;
  }
  return { ...result };
};
