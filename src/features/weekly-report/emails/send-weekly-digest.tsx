import { Resend } from "resend";
import EmailWeeklyDigest from "@/emails/weekly-report/email-weekly-digest";
import { format } from "date-fns";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendWeeklyDigestEmail = async (
  email: string,
  usersCount: number,
  ticketsCount: number,
  periodStartUtc: string | Date,
  periodEndUtc: string | Date,
) => {
  return await resend.emails.send({
    from: "no-reply@ticketbounty.dev",
    to: email,
    subject: `Weekly report from ${format(periodStartUtc, "yyyy-MM-dd")} to ${format(periodEndUtc, "yyyy-MM-dd")}`,
    react: (
      <EmailWeeklyDigest
        usersCount={usersCount}
        ticketsCount={ticketsCount}
        periodStartUtc={periodStartUtc}
        periodEndUtc={periodEndUtc}
      />
    ),
  });
};
