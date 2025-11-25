import { CardCompact } from "@/components/card-compact";
import Link from "next/link";
import { signInPath } from "@/app/paths";
import { SignUpForm } from "@/features/auth/components/sign-up-form";

const SignUpPage = () => {
  return (
    <div className="flex-1 flex flex-col justify-start items-center mt-[20vh]">
      <CardCompact
        title="Sign Up"
        description="Create a new account"
        classname="w-full max-w-[420px]  animate-fade-from-top"
        content={<SignUpForm />}
        footer={<Link className="text-sm text-muted-foreground" href={signInPath()}>Have an account? Sign in now.</Link>}
      />
    </div>
  );
};

export default SignUpPage ;
