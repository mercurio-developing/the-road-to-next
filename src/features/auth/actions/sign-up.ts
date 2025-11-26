"use server";

import { hash } from "@node-rs/argon2";
import { z } from "zod";
import {
  ActionState,
  fromErrorToActionState,
} from "@/components/form/utils/to-action-state";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { lucia } from "@/lib/lucia";
import { setCookieByKey } from "@/actions/cookies";
import { ticketsPath } from "@/app/paths";
import { redirect } from "next/navigation";

const signUpSchema = z
  .object({
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
    password: z.string().min(6).max(191),
    confirmPassword: z.string().min(6).max(191),
  })
  .superRefine(({ password, confirmPassword }, ctx) => {
    if (password !== confirmPassword) {
      ctx.addIssue({
        code: "custom",
        message: "Passwords do not match",
        path: ["confirmPassword"],
      });
    }
  });

export const signUp = async (_actionState: ActionState, formData: FormData) => {
  console.log("formData")
  try {
    const { username, email, password, firstName, lastName } = signUpSchema.parse(Object.fromEntries(formData));

    const passwordHash = await hash(password);
    console.log(passwordHash)

    const user = await prisma.user.create({
      data: {
        firstName,
        lastName,
        username,
        email,
        passwordHash,
      },
    });
    console.log(user)

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
    console.log(error)
    return fromErrorToActionState(error, formData);
  }
  await setCookieByKey("toast", "Sign up successful");
  redirect(ticketsPath())
};
