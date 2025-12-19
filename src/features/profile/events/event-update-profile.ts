import { inngest } from "@/lib/inngest";
import { generateEmailVerificationCode } from "@/features/auth/utils/generate-email-verification-code";
import { prisma } from "@/lib/prisma";
import { sendUpdateEmailVerification } from "@/features/profile/emails/send-update-email-verification";

export type UpdateProfileFunctionArgs = {
  data: {
    userId: string;
    newEmail:string
  };
};

export const updateProfileFunction = inngest.createFunction(
  { id: "update-profile" },
  { event: "app/profile.update-profile" },
  async ({ event, step }) => {
    const { userId,newEmail } = event.data;

    const user = await prisma.user.findUniqueOrThrow({ where: { id: userId } });
    const { id, username } = user;

    await step.run("send-email-verify-account", async () => {
      const verificationCode = await generateEmailVerificationCode(id, newEmail);

      const result = await sendUpdateEmailVerification(
        username,
        newEmail,
        verificationCode,
      );
      if (result.error) {
        throw new Error(`${result.error.name}:${result.error.message}`);
      }
      return { event, body: result };
    });

    return { ok: true };
  },
);
