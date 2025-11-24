import { CardCompact } from "@/components/card-compact";
import { getTicket } from "@/features/ticket/queries/get-ticket";
import { notFound } from "next/navigation";
import { TicketUpsertForm } from "@/features/ticket/components/ticket-upsert-form";
import { getAuth } from "@/features/auth/queries/get-auth";
import { isOwner } from "@/features/auth/utils/is-owner";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { ticketPath, ticketsPath } from "@/app/paths";
import { Separator } from "@/components/ui/separator";

type TicketEditPageProps = {
  params: Promise<{
    ticketId: string;
  }>;
};

const TicketEditPage = async ({ params }: TicketEditPageProps) => {
  const { ticketId } = await params;
  const { user } = await getAuth();
  const ticket = await getTicket(ticketId);

  const isTicketFound = !!ticket;
  const isTickerOwner = isOwner(user, ticket);

  if (!isTicketFound || !isTickerOwner) {
    notFound();
  }

  return (
    <div className="flex-1 flex flex-col gap-y-8 ml-10 ">
      <Breadcrumbs
        breadcrumbs={[
          { title: "Tickets", href: ticketsPath() },
          { title: ticket.title, href: ticketPath(ticketId) },
          { title: "Edit"},
        ]}
      />
      <Separator />
      <div className="flex-1 flex flex-col justify-center items-center">
        <CardCompact
          title="Edit Ticket"
          description="Edit an existing ticket"
          classname="w-full max-w-[420px] animate-fade-from-top"
          content={<TicketUpsertForm ticket={ticket} />}
        />
      </div>
    </div>
  );
};
export default TicketEditPage;
