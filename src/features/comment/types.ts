import { Prisma } from ".prisma/client";

export type CommentWithMetadata = Prisma.CommentGetPayload<{
  include: {
    user: { select: { username: true; firstName: true; lastName: true } };
  };
}> & { isOwner: boolean };
