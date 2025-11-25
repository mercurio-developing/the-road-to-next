import { CardCompact } from "@/components/card-compact";
import { getComment } from "@/features/comment/queries/get-comment";
import { notFound } from "next/navigation";
import { getAuth } from "@/features/auth/queries/get-auth";
import { isOwner } from "@/features/auth/utils/is-owner";
import { Breadcrumbs } from "@/components/breadcrumbs";
import {
  commentEditPath,
  ticketPath,
  ticketsPath,
} from "@/app/paths";
import { Separator } from "@/components/ui/separator";
import { CommentUpsertForm } from "@/features/comment/components/coment-upsert-form";
import { CommentDeleteButton } from "@/features/comment/components/comment-delete-button";

type CommentEditPageProps = {
  params: Promise<{
    commentId: string;
  }>;
};

const CommentEditPage = async ({ params }: CommentEditPageProps) => {
  const { commentId } = await params;
  const { user } = await getAuth();
  const comment = await getComment(commentId);

  const isCommentFound = !!comment;
  const isCommentOwner = isOwner(user, comment);

  if (!isCommentFound || !isCommentOwner) {
    notFound();
  }

  return (
    <div className="flex-1 flex flex-col gap-y-8 ">
      <Breadcrumbs
        breadcrumbs={[
          { title: "Tickets", href: ticketsPath() },
          { title: comment.ticket.title, href: ticketPath(comment.ticketId) },
          { title: comment.id, href: commentEditPath(comment.id,comment.ticketId)  },

        ]}
      />
      <Separator />
      <div className="flex-1 flex gap-x-1 items-start justify-center ">
        <CardCompact
          title="Edit Comment"
          description="Edit an existing comment"
          classname="w-full max-w-[580px] animate-fade-from-top"
          content={<CommentUpsertForm comment={comment} ticketId={comment.ticketId} />}
        />
        <div className="flex relative">
          {isCommentOwner && (
            <CommentDeleteButton
              commentId={comment.id}
              ticketId={comment.ticketId}
            />
          )}
        </div>
      </div>


    </div>
  );
};
export default CommentEditPage;
