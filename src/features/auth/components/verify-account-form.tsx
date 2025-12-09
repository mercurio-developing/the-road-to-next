"use client";

import { SubmitButton } from "@/components/form/submit-button";
import { useActionState } from "react";
import { EMPTY_ACTION_STATE } from "@/components/form/utils/to-action-state";
import { Form } from "@/components/form/form";
import { verifyAccount } from "@/features/auth/actions/verify-account";

type VerifyEmailFormProps = {
  tokenId: string;
};

const VerifyAccountForm = ({ tokenId }: VerifyEmailFormProps) => {
  const [actionState, action] = useActionState(
    verifyAccount.bind(null, tokenId),
    EMPTY_ACTION_STATE,
  );

  return (
    <Form action={action} actionState={actionState}>
      <SubmitButton label="Sign In" />
    </Form>
  );
};
export { VerifyAccountForm };
