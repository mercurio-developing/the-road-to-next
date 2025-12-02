import { CardCompact } from "@/components/card-compact";
import { PasswordResetForm } from "@/features/password/components/password-reset-form";

type PasswordResetFormProps = {
  params: Promise<{ tokenId: string }>;
};

const PasswordResetPage = async ({ params }: PasswordResetFormProps) => {
  const { tokenId } = await params;
  console.log("TEST")
  return (
    <div className="flex-1 flex flex-col justify-start items-center mt-[20vh]">
      <CardCompact
        title="New Passsword"
        description="Enter new password for your account"
        classname="w-full max-w-[420px]  animate-fade-from-top"
        content={<PasswordResetForm tokenId={tokenId} />}
      />
    </div>
  );
};

export default PasswordResetPage;
