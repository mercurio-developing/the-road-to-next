"use server";

import { TicketStatus } from ".prisma/client";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { signInPath, ticketsPath } from "@/paths";
import {
  fromErrorToActionState,
  toActionState,
} from "@/components/form/utils/to-action-state";
import { getAuthOrRedirect } from "@/features/auth/queries/get-auth-or-redirect";
import { isOwner } from "@/features/auth/utils/is-owner";

export const updateTicketStatus = async (id: string, status: TicketStatus) => {
  const { user }  = await getAuthOrRedirect(signInPath());

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
    await prisma.ticket.update({
      where: {
        id,
      },
      data: { status },
    });
  } catch (error) {
    return fromErrorToActionState(error);
  }

  revalidatePath(ticketsPath());
  return toActionState("SUCCESS", "Status Updated");
};
