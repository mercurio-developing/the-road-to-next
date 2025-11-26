import { Placeholder } from "@/components/placeholder";
import { CommentItem } from "@/features/comment/components/comment-item";
import { isOwner } from "@/features/auth/utils/is-owner";
import { getAuth } from "@/features/auth/queries/get-auth";
import { CardCompact } from "@/components/card-compact";
import { CommentUpsertForm } from "@/features/comment/components/coment-upsert-form";
import { CommentsWithMetadata } from "@/features/comment/types";

type commentListProps = {
  ticketId?: string;
  comments?:CommentsWithMetadata[]
};

const CommentList = async ({ ticketId,comments=[]}: commentListProps) => {
  const { user } = await getAuth();
  return (
    <div className="flex-1 flex flex-col items-center gap-y-4 animate-fade-from-top">
        <CardCompact
          classname={"w-full max-w-[580px]"}
          title="New Comment"
          description="A new comment will be created"
          content={<CommentUpsertForm ticketId={ticketId as string} />}
        />
      {comments.length ? (
        comments.map((comment) => <CommentItem key={comment.id} comment={comment} isOwner={isOwner(user, comment)} />)
      ) : (
        <Placeholder label="No comments found" />
      )}
    </div>

  );
};
export { CommentList };
