import { getBaseUrl } from "@/utils/url";
import { verifyAccountPath } from "@/paths";
import { generateRandomToken, hashToken } from "@/utils/crypto";
import { prisma } from "@/lib/prisma";

const EMAIL_VERIFICATION_TOKEN_LIFETIME_MS = 1000 * 60 * 60 * 2// 2hrs

export const generateEmailVerificationLink = async (userId:string,email:string)=>{

  await prisma.emailVerificationToken.deleteMany({
    where:{
      userId
    }
  })

  const tokenId = generateRandomToken();
  const code = hashToken(tokenId)

  await prisma.emailVerificationToken.create({
    data:{
      userId,
      code,
      email,
      expiresAt: new Date(Date.now() + EMAIL_VERIFICATION_TOKEN_LIFETIME_MS)
    }
  })

  const pageUrl = getBaseUrl() + verifyAccountPath()

  return pageUrl + `/${tokenId}`
}