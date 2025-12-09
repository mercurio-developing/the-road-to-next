import { serve } from "inngest/next";
import { inngest } from "@/lib/inngest";
import { passwordResetFunction } from "@/features/password/events/event-password-reset";
import { signupWelcomeFunction } from "@/features/auth/events/event-signup";
import { weeklyReportFunction } from "@/features/weekly-report/events/event-weekly-report";
import { emailVerificationFunction } from "@/features/auth/events/email-verification-account";

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [
    passwordResetFunction,
    emailVerificationFunction,
    signupWelcomeFunction,
    weeklyReportFunction,
  ],
});
