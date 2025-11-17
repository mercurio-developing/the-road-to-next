"use server";

import { prisma } from "@/lib/prisma";
import { ticketsPath } from "@/app/paths";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export const upsertTicket = async (id: string | undefined, formData: FormData) => {
  const data = {
    title: formData.get("title") as string,
    content: formData.get("content") as string,
  };

  await prisma.ticket.upsert({
    where:{id:id || ""},
    update:data,
    create:data
  })

  revalidatePath(ticketsPath());
  if (id){
    redirect(ticketsPath());
  }
};
