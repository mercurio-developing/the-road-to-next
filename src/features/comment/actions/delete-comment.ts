"use server";

import { prisma } from "@/lib/prisma";
import {  ticketPath } from "@/paths";
import { revalidatePath } from "next/cache";
import {
  ActionState,
  fromErrorToActionState,
  toActionState,
} from "@/components/form/utils/to-action-state";
import { getAuthOrRedirect } from "@/features/auth/queries/get-auth-or-redirect";
import { isOwner } from "@/features/auth/utils/is-owner";

export const deleteComment = async (id: string,ticketId:string): Promise<ActionState> => {
  const { user }  = await getAuthOrRedirect();

  try {
    if (!id) {
      const comment = await prisma.comment.findUnique({
        where: {
          id,
        },
      });
      if (!comment || !isOwner(user, comment)) {
        return toActionState("ERROR", "No Authorized");
      }
    }
    await prisma.comment.delete({ where: { id } });
  } catch (error) {
    return fromErrorToActionState(error);
  }
  if (ticketId) revalidatePath(ticketPath(ticketId));

  return toActionState("SUCCESS", "Comment Deleted");
};
{
}
