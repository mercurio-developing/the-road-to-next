import Link from "next/link";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { ticketEditPath, ticketPath } from "@/app/paths";
import { TICKET_ICONS } from "../constants";
import {
  LucideMoreVertical,
  LucidePencil,
  LucideSquareArrowOutUpRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { clsx } from "clsx";
import { Prisma } from ".prisma/client";
import { toCurrencyFromCent } from "@/utils/currency";
import { TicketMoreMenu } from "@/features/ticket/components/ticket-more-menu";
import { getAuth } from "@/features/auth/queries/get-auth";
import { isOwner } from "@/features/auth/utils/is-owner";
import { CommentList } from "@/features/comment/components/comment-list";
import { CommentsWithMetadata } from "@/features/comment/types";

type TicketItemProps = {
  ticket: Prisma.TicketGetPayload<{
    include: { user: { select: { username: true } } };
  }>;
  comments?: CommentsWithMetadata[];
  isDetail?: boolean;
};

const TicketItem = async ({ ticket, comments, isDetail }: TicketItemProps) => {
  const { user } = await getAuth();
  const isTicketOwner = isOwner(user, ticket);

  const detailButton = (
    <Button asChild variant="outline" size="icon">
      <Link prefetch href={ticketPath(ticket.id)}>
        <LucideSquareArrowOutUpRight className="h-4 w-4" />
      </Link>
    </Button>
  );

  const editButton = isTicketOwner && (
    <Button asChild variant="outline" size="icon">
      <Link prefetch href={ticketEditPath(ticket.id)}>
        <LucidePencil />
      </Link>
    </Button>
  );

  const moreMenu = isTicketOwner && (
    <TicketMoreMenu
      ticket={ticket}
      trigger={
        <Button size="icon" variant="outline">
          <LucideMoreVertical className="h-4 w-4" />
        </Button>
      }
    />
  );

  return (
    <div
      className={clsx("w-full flex flex-col gap-y-4", {
        "max-w-[580px]": isDetail,
        "max-w-[420px]": !isDetail,
      })}
    >
      <div
        className={clsx("flex gap-x-0", {
          "gap-x-2": !isDetail || (isTicketOwner && isDetail),
        })}
      >
        <Card key={ticket.id} className="w-full overflow-hidden">
          <CardHeader>
            <CardTitle className="flex gap-x-2">
              <span className="size-4 mt-1">{TICKET_ICONS[ticket.status]}</span>
              <span className="ml-2 truncate text-2xl">{ticket.title}</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <span
              className={clsx("whitespace-break-spaces", {
                "line-clamp-3": !isDetail,
              })}
            >
              {ticket.content}
            </span>
          </CardContent>
          <CardFooter className="flex justify-between">
            <p className="text-sm text-muted-foreground">
              {ticket.deadline} by {ticket.user.username}{" "}
            </p>
            <p className="text-sm text-muted-foreground">
              {toCurrencyFromCent(ticket.bounty)}
            </p>
          </CardFooter>
        </Card>
        <div className="flex flex-col gap-y-1">
          {isDetail ? (
            <>
              {editButton}
              {moreMenu}
            </>
          ) : (
            <>
              {detailButton}
              {editButton}
            </>
          )}
        </div>
      </div>
      {isDetail && (
        <div className="flex justify-center">
          <CommentList ticketId={ticket.id} comments={comments} />
        </div>
      )}
    </div>
  );
};

export { TicketItem };
