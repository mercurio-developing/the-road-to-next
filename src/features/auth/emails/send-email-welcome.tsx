import EmailWelcome from "@/emails/auth/email-welcome";
import { resend } from "@/lib/resend";

export const sendEmailWelcome = async (
  toName: string,
  email: string,
  loginUrl: string,
) => {
  return await resend.emails.send({
    from: "no-reply@ticketbounty.dev",
    to: email,
    subject: "Welcome to TicketBounty",
    react: <EmailWelcome toName={toName} loginUrl={loginUrl} />,
  });
};
