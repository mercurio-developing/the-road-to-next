"use client";

import { Input } from "@/components/ui/input";
import { SubmitButton } from "@/components/form/submit-button";
import { useActionState } from "react";
import { EMPTY_ACTION_STATE } from "@/components/form/utils/to-action-state";
import { Form } from "@/components/form/form";
import { FieldError } from "@/components/form/field-error";
import { passwordForgot } from "@/features/password/actions/password-forgot";

const PasswordForgotForm = () => {
  const [actionState, action] = useActionState(
    passwordForgot,
    EMPTY_ACTION_STATE,
  );

  return (
    <Form action={action} actionState={actionState}>
      <Input
        name="email"
        placeholder="Email"
        defaultValue={actionState.payload?.get("email") as string}
      />
      <FieldError name="email" actionState={actionState} />
      <SubmitButton label="Send Email" />
    </Form>
  );
};
export { PasswordForgotForm };
