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
import { z } from "zod";
import { getAuthOrRedirect } from "@/features/auth/queries/get-auth-or-redirect";
import { validateEmailVerificationCode } from "@/features/auth/utils/validate-email-verification-code";

const emailVerificationSchema = z.object({
  code: z.string().length(8),
});

export const emailVerification = async (
  _actionState: ActionState,
  formData: FormData,
) => {
  const { user } = await getAuthOrRedirect({
    checkEmailVerified: false,
  });

  try {
    const { code } = emailVerificationSchema.parse(
      Object.fromEntries(formData),
    );

    const validCode = await validateEmailVerificationCode(
      user.id,
      user.email,
      code,
    );

    if (!validCode) {
      return toActionState("ERROR", "Invalid or expired code", formData);
    }

    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        emailVerified: true,
      },
    });

    await prisma.session.deleteMany({
      where: {
        userId: user.id,
      },
    });

    await createNewSession(user.id);
  } catch (error) {
    return fromErrorToActionState(error, formData);
  }
  await setCookieByKey("toast", "Email verified");
  redirect(ticketsPath());
};
