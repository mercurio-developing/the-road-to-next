import { EventSchemas, Inngest } from "inngest";
import { PasswordResetFunctionArgs } from "@/features/password/events/event-password-reset";
import { SignupWelcomeFunctionArgs } from "@/features/auth/events/event-signup";
import { VerifyAccountFunctionArgs } from "@/features/auth/events/event-verify-account";

type Events = {
  "app/password.password-reset":PasswordResetFunctionArgs,
  "app/signup.signup-welcome": SignupWelcomeFunctionArgs,
  "app/signup.verify-account": VerifyAccountFunctionArgs,
}

export const inngest = new Inngest({
  id:'the-road-to-next',
  schemas: new EventSchemas().fromRecord<Events>(),
})