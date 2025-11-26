import { Prisma } from ".prisma/client";

export type CommentsWithMetadata = Prisma.CommentGetPayload<{
  include: {
    user: { select: { username: true; firstName: true; lastName: true } };
  };
}>;
