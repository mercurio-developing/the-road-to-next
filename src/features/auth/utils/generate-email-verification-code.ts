import { generateRandomCode } from "@/utils/crypto";
import { prisma } from "@/lib/prisma";

const EMAIL_VERIFICATION_TOKEN_LIFETIME_MS = 1000 * 60 * 60 * 2; // 2hrs

export const generateEmailVerificationCode = async (
  userId: string,
  email: string,
) => {
  await prisma.emailVerificationToken.deleteMany({
    where: {
      userId,
    },
  });

  const code = generateRandomCode();

  await prisma.emailVerificationToken.create({
    data: {
      userId,
      code,
      email,
      expiresAt: new Date(Date.now() + EMAIL_VERIFICATION_TOKEN_LIFETIME_MS),
    },
  });
  return code;
};
