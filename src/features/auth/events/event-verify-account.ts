import { inngest } from "@/lib/inngest";
import { sendEmailWelcome } from "@/features/auth/emails/send-email-welcome";
import { signInPath } from "@/paths";
import { sendEmailVerifyAccount } from "@/features/auth/emails/send-email-verify-account";
import { generateEmailVerificationLink } from "@/features/auth/utils/generate-verification-token-link";

export type VerifyAccountFunctionArgs = {
  data: {
    user: {
      firstName: string;
      lastName: string;
      username: string;
      email: string;
      userId: string;
    };
  };
};

export const verifyAccountFunction = inngest.createFunction(
  { id: "send-verify-account" },
  { event: "app/signup.verify-account" },
  async ({ event, step }) => {
    await step.run("send-email-verify-account", async () => {
      const { email, username, userId } = event.data.user;

      const emailVerificationLink = await generateEmailVerificationLink(
        userId,
        email,
      );

      const result = await sendEmailVerifyAccount(
        username,
        email,
        emailVerificationLink,
      );
      if (result.error) {
        throw new Error(`${result.error.name}:${result.error.message}`);
      }
      return { event, body: result };
    });

    await step.run("send-signup-welcome", async () => {
      const { firstName, lastName, email } = event.data.user;

      const appBaseUrl =
        process.env.NEXT_PUBLIC_APP_URL ||
        process.env.APP_URL ||
        "http://localhost:3000";

      const loginUrl = `${appBaseUrl}${signInPath()}`;

      const toName = `${firstName} ${lastName}`.trim();

      const result = await sendEmailWelcome(toName, email, loginUrl);

      if (result.error) {
        throw new Error(`${result.error.name}:${result.error.message}`);
      }
      return { event, body: result };
    });
    return { ok: true };
  },
);
