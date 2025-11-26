import { Placeholder } from "@/components/placeholder";
import { CommentItem } from "@/features/comment/components/comment-item";
import { CardCompact } from "@/components/card-compact";
import { CommentUpsertForm } from "@/features/comment/components/coment-upsert-form";
import { CommentWithMetadata } from "@/features/comment/types";
import { TicketWithMetadata } from "@/features/ticket/type";

type commentListProps = {
  ticket: TicketWithMetadata;
  comments?: CommentWithMetadata[];
};

const CommentList = async ({ ticket, comments = [] }: commentListProps) => {
  return (
    <div className="flex-1 flex flex-col items-center gap-y-4 animate-fade-from-top">
      <CardCompact
        classname={"w-full max-w-[580px]"}
        title="New Comment"
        description="A new comment will be created"
        content={<CommentUpsertForm ticketId={ticket.id as string} />}
      />
      {comments.length ? (
        comments.map((comment) => (
          <CommentItem key={comment.id} comment={comment} />
        ))
      ) : (
        <Placeholder label="No comments found" />
      )}
    </div>
  );
};
export { CommentList };
