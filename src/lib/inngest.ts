import { EventSchemas, Inngest } from "inngest";
import { PasswordResetFunctionArgs } from "@/features/password/events/event-password-reset";
import { SignupWelcomeFunctionArgs } from "@/features/auth/events/event-signup";

type Events = {
  "app/password.password-reset":PasswordResetFunctionArgs,
  "app/signup.signup-welcome": SignupWelcomeFunctionArgs,
}

export const inngest = new Inngest({
  id:'the-road-to-next',
  schemas: new EventSchemas().fromRecord<Events>(),
})