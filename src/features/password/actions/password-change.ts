"use server";

import {
  ActionState,
  fromErrorToActionState,
  toActionState,
} from "@/components/form/utils/to-action-state";
import { z } from "zod";
import { getAuthOrRedirect } from "@/features/auth/queries/get-auth-or-redirect";
import {
  hashPassword,
  verifyPasswordHash,
} from "@/features/password/utils/hash-and-verify";
import { prisma } from "@/lib/prisma";
import { createNewSession} from "@/lib/lucia";

const passwordChangeSchema = z
  .object({
    password: z.string().min(6).max(191),
    newPassword: z.string().min(6).max(191),
    confirmNewPassword: z.string().min(6).max(191),
  })
  .superRefine(({ newPassword, confirmNewPassword }, ctx) => {
    if (newPassword !== confirmNewPassword) {
      ctx.addIssue({
        code: "custom",
        message: "Passwords do not match",
        path: ["confirmNewPassword"],
      });
    }
  });

export const passwordChange = async (
  _actionState: ActionState,
  formData: FormData,
) => {
  try {
    const auth = await getAuthOrRedirect();

    const { password, newPassword } = passwordChangeSchema.parse(
      Object.fromEntries(formData),
    );

    const validPassword = await verifyPasswordHash(
      auth.user.passwordHash,
      password,
    );

    if (!validPassword) {
      return toActionState("ERROR", "Incorrect Password", formData);
    }

    if (newPassword === password) {
      return toActionState(
        "ERROR",
        "You’ve already used this password. Please choose a new one to keep your account secure.",
        formData,
      );
    }

    await prisma.session.deleteMany({
      where: {
        userId: auth.user.id,
      },
    });

    const passwordHash = await hashPassword(newPassword);

    const user = await prisma.user.update({
      where: {
        id: auth.user.id,
      },
      data: {
        passwordHash,
      },
    });

    await createNewSession(user.id);
  } catch (error) {
    return fromErrorToActionState(error, formData);
  }

  return toActionState("SUCCESS", "Password updated successfully");
};
