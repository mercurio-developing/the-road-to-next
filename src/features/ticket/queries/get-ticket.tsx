import { prisma } from "@/lib/prisma";
import { getAuth } from "@/features/auth/queries/get-auth";
import { isOwner } from "@/features/auth/utils/is-owner";

export const getTicket = async (ticketId: string) => {
  const { user } = await getAuth();

  const ticket = await prisma.ticket.findUnique({
    where: { id: ticketId },
    include: { user: { select: { username: true } } },
  });

  if(!ticket)
    return null

  return {...ticket,isOwner:isOwner(user,ticket)}
};
