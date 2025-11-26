import { prisma } from "@/lib/prisma";
import { isOwner } from "@/features/auth/utils/is-owner";
import { getAuth } from "@/features/auth/queries/get-auth";
import { CommentWithMetadata } from "@/features/comment/types";

export const getComments = async (
  ticketId: string | undefined
): Promise<CommentWithMetadata[]> => {
  const { user } = await getAuth();

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

  return comments.map((comment) => ({
    ...comment,
    isOwner: isOwner(user, comment)
  }));
};
