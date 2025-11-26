import { prisma } from "@/lib/prisma";
import { getAuth } from "@/features/auth/queries/get-auth";
import { isOwner } from "@/features/auth/utils/is-owner";

export const getComment = async (commentId: string) => {
  const { user } = await getAuth();

  const comment = await prisma.comment.findUnique({
    where: { id: commentId },
    include: {
      user: { select: { username: true, firstName: true, lastName: true } },
      ticket: { select: { title: true } },
    },
  });
  if (!comment) {
    return null;
  }
  return { ...comment, isOwner: isOwner(user, comment) };
};
