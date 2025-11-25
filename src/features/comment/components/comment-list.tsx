import { getComments} from "@/features/comment/queries/get-comments";
import { Placeholder } from "@/components/placeholder";
import { CommentItem } from "@/features/comment/components/comment-item";
import { isOwner } from "@/features/auth/utils/is-owner";
import { getAuth } from "@/features/auth/queries/get-auth";

type commentListProps = {
  ticketId?: string;
};

const CommentList = async ({ ticketId}: commentListProps) => {
  const {list:comments} = await getComments(ticketId);
  const { user } = await getAuth();
  return (
    <div className="flex-1 flex flex-col items-center gap-y-4 animate-fade-from-top">
      {comments.length ? (
        comments.map((comment) => <CommentItem key={comment.id} comment={comment} isOwner={isOwner(user, comment)} />)
      ) : (
        <Placeholder label="No comments found" />
      )}
    </div>

  );
};
export { CommentList };
