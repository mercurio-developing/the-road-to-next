"use client";

import { useState, ReactNode, useActionState } from "react";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import {
  ActionState,
  EMPTY_ACTION_STATE,
} from "@/components/form/utils/to-action-state";
import { LucideLoaderCircle } from "lucide-react";
import { useActionFeedback } from "@/components/form/hooks/use-action-feedback";
import { toast } from "sonner";

type ConfirmDialogWithCodeProps = {
  trigger: ReactNode;
  title: string;
  description: string | ReactNode;
  sendCodeAction: (
    _prevState: ActionState,
    formData: FormData,
  ) => Promise<ActionState>;
  verifyCodeAction: (
    _prevState: ActionState,
    formData: FormData,
  ) => Promise<ActionState>;
  onSuccessAction?: (code: string) => void;
};

export const ConfirmDialogWithCode = ({
  trigger,
  title,
  description,
  sendCodeAction,
  verifyCodeAction,
  onSuccessAction,
}: ConfirmDialogWithCodeProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [codeSent, setCodeSent] = useState(false);
  const [code, setCode] = useState("");

  // Send code action state
  const [sendCodeState, sendCodeFormAction, isSendingCode] = useActionState(
    sendCodeAction,
    EMPTY_ACTION_STATE,
  );

  // Verify code action state
  const [verifyCodeState, verifyCodeFormAction, isVerifying] = useActionState(
    verifyCodeAction,
    EMPTY_ACTION_STATE,
  );

  // Handle send code feedback
  useActionFeedback(sendCodeState, {
    onSuccess: ({ actionState }) => {
      setCodeSent(true);
      if (actionState.message) {
        toast.success(actionState.message);
      }
    },
    onError: ({ actionState }) => {
      if (actionState.message) {
        toast.error(actionState.message);
      }
    },
  });

  // Handle verify code feedback
  useActionFeedback(verifyCodeState, {
    onSuccess: ({ actionState }) => {
      setIsOpen(false);
      setCodeSent(false);
      if (actionState.message) {
        toast.success(actionState.message);
      }
      // Pass the verified code back to parent
      const code = actionState.payload?.get("code") as string;
      onSuccessAction?.(code);
    },
    onError: ({ actionState }) => {
      if (actionState.message) {
        toast.error(actionState.message);
      }
    },
  });

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      // Reset state when closing
      setCodeSent(false);
      setCode("");
    }
    setIsOpen(open);
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={handleOpenChange}>
      <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>
      <AlertDialogContent className="w-[450px] flex-col flex">
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          {typeof description === "string" ? (
            <AlertDialogDescription>{description}</AlertDialogDescription>
          ) : (
            <AlertDialogDescription asChild>
              <div>{description}</div>
            </AlertDialogDescription>
          )}
        </AlertDialogHeader>

        {/* Send code section */}
        {!codeSent && (
          <div className="space-y-4 pt-4 pb-2 m-auto">
            <form action={sendCodeFormAction}>
              <Button
                type="submit"
                variant="outline"
                className="w-50"
                disabled={isSendingCode}
              >
                {isSendingCode && (
                  <LucideLoaderCircle className="h-4 w-4 animate-spin mr-2" />
                )}
                {isSendingCode ? "Sending..." : "Send Verification Code"}
              </Button>
            </form>
          </div>
        )}

        {/* Success message after code sent */}
        {codeSent && (
          <div className="mt-4 mb-2 p-4 rounded-md bg-green-50 dark:bg-green-950/50 border border-green-200 dark:border-green-900">
            <div className="flex items-center gap-2">
              <div className="flex h-5 w-5 items-center justify-center rounded-full bg-green-100 dark:bg-green-900">
                <svg
                  className="h-3 w-3 text-green-600 dark:text-green-300"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="text-sm font-medium text-green-800 dark:text-green-200">
                Verification code sent successfully
              </p>
            </div>
          </div>
        )}

        {/* Code input + verify form (must be the same form to submit the code) */}
        {codeSent && (
          <form action={verifyCodeFormAction}>
            <div className="flex flex-col items-center gap-4 px-2 mb-5">
              <div className="text-center space-y-1">
                <p className="text-sm font-medium">Enter verification code</p>
                <p className="text-xs text-muted-foreground">
                  Check your email for the 8-digit code
                </p>
              </div>
              <InputOTP
                name="code"
                maxLength={8}
                value={code}
                onChange={(value) => setCode(value)}
              >
                <InputOTPGroup>
                  {Array.from({ length: 8 }).map((_, index) => (
                    <InputOTPSlot key={index} index={index} />
                  ))}
                </InputOTPGroup>
              </InputOTP>

              {verifyCodeState.status === "ERROR" && verifyCodeState.message && (
                <div className="flex items-center gap-2 p-3 rounded-md bg-destructive/10 border border-destructive/20 w-full">
                  <p className="text-sm text-destructive text-center w-full">
                    {verifyCodeState.message}
                  </p>
                </div>
              )}
            </div>

            <AlertDialogFooter>
              <AlertDialogCancel disabled={isVerifying || isSendingCode}>
                Cancel
              </AlertDialogCancel>
              <Button
                type="submit"
                disabled={isVerifying || isSendingCode}
              >
                {isVerifying && (
                  <LucideLoaderCircle className="h-4 w-4 animate-spin mr-2" />
                )}
                Verify Code
              </Button>
            </AlertDialogFooter>
          </form>
        )}

        {!codeSent && (
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isVerifying || isSendingCode}>
              Cancel
            </AlertDialogCancel>
          </AlertDialogFooter>
        )}
      </AlertDialogContent>
    </AlertDialog>
  );
};
