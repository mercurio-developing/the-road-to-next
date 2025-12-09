"use server";

import { redirect } from "next/navigation";
import { setCookieByKey } from "@/actions/cookies";
import {
  ActionState,
  fromErrorToActionState,
  toActionState,
} from "@/components/form/utils/to-action-state";
import { prisma } from "@/lib/prisma";
import { ticketsPath } from "@/paths";
import { createNewSession } from "@/lib/lucia";

export const verifyAccount = async (
  tokenId: string,
  _actionState: ActionState,
  formData: FormData,
) => {
  try {
    const emailVerificationToken =
      await prisma.emailVerificationToken.findUnique({
        where: {
          id: tokenId,
        },
      });

    if (!emailVerificationToken) {
      return toActionState("ERROR", "The verification code expired", formData);
    }

    const user = await prisma.user.update({
      where: {
        id: emailVerificationToken.userId,
      },
      data: {
        emailVerified: true,
      },
    });

    await createNewSession(user.id);
  } catch (error) {
    return fromErrorToActionState(error, formData);
  }

  await setCookieByKey("toast", "Successfully Verify Account");
  redirect(ticketsPath());
};
