"use server";

import { z } from "zod";
import {
  ActionState,
  fromErrorToActionState,
  toActionState,
} from "@/components/form/utils/to-action-state";
import { prisma } from "@/lib/prisma";
import { setCookieByKey } from "@/actions/cookies";
import { ticketsPath } from "@/paths";
import { redirect } from "next/navigation";
import { generateRandomToken } from "@/utils/crypto";
import { setSessionCookie } from "../utils/session-cookie";
import { createSession } from "@/lib/lucia";
import { hashPassword } from "@/features/password/utils/hash-and-verify";
import { inngest } from "@/lib/inngest";
import { Prisma } from ".prisma/client";
import { generateEmailVerificationCode } from "@/features/auth/utils/generate-email-verification-code";

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
    const { username, email, password, firstName, lastName } =
      signUpSchema.parse(Object.fromEntries(formData));

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

    const verificationCode = await generateEmailVerificationCode(
      user.id,
      user.email,
    );

    const sessionToken = generateRandomToken();
    const session = await createSession(sessionToken, user.id);

    await setSessionCookie(sessionToken, session.expiresAt);

    await inngest.send({
      name: "app/signup.email-verification",
      data: {
        code: verificationCode,
        user: {
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          userId: user.id,
          username: user.username,
        },
      },
    });
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
  await setCookieByKey("toast", "Sign up successful");
  redirect(ticketsPath());
};
