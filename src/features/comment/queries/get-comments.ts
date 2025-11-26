import { prisma } from "@/lib/prisma";

export const getComments = async (ticketId: string | undefined) => {
  const where = {
    ticketId,
  };

  const comments = await prisma.comment.findMany({
    where,
    include: {
      user: { select: { username: true, firstName: true, lastName: true } },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return comments;
};
