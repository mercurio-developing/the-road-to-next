import { resend } from "@/lib/resend";
import EmailVerifyAccount from "@/emails/auth/email-verify-account";

export const sendEmailVerifyAccount = async (
  username: string,
  email: string,
  verifyAccountLink: string,
) => {
  return (await resend.emails.send({
    from:"no-reply@ticketbounty.dev",
    to:email,
    subject: "Verify Account",
    react: <EmailVerifyAccount toName={username} url={verifyAccountLink}/>,
  }))
};
