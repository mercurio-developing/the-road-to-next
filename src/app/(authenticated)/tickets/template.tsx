"use client";

import { RedirectToast } from "@/components/redirect-toast";
import { useParams } from "next/navigation";

type RootTemplateProps = {
  children: React.ReactNode;
};

export default function RootTemplate({ children }: RootTemplateProps) {
  const params = useParams();
  const key = JSON.stringify(params);
  console.log(key)
  return (
    <>
      <>{children}</>
      <RedirectToast />
    </>
  );
}


