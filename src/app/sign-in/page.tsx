import { CardCompact } from "@/components/card-compact";
import Link from "next/link";
import { passwordForgotPath, signUpPath } from "@/app/paths";
import { SignInForm } from "@/features/auth/components/sign-in-form";

const SignIn = () => {
  return (
    <div className="flex-1 flex flex-col justify-start items-center mt-[20vh]">
      <CardCompact
        title="Sign In"
        description="Sign in to your account"
        classname="w-full max-w-[420px]  animate-fade-from-top"
        content={<SignInForm />}
        footer={
        <>
          <Link className="text-sm text-muted-foreground" href={signUpPath()}>No account yet?</Link>
          <Link className="text-sm text-muted-foreground" href={passwordForgotPath()}>
            Forgot Password?
          </Link>

        </>
      }
      />
    </div>
  )
};

export default SignIn ;
