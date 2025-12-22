"use server";

import {
  ActionState,
  fromErrorToActionState,
  toActionState,
} from "@/components/form/utils/to-action-state";
import { inngest } from "@/lib/inngest";
import { getAuthOrRedirect } from "@/features/auth/queries/get-auth-or-redirect";
import { z } from "zod";

const sendProfileEmailVerificationSchema = z.object({
  email: z.email().min(1, { message: "Is Required" }).max(191),
});

export const sendEmailVerificationCode = async (
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> => {
  try {
    const { user } = await getAuthOrRedirect({ checkEmailVerified: false });

    const { email } = sendProfileEmailVerificationSchema.parse(
      Object.fromEntries(formData),
    );

    if (email === user.email) {
      return toActionState("ERROR", "Email is the same as your current email");
    }

    await inngest.send({
      name: "app/profile.update-profile",
      data: {
        userId: user.id,
        newEmail: email,
      },
    });

    return toActionState(
      "SUCCESS",
      "Verification code sent to your new email address",
      formData,
    );
  } catch (error) {
    return fromErrorToActionState(error, formData);
  }
};
