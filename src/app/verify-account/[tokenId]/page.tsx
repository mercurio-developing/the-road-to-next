import { CardCompact } from "@/components/card-compact";
import { VerifyAccountForm } from "@/features/auth/components/verify-account-form";

type VerifyEmailPageProps = {
  params: Promise<{ tokenId: string }>;
};

const VerifyAccountPage = async ({ params }: VerifyEmailPageProps) => {
  const { tokenId } = await params;
  return (
    <div className="flex-1 flex flex-col justify-start items-center mt-[20vh]">
      <CardCompact
        title="Verify Email"
        description="Please confirm your account by clicking the button below."
        classname="w-full max-w-[420px]  animate-fade-from-top"
        content={<VerifyAccountForm tokenId={tokenId} />}
      />
    </div>
  );
};

export default VerifyAccountPage;
