"use server";

import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { ticketsPath } from "@/app/paths";
import { revalidatePath } from "next/cache";
import { setCookieByKey } from "@/actions/cookies";

export const deleteTicket = async (id: string) => {
  await prisma.ticket.delete({ where: { id } });

  await setCookieByKey("toast","Ticket Deleted")
  revalidatePath(ticketsPath());
  redirect(ticketsPath());
};
