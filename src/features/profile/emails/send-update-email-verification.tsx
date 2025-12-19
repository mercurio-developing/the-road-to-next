import { resend } from "@/lib/resend";
import EmailVerification from "@/emails/auth/email-verification";

export const sendUpdateEmailVerification = async (
  username: string,
  email: string,
  code: string,
) => {
  return (await resend.emails.send({
    from:"no-reply@ticketbounty.dev",
    to:email,
    subject: "Update Email Verification from TicketBounty",
    react: <EmailVerification toName={username} code={code}/>,
  }))
};
