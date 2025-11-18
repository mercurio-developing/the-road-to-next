"use server";

import { prisma } from "@/lib/prisma";
import { ticketsPath } from "@/app/paths";
import { redirect } from "next/navigation";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import {
  ActionState,
  fromErrorToActionState,
  toActionState,
} from "@/components/form/utils/to-action-state";
import { setCookieByKey } from "@/actions/cookies";

const upserTicketSchema = z.object({
  title: z.string().min(1).max(191),
  content: z.string().min(1).max(1024),
});

export const upsertTicket = async (
  id: string | undefined,
  _actionState: ActionState,
  formData: FormData,
) => {
  try {
    const data = upserTicketSchema.parse({
      title: formData.get("title") as string,
      content: formData.get("content") as string,
    });

    await prisma.ticket.upsert({
      where: { id: id || "" },
      update: data,
      create: data,
    });
  } catch (error) {
    return fromErrorToActionState(error, formData);
  }

  revalidatePath(ticketsPath());
  if (id) {
    await setCookieByKey("toast","Ticket Updated")
    redirect(ticketsPath());
  }

  return toActionState("SUCCESS","Ticket Created");
};
