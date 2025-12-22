"use server";

import { z } from "zod";
import {
  ActionState,
  fromErrorToActionState,
  toActionState,
} from "@/components/form/utils/to-action-state";
import { getAuthOrRedirect } from "@/features/auth/queries/get-auth-or-redirect";
import { validateEmailVerificationCode } from "@/features/auth/utils/validate-email-verification-code";
import { prisma } from "@/lib/prisma";

const verifyEmailCodeSchema = z.object({
  email: z.email(),
  code: z.string().length(8),
});

export const verifyEmailCode = async (
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> => {
  try {
    const { user } = await getAuthOrRedirect({ checkEmailVerified: false });

    const { email, code } = await verifyEmailCodeSchema.parseAsync(
      Object.fromEntries(formData),
    );

    const validCode = await validateEmailVerificationCode(
      user.id,
      email,
      code,
    );

    if (!validCode) {
      return toActionState(
        "ERROR",
        "Invalid or expired verification code",
        formData,
      );
    }

    // Mark email as verified - this allows updateProfile to confirm verification
    await prisma.emailVerificationToken.updateMany({
      where: {
        userId: user.id,
        email,
        code,
      },
      data: {
        verifiedAt: new Date(),
      },
    });

    return toActionState("SUCCESS", "Email verified successfully", formData);
  } catch (error) {
    return fromErrorToActionState(error, formData);
  }
};
