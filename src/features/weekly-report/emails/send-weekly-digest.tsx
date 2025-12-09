import { Resend } from "resend";
import EmailWeeklyDigest from "@/emails/weekly-report/email-weekly-digest";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendWeeklyDigestEmail = async (
  email: string,
  usersCount: number,
  commentsCount: number,
  periodStartUtc: string | Date,
  periodEndUtc: string | Date,
) => {
  return await resend.emails.send({
    from: "no-reply@ticketbounty.dev",
    to: email,
    subject: `Weekly report: ${usersCount} users, ${commentsCount} comments`,
    react: (
      <EmailWeeklyDigest
        usersCount={usersCount}
        commentsCount={commentsCount}
        periodStartUtc={periodStartUtc}
        periodEndUtc={periodEndUtc}
      />
    ),
  });
};
