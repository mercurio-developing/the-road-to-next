"use server";

import { prisma } from "@/lib/prisma";
import { signInPath, ticketsPath } from "@/paths";
import { redirect } from "next/navigation";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import {
  ActionState,
  fromErrorToActionState,
  toActionState,
} from "@/components/form/utils/to-action-state";
import { setCookieByKey } from "@/actions/cookies";
import { toCent } from "@/utils/currency";
import { getAuthOrRedirect } from "@/features/auth/queries/get-auth-or-redirect";
import { isOwner } from "@/features/auth/utils/is-owner";

const upserTicketSchema = z.object({
  title: z.string().min(1).max(191),
  content: z.string().min(1).max(1024),
  deadline: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Is required"),
  bounty: z.coerce.number().positive("Must be greater than 0"),
});

export const upsertTicket = async (
  id: string | undefined,
  _actionState: ActionState,
  formData: FormData,
) => {
  const { user } = await getAuthOrRedirect(signInPath());

  try {
    if (id) {
      const ticket = await prisma.ticket.findUnique({
        where: {
          id,
        },
      });
      if (!ticket || !isOwner(user, ticket)) {
        return toActionState("ERROR", "No Authorized");
      }
    }

    const data = upserTicketSchema.parse({
      title: formData.get("title"),
      content: formData.get("content"),
      deadline: formData.get("deadline"),
      bounty: formData.get("bounty"),
    });

    if (user) {
      const dbData = {
        ...data,
        bounty: toCent(data.bounty),
        userId: user.id,
      };
      await prisma.ticket.upsert({
        where: { id: id || "" },
        update: dbData,
        create: dbData,
      });
    }
  } catch (error) {
    return fromErrorToActionState(error, formData);
  }

  revalidatePath(ticketsPath());
  if (id) {
    await setCookieByKey("toast", "Ticket Updated");
    redirect(ticketsPath());
  }

  return toActionState("SUCCESS", "Ticket Created");
};
