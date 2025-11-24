import { Heading } from "@/components/heading";
import { Suspense } from "react";
import { TicketList } from "@/features/ticket/components/ticket-list";
import { Spinner } from "@/components/spinner";
import { CardCompact } from "@/components/card-compact";
import { TicketUpsertForm } from "@/features/ticket/components/ticket-upsert-form";
import { getAuth } from "@/features/auth/queries/get-auth";
import { SearchParams } from "nuqs/server"
import { searchParamsCache } from "@/features/ticket/search-params";

type TicketsPageProps = {
  searchParams: SearchParams;
}

const TicketsPage = async ({searchParams}:TicketsPageProps) => {
  const { user } = await getAuth()
  const searchParamsResult = await searchParamsCache.parse(searchParams)
  return (
    <>
      <div className="flex-1 flex flex-col gap-y-8">
        <Heading title="My Tickets" description="All your tickets at one place" />
        <CardCompact
          classname="w-full max-w-[420px] self-center"
          title="Create Ticket"
          description="A new ticket will be created"
          content={<TicketUpsertForm />}
        />
        <Suspense fallback={<Spinner />}>
          <TicketList userId={user?.id} searchParams={searchParamsResult} />
        </Suspense>
      </div>
    </>
  );
};

export default TicketsPage;
