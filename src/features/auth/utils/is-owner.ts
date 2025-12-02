import { User } from ".prisma/client";

type Entity = {
  userId: string | null;
};

export const isOwner = (
  user: User | null | undefined,
  entity: Entity | null | undefined,
) => {
  if (!entity || !user) {
    return false;
  }

  if (!entity.userId) {
    return false;
  }

  if (user.id !== entity.userId) {
    return false;
  } else {
    return true;
  }
};
