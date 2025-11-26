"use server"

import {
  ActionState,
  fromErrorToActionState,
  toActionState,
} from "@/components/form/utils/to-action-state";
import { getAuthOrRedirect } from "@/features/auth/queries/get-auth-or-redirect";
import { signInPath, ticketPath} from "@/app/paths";
import { prisma } from "@/lib/prisma";
import { isOwner } from "@/features/auth/utils/is-owner";
import { z } from "zod";
import { getTicket } from "@/features/ticket/queries/get-ticket";
import { revalidatePath } from "next/cache";


const upsertComentSchema = z.object({
  content: z.string().min(1).max(1024),
});

export const upsertComment = async (
  id: string | undefined,
  _actionState: ActionState,
  formData: FormData,
) => {
  const { user } = await getAuthOrRedirect(signInPath());

  const ticketId = formData.get("ticketId")?.toString();


  const ticket = ticketId && (await getTicket(ticketId));

  try {
    if (id) {
      const comment = await prisma.comment.findUnique({
        where: { id },
      });
      if (!comment || !isOwner(user, comment)) {
        return toActionState("ERROR", "No Authorized");
      }
    }
    const data = upsertComentSchema.parse({
      content: formData.get("content"),
    });

    if (user && ticket) {
      const dbData = {
        ...data,
        userId: user.id,
        ticketId: ticket.id,
      };

      await prisma.comment.upsert({
        where: { id: id || "" },
        update: dbData,
        create: dbData,
      });
    }
  } catch (error) {
    return fromErrorToActionState(error, formData);
  }
  if (ticketId) revalidatePath(ticketPath(ticketId));
  if (id) {
    return toActionState("SUCCESS", "Comment Updated");
  }
  return toActionState("SUCCESS", "Comment Created");
};
