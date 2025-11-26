"use client";

import { Placeholder } from "@/components/placeholder";
import { CommentItem } from "@/features/comment/components/comment-item";
import { CardCompact } from "@/components/card-compact";
import { CommentUpsertForm } from "@/features/comment/components/coment-upsert-form";
import {
  CommentsWithMetadata,
  CommentWithMetadata,
} from "@/features/comment/types";
import { TicketWithMetadata } from "@/features/ticket/type";
import { Button } from "@/components/ui/button";
import { getComments } from "@/features/comment/queries/get-comments";
import { useState } from "react";
import { ActionState } from "@/components/form/utils/to-action-state";

type commentListProps = {
  ticket: TicketWithMetadata;
  paginatedComments: CommentsWithMetadata;
};

const CommentList = ({ ticket, paginatedComments }: commentListProps) => {
  const [comments, setComments] = useState(paginatedComments.list);
  const [metadata, setMetadata] = useState(paginatedComments.metadata);

  const handleMore = async () => {
    const morePaginatedComments = await getComments(ticket.id, comments.length);
    setMetadata(morePaginatedComments.metadata);
    setComments([...comments, ...morePaginatedComments.list]);
  };
  if (!paginatedComments) return null;

  const handleDeleteComment = (id: string) => {
    setComments((prevComments) =>
      prevComments.filter((comment) => comment.id !== id),
    );
  };

  const handleUpsertComment = (
    actionState: ActionState,
    isEdit: boolean = false,
  ) => {

    const newComment = actionState?.data as CommentWithMetadata
    if (!newComment) return null

    if (isEdit) {
      setComments(
        comments.map((comment:CommentWithMetadata) =>
          comment.id === newComment.id ? { ...newComment } : comment,
        ),
      );
    } else {
      setComments((prevComments) => [newComment, ...prevComments]);
    }
  };

  return (
    <>
      <div className="flex-1 flex flex-col items-center gap-y-4 animate-fade-from-top">
        <CardCompact
          classname={"w-full max-w-[580px]"}
          title="New Comment"
          description="A new comment will be created"
          content={
            <CommentUpsertForm
              ticketId={ticket.id as string}
              onSuccess={handleUpsertComment}
            />
          }
        />
        {comments.length ? (
          comments.map((comment: CommentWithMetadata) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              handleDeleteComment={handleDeleteComment}
              handleUpsertComment={handleUpsertComment}
            />
          ))
        ) : (
          <Placeholder label="No comments found" />
        )}
      </div>
      {metadata.hasNextPage && (
        <div className="flex flex-col justify-center ml-8">
          <Button variant="ghost" onClick={handleMore}>
            More
          </Button>
        </div>
      )}
    </>
  );
};
export { CommentList };
