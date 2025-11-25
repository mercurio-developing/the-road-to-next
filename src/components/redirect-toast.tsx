"use client";

import { useEffect } from "react";
import { consumeCookiedByKey } from "@/actions/cookies";
import { toast } from "sonner";

const RedirectToast = () => {
 console.log("TEST")
  useEffect(() => {
    const showCookieToast = async () => {
      const message = await consumeCookiedByKey("toast");
      console.log(message)
      if (message) {
        toast.success(message);
      }
    };
    console.log("MONKEY")
    showCookieToast();
  }, []);
  return null;
};

export { RedirectToast };
