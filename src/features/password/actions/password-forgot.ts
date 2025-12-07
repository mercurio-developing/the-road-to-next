"use server";

import {
  ActionState,
  fromErrorToActionState,
  toActionState,
} from "@/components/form/utils/to-action-state";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { User } from ".prisma/client";
import { generatePasswordResetLink } from "@/features/password/utils/generate-password-reset-link";
import { sendEmailPasswordReset } from "@/features/password/emails/send-email-password-reset";

const passwordForgotSchema = z.object({
  email: z.email().min(1, { message: "Is required" }).max(191),
});

export const passwordForgot = async (
  _actionState: ActionState,
  formData: FormData,
) => {
  try {
    const { email } = passwordForgotSchema.parse(Object.fromEntries(formData));
    const user: User | null = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      return toActionState("ERROR", "Incorrect email", formData);
    }

    const passwordResetLink = await generatePasswordResetLink(user.id)

    await sendEmailPasswordReset(user.username,user.email,passwordResetLink)

  } catch (error) {
    return fromErrorToActionState(error, formData);
  }

  return toActionState("SUCCESS", "Check your email for a reset link");
};
