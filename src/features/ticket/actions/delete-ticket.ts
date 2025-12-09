"use server";

import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import {  ticketsPath } from "@/paths";
import { revalidatePath } from "next/cache";
import { setCookieByKey } from "@/actions/cookies";
import {
  ActionState,
  fromErrorToActionState,
  toActionState,
} from "@/components/form/utils/to-action-state";
import { getAuthOrRedirect } from "@/features/auth/queries/get-auth-or-redirect";
import { isOwner } from "@/features/auth/utils/is-owner";

export const deleteTicket = async (id: string): Promise<ActionState> => {
  const { user }  = await getAuthOrRedirect();

  try {
    if (!id) {
      const ticket = await prisma.ticket.findUnique({
        where: {
          id,
        },
      });
      if (!ticket || !isOwner(user, ticket)) {
        return toActionState("ERROR", "No Authorized");
      }
    }
    await prisma.ticket.delete({ where: { id } });
  } catch (error) {
    return fromErrorToActionState(error);
  }

  revalidatePath(ticketsPath());
  await setCookieByKey("toast", "Ticket Deleted");
  redirect(ticketsPath());
};
{
}
