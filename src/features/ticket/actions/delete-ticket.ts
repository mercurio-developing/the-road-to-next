"use server";

import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { ticketsPath } from "@/app/paths";
import { revalidatePath } from "next/cache";
import { setCookieByKey } from "@/actions/cookies";
import {
  ActionState,
  fromErrorToActionState,
} from "@/components/form/utils/to-action-state";

export const deleteTicket = async (id: string): Promise<ActionState> => {
  try {
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
