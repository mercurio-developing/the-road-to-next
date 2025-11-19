"use server";

import { TicketStatus } from ".prisma/client";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { ticketsPath } from "@/app/paths";
import {
  fromErrorToActionState,
  toActionState,
} from "@/components/form/utils/to-action-state";

export const updateTicketStatus = async (id: string, status: TicketStatus) => {
  try {
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
