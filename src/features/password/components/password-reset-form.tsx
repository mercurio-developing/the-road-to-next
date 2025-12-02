"use client";

import { Input } from "@/components/ui/input";
import { SubmitButton } from "@/components/form/submit-button";
import { useActionState } from "react";
import { EMPTY_ACTION_STATE } from "@/components/form/utils/to-action-state";
import { Form } from "@/components/form/form";
import { FieldError } from "@/components/form/field-error";
import { passwordReset } from "@/features/password/actions/password-reset";

type PasswordResetFormProps = {
  tokenId:string
}


const PasswordResetForm = ({tokenId}:PasswordResetFormProps) => {
  const [actionState, action] = useActionState(
    passwordReset.bind(null,tokenId),
    EMPTY_ACTION_STATE,
  );

  return (
    <Form action={action} actionState={actionState}>
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
      <SubmitButton label="Reset Password" />
    </Form>
  );
};
export { PasswordResetForm };
