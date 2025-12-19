import { Heading } from "@/components/heading";
import { AccountTabs } from "@/app/(authenticated)/account/_navigation/components/account-tabs";
import { CardCompact } from "@/components/card-compact";
import { UpdateProfileForm } from "@/features/profile/components/update-profile-form";
import { getUser } from "@/features/profile/queries/get-user";
import { User } from ".prisma/client";

const ProfilePage = async () => {
  const user = await getUser();

  return (
    <div className="flex-1 flex flex-col gap-y-8 ml-10">
      <Heading
        title="Profile"
        description="All your profile information"
        tabs={<AccountTabs />}
      />
      <div className="flex-1 flex flex-col justify-start items-center mt-[10vh]">
        <CardCompact
          title="Update Profile"
          description="Update your profile information"
          classname="w-full max-w-[420px]  animate-fade-from-top"
          content={<UpdateProfileForm user={user as User} />}
        />
      </div>
    </div>
  );
};

export default ProfilePage;
