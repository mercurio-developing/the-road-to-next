import { inngest } from "@/lib/inngest";
import { prisma } from "@/lib/prisma";
import { getThisFridayWindow } from "@/features/weekly-report/utils/weekly-window";
import { sendWeeklyDigestEmail } from "@/features/weekly-report/emails/send-weekly-digest";

const TZ = process.env.INNGEST_TZ || "America/Lima";
const HOUR = Number(process.env.INNGEST_WEEKLY_HOUR ?? 0);
const MIN = Number(process.env.INNGEST_WEEKLY_MIN ?? 0);

export const weeklyReportFunction = inngest.createFunction(
  { id: "send-weekly-report" },
  { cron: `TZ=${TZ} ${MIN} ${HOUR} * * 5` },
  async ({ step }) => {
    const result = await step.run("generate-weekly-digest", async () => {
      const { startUtc, endUtc } = getThisFridayWindow();

      const [usersCount, commentsCount] = await Promise.all([
        prisma.user.count({
          where: { createdAt: { gte: startUtc, lt: endUtc } },
        }),
        prisma.comment.count({
          where: { createdAt: { gte: startUtc, lt: endUtc } },
        }),
      ]);

      await sendWeeklyDigestEmail(
        "orqodev@gmail.com",
        usersCount,
        commentsCount,
        startUtc,
        endUtc,
      );

      return {
        window: { startUtc, endUtc },
        counts: { users: usersCount, comments: commentsCount },
      };
    });
    return { ok: true, ...result };
  },
);
