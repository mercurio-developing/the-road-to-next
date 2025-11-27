"use server";

import { prisma } from "@/lib/prisma";
import { isOwner } from "@/features/auth/utils/is-owner";
import { getAuth } from "@/features/auth/queries/get-auth";
import { CommentsWithMetadata } from "@/features/comment/types";

export const getComments = async (
  ticketId: string | undefined,
  cursor?: { id: string; createdAt: number },
): Promise<CommentsWithMetadata> => {
  const { user } = await getAuth();

  const where = {
    ticketId,
  };

  const take = 2;

  // eslint-disable-next-line prefer-const
  let [comments, count] = await prisma.$transaction([
    prisma.comment.findMany({
      where,
      take: take + 1,
      skip: cursor ? 1 :0,
      cursor: cursor
        ? { createdAt: new Date(cursor.createdAt), id: cursor.id }
        : undefined,
      include: {
        user: { select: { username: true, firstName: true, lastName: true } },
      },
      orderBy: [
        { createdAt: "desc" },
        {
          id: "desc",
        },
      ],
    }),
    prisma.comment.count({ where }),
  ]);

  const lastComment = comments.at(-1);
  const hasNextPage = comments.length > take

  comments = hasNextPage ? comments.slice(0,-1) : comments;
  return {
    list: comments.map((comment) => ({
      ...comment,
      isOwner: isOwner(user, comment),
    })),
    metadata: {
      count,
      hasNextPage,
      cursor: lastComment
        ? {
            id: lastComment.id,
            createdAt: lastComment.createdAt.valueOf(),
          }
        : undefined,
    },
  };
};
