"use client";

import { useEffect } from "react";
import { consumeCookiedByKey } from "@/actions/cookies";
import { toast } from "sonner";

const RedirectToast = () => {
  useEffect(() => {
    const showCookieToast = async () => {
      const message = await consumeCookiedByKey("toast");
      if (message) {
        toast.success(message);
      }
    };
    showCookieToast();
  }, []);
  return null;
};

export { RedirectToast };
