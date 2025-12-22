"use server";

import { z } from "zod";
import {
  ActionState,
  fromErrorToActionState,
  toActionState,
} from "@/components/form/utils/to-action-state";
import { prisma } from "@/lib/prisma";
import { setCookieByKey } from "@/actions/cookies";
import { Prisma } from ".prisma/client";
import { getAuthOrRedirect } from "@/features/auth/queries/get-auth-or-redirect";

// Schema for updating profile
const updateProfileSchema = z.object({
  firstName: z.string().min(1).max(191),
  lastName: z.string().min(1).max(191),
  username: z
    .string()
    .min(1)
    .max(191)
    .refine(
      (value) => !value.includes(" "),
      "Username cannot contain spaces",
    ),
  email: z.email().min(1, { message: "Is Required" }).max(191),
});

export const updateProfile = async (
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> => {
  const { user } = await getAuthOrRedirect({ checkEmailVerified: false });

  try {
    const { username, email, firstName, lastName } =
      await updateProfileSchema.parseAsync(Object.fromEntries(formData));

    const emailChanged = email !== user.email;

    // If email changed, verify that it was verified through the dialog
    if (emailChanged) {
      // Check for a recently verified email token (within last 5 minutes)
      const verifiedToken = await prisma.emailVerificationToken.findFirst({
        where: {
          userId: user.id,
          email,
          verifiedAt: {
            not: null,
            gte: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes
          },
        },
      });

      if (!verifiedToken) {
        return toActionState(
          "ERROR",
          "Email must be verified before updating. Please use the verification dialog.",
          formData,
        );
      }

      // Delete the used token
      await prisma.emailVerificationToken.delete({
        where: {
          id: verifiedToken.id,
        },
      });
    }

    // Update profile
    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        firstName,
        lastName,
        username,
        email,
      },
    });

    await setCookieByKey("toast", "Profile updated successfully");

    return toActionState("SUCCESS", "Profile updated successfully", formData);
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return toActionState(
        "ERROR",
        "Either email or username is already in use",
        formData,
      );
    }

    return fromErrorToActionState(error, formData);
  }
};
