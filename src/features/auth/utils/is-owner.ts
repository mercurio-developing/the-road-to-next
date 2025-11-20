import { User as AuthUser } from "lucia";

type Entity = {
  userId: string | null;
};

export const isOwner = (
  user: AuthUser | null | undefined,
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
