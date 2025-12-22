"use client";

import { Input } from "@/components/ui/input";
import { useState, useTransition } from "react";
import { EMPTY_ACTION_STATE } from "@/components/form/utils/to-action-state";
import { useActionState } from "react";
import { useActionFeedback } from "@/components/form/hooks/use-action-feedback";
import { sendEmailVerificationCode } from "@/features/profile/actions/send-profile-email-verifcation";
import { updateProfile } from "@/features/profile/actions/update-profile";
import { useDebounce } from "@/hooks/use-debounce";
import { Button } from "@/components/ui/button";
import { ConfirmDialogWithCode } from "@/components/confirm-dialog-with-code";
import { User } from ".prisma/client";
import { useRouter } from "next/navigation";
import { ticketsPath } from "@/paths";
import { verifyEmailCode } from "@/features/profile/actions/verify-email-code";
import { toast } from "sonner";

type UpdateProfileProps = {
  user: User;
};

const UpdateProfileForm = ({ user }: UpdateProfileProps) => {
  const router = useRouter();
  const [firstName, setFirstName] = useState(user.firstName);
  const [lastName, setLastName] = useState(user.lastName);
  const [username, setUsername] = useState(user.username);
  const [email, setEmail] = useState(user.email);

  const debouncedEmail = useDebounce(email, 500);
  const emailChanged = debouncedEmail !== user.email;

  const [, startTransition] = useTransition();

  // Use server action directly (replace performUpdate helper)
  const [updateState, formAction, isUpdating] = useActionState(
    updateProfile,
    EMPTY_ACTION_STATE,
  );

  // Feedback + navigation on success/error
  useActionFeedback(updateState, {
    onSuccess: () => {
      router.push(ticketsPath());
    },
    onError: ({ actionState }) => {
      if (actionState.message) toast.error(actionState.message);
    },
  });

  return (
    <div className="space-y-4">
      <div className="space-y-4">
        <Input
          name="firstName"
          placeholder="First Name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
        />

        <Input
          name="lastName"
          placeholder="Last Name"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
        />

        <Input
          name="username"
          placeholder="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <Input
          name="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        {emailChanged ? (
          <ConfirmDialogWithCode
            trigger={
              <Button type="button" className="w-full">
                Update Profile
              </Button>
            }
            title="Verify your new email"
            description={
              <div className="w-100">
                You are changing your email to {" "}
                <strong className="text-foreground">{email}</strong>. We need
                to verify this new email address before updating your profile.
              </div>
            }
            sendCodeAction={async (prevState, formData) => {
              formData.set("email", email);
              return await sendEmailVerificationCode(prevState, formData);
            }}
            verifyCodeAction={async (prevState, formData) => {
              formData.set("email", email);
              return await verifyEmailCode(prevState, formData);
            }}
            onSuccessAction={() => {
              // Build FormData and submit to server action
              const fd = new FormData();
              fd.set("firstName", firstName);
              fd.set("lastName", lastName);
              fd.set("username", username);
              fd.set("email", email);
              startTransition(() => {
                formAction(fd);
              });
            }}
          />
        ) : (
          <form action={formAction} className="w-full">
            {/* Mirror inputs as hidden fields for server action submission */}
            <input type="hidden" name="firstName" value={firstName} />
            <input type="hidden" name="lastName" value={lastName} />
            <input type="hidden" name="username" value={username} />
            <input type="hidden" name="email" value={email} />
            <Button type="submit" className="w-full" disabled={isUpdating}>
              {isUpdating ? "Updating..." : "Update Profile"}
            </Button>
          </form>
        )}
      </div>
    </div>
  );
};
export { UpdateProfileForm };
