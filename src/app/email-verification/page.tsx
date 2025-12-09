import { CardCompact } from "@/components/card-compact";
import { EmailVerificationForm } from "@/features/auth/components/email-verification-form";

const EmailVerificationPage = () => {
  return (
    <div className="flex-1 flex flex-col justify-start items-center mt-[20vh]">
      <CardCompact
        title="Verify Email"
        description="Please verify your email to continue"
        classname="w-full max-w-[420px]  animate-fade-from-top"
        content={<EmailVerificationForm />}
      />
    </div>
  );
};

export default EmailVerificationPage;
