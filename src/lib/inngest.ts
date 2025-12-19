import { EventSchemas, Inngest } from "inngest";
import { PasswordResetFunctionArgs } from "@/features/password/events/event-password-reset";
import { SignupWelcomeFunctionArgs } from "@/features/auth/events/event-signup";
import { EmailVerificationFunctionArgs } from "@/features/auth/events/event-email-verification";
import { UpdateProfileFunctionArgs } from "@/features/profile/events/event-update-profile";

type Events = {
  "app/password.password-reset":PasswordResetFunctionArgs,
  "app/signup.signup-welcome": SignupWelcomeFunctionArgs,
  "app/auth.signup": EmailVerificationFunctionArgs,
  "app/profile.update-profile":UpdateProfileFunctionArgs,
}

export const inngest = new Inngest({
  id:'the-road-to-next',
  schemas: new EventSchemas().fromRecord<Events>(),
})