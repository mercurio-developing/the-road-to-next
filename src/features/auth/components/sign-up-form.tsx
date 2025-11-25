"use client";

import { Input } from "@/components/ui/input";
import { SubmitButton } from "@/components/form/submit-button";
import { signUp } from "@/features/auth/actions/sign-up";
import { useActionState } from "react";
import { EMPTY_ACTION_STATE } from "@/components/form/utils/to-action-state";
import { Form } from "@/components/form/form";
import { FieldError } from "@/components/form/field-error";

const SignUpForm = () => {
  const [actionState, action] = useActionState(signUp, EMPTY_ACTION_STATE);

  return (
    <Form action={action} actionState={actionState}>
      <Input
        name="firstName"
        placeholder="First Name"
        defaultValue={actionState.payload?.get("firstName") as string}
      />
      <FieldError name="firstName" actionState={actionState} />
      <Input
        name="lastName"
        placeholder="Last Name"
        defaultValue={actionState.payload?.get("lastName") as string}
      />
      <FieldError name="lastName" actionState={actionState} />
      <Input
        name="username"
        placeholder="username"
        defaultValue={actionState.payload?.get("username") as string}
      />
      <FieldError name="username" actionState={actionState} />
      <Input
        name="email"
        placeholder="Email"
        defaultValue={actionState.payload?.get("email") as string}
      />
      <FieldError name="email" actionState={actionState} />
      <Input
        name="password"
        placeholder="Password"
        type="password"
        defaultValue={actionState.payload?.get("password") as string}
      />
      <FieldError name="password" actionState={actionState} />
      <Input
        type="password"
        name="confirmPassword"
        placeholder="Confirm Password"
        defaultValue={actionState.payload?.get("confirmPassword") as string}
      />
      <FieldError name="confirmPassword" actionState={actionState} />
      <SubmitButton label="Sign Up" />
    </Form>
  );
};
export { SignUpForm };
