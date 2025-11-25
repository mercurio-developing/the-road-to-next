import Link from "next/link";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { commentEditPath, ticketEditPath, ticketPath } from "@/app/paths";
import {
  LucideMoreVertical,
  LucidePencil,
  LucideSquareArrowOutUpRight,
  LucideTrash,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { clsx } from "clsx";
import { Prisma } from ".prisma/client";
import { getAuth } from "@/features/auth/queries/get-auth";
import { isOwner } from "@/features/auth/utils/is-owner";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { format } from "date-fns";
import { UseConfirmDialog } from "@/components/confirm-dialog";
import { deleteTicket } from "@/features/ticket/actions/delete-ticket";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { CommentDeleteButton } from "@/features/comment/components/comment-delete-button";

type CommentItemProps = {
  comment: Prisma.CommentGetPayload<{
    include: { user: { select: { username: true } } };
  }>;
};

const CommentItem = async ({ comment }: CommentItemProps) => {
  const { user } = await getAuth();
  const isCommentOwner = isOwner(user, comment);

  const editButton = isCommentOwner && (
    <Button asChild variant="outline" size="icon">
      <Link prefetch href={commentEditPath(comment.id,comment.ticketId)}>
        <LucidePencil />
      </Link>
    </Button>
  );

  console.log(comment);
  return (
    <div className={"w-full flex gap-x-1  max-w-[580px]"}>
      <Card key={comment.id} className="w-full gap-y-2 bg-input overflow-hidden">
        <CardHeader>
          <CardTitle className="flex gap-x-1">
            <Avatar>
              <AvatarFallback>
                {comment.user.username[0].toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <span className="ml-1 text-lg">{comment.user.username}</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="ml-2">
          <p className="bg-transparent ">{comment.content}</p>
        </CardContent>
        <CardFooter>
          <p className="text-sm text-muted-foreground ml-auto">
            Created - {format(comment.createdAt, "yyyy-MM-dd")}
          </p>
        </CardFooter>
      </Card>
      <div className="flex flex-col gap-y-1">
        {editButton}
        {isCommentOwner && (
          <CommentDeleteButton
            commentId={comment.id}
            ticketId={comment.ticketId}
          />
        )}
      </div>
    </div>
  );
};

export { CommentItem };
