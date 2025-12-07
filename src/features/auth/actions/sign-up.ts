"use server";

import { z } from "zod";
import {
  ActionState,
  fromErrorToActionState,
} from "@/components/form/utils/to-action-state";
import { prisma } from "@/lib/prisma";
import { setCookieByKey } from "@/actions/cookies";
import { signInPath, ticketsPath } from "@/paths";
import { redirect } from "next/navigation";
import { generateRandomToken } from "@/utils/crypto";
import { setSessionCookie } from "../utils/session-cookie";
import { createSession } from "@/lib/lucia";
import { hashPassword } from "@/features/password/utils/hash-and-verify";
import { sendEmailWelcome } from "@/features/auth/emails/send-email-welcome";

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
  try {
    const { username, email, password, firstName, lastName } = signUpSchema.parse(Object.fromEntries(formData));

    const passwordHash = await hashPassword(password);
    const user = await prisma.user.create({
      data: {
        firstName,
        lastName,
        username,
        email,
        passwordHash,
      },
    });

    const sessionToken = generateRandomToken();
    const session = await createSession(sessionToken, user.id);

    await setSessionCookie(sessionToken, session.expiresAt);

    const appBaseUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.APP_URL || "http://localhost:3000";
    const loginUrl = `${appBaseUrl}${signInPath()}`;
    const toName = `${firstName} ${lastName}`.trim();
    await sendEmailWelcome(toName, email, loginUrl);

  } catch (error) {
    return fromErrorToActionState(error, formData);
  }
  await setCookieByKey("toast", "Sign up successful");
  redirect(ticketsPath())
};
