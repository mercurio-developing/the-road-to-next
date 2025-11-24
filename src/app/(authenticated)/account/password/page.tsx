import { Heading } from "@/components/heading";
import { AccountTabs } from "@/app/(authenticated)/account/_navigation/components/account-tabs";

const PasswordPage = () => {
  return (
    <div className="flex-1 flex flex-col gap-y-8 ml-10">
      <Heading title="Password" description="Keep your account secure"         tabs={<AccountTabs />}
      />
    </div>
  );
};

export default PasswordPage;
