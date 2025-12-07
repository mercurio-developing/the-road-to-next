"use server";

import {
  ActionState,
  fromErrorToActionState,
  toActionState,
} from "@/components/form/utils/to-action-state";
import { z } from "zod";
import { ticketsPath } from "@/paths";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { User } from ".prisma/client";
import { createNewSession } from "@/lib/lucia";
import { verifyPasswordHash } from "@/features/password/utils/hash-and-verify";

const signInSchema = z.object({
  email: z.email().min(1, { message: "Is required" }).max(191),
  password: z.string().min(6).max(191),
});

export const signIn = async (_actionState: ActionState, formData: FormData) => {
  try {
    const { email, password } = signInSchema.parse(
      Object.fromEntries(formData),
    );
    const user: User | null = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      return toActionState("ERROR", "Incorrect email or password", formData);
    }

    const validPassword = await verifyPasswordHash(user.passwordHash, password);

    if (!validPassword) {
      return toActionState("ERROR", "Incorrect email or password", formData);
    }

    await createNewSession(user.id)

  } catch (error) {
    return fromErrorToActionState(error, formData);
  }

  redirect(ticketsPath());
};
