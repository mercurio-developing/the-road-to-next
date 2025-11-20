"use server";

import {
  ActionState,
  fromErrorToActionState,
  toActionState,
} from "@/components/form/utils/to-action-state";
import { z } from "zod";
import { ticketsPath } from "@/app/paths";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { verify } from "@node-rs/argon2";
import { User } from ".prisma/client";
import { lucia } from "@/lib/lucia";
import { cookies } from "next/headers";

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

    const validPassword = await verify(user.passwordHash, password);

    if (!validPassword) {
      return toActionState("ERROR", "Incorrect email or password", formData);
    }

    const session = await lucia.createSession(user.id, {});
    const sessionCookie = lucia.createSessionCookie(session.id);
    if (sessionCookie) {
      (await cookies()).set(
        sessionCookie.name,
        sessionCookie.value,
        sessionCookie.attributes,
      );
    }
  } catch (error) {
    return fromErrorToActionState(error,formData);
  }
  redirect(ticketsPath());
};
