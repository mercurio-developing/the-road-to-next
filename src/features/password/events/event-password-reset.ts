import { inngest } from "@/lib/inngest";
import { generatePasswordResetLink } from "@/features/password/utils/generate-password-reset-link";
import { sendEmailPasswordReset } from "@/features/password/emails/send-email-password-reset";
import { User } from ".prisma/client";
import { prisma } from "@/lib/prisma";

export type PasswordResetFunctionArgs = {
  data:{
    userId:string;
  }
}

export const passwordResetFunction = inngest.createFunction(
  {
    id: "send-password-reset",
  },
  { event: "app/password.password-reset" },
  async ({ event }) => {
    const { userId } = event.data;
    const user: User = await prisma.user.findUniqueOrThrow({
      where: {
        id: userId,
      },
    });

    const passwordResetLink = await generatePasswordResetLink(user.id)

    const result = await sendEmailPasswordReset(user.username,user.email,passwordResetLink)

    if (result.error){
      throw new Error(`${result.error.name}: ${result.error.message}`)
    }

    return { event, body: result };
  },
);
