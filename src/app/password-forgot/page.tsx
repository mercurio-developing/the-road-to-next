import { CardCompact } from "@/components/card-compact";
import { PasswordForgotForm } from "@/features/password/components/password-forgot-form";

const PasswordForgotPage = () => {
  return (
    <div className="flex-1 flex flex-col justify-start items-center mt-[20vh]">
      <CardCompact
        title="Forgot Password"
        description="Enter your email address to reset your password"
        classname="w-full max-w-[420px]  animate-fade-from-top"
        content={<PasswordForgotForm />}
      />
    </div>
  );
};

export default PasswordForgotPage;
