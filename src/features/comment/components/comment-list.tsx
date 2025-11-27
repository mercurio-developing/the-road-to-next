"use client";

import { useInView } from "react-intersection-observer";
import { Placeholder } from "@/components/placeholder";
import { CommentItem } from "@/features/comment/components/comment-item";
import { CardCompact } from "@/components/card-compact";
import { CommentUpsertForm } from "@/features/comment/components/coment-upsert-form";
import { CommentWithMetadata } from "@/features/comment/types";
import { TicketWithMetadata } from "@/features/ticket/type";
import { Button } from "@/components/ui/button";
import { getComments } from "@/features/comment/queries/get-comments";
import { PaginateData } from "@/types/pagination";

import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

type commentListProps = {
  ticket: TicketWithMetadata;
  paginatedComments: PaginateData<CommentWithMetadata>;
};

const CommentList = ({ ticket, paginatedComments }: commentListProps) => {
  const queryKey = ["comments", ticket.id];
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, refetch } =
    useInfiniteQuery({
      queryKey,
      queryFn: ({ pageParam }) => getComments(ticket.id, pageParam),
      initialPageParam: undefined as
        | { id: string; createdAt: number }
        | undefined,
      getNextPageParam: (lastPage) =>
        lastPage.metadata.hasNextPage ? lastPage.metadata.cursor : undefined,
      initialData: {
        pages: [
          {
            list: paginatedComments.list,
            metadata: paginatedComments.metadata,
          },
        ],
        pageParams: [undefined],
      },
    });

  const comments = data?.pages.flatMap((page) => page.list);

  const handleMore = async () => {
    await fetchNextPage();
  };

  const queryClient = useQueryClient();

  const handleDeleteComment = () => queryClient.invalidateQueries({ queryKey });

  const handleUpsertComment = () => queryClient.invalidateQueries({ queryKey });

  const { ref, inView } = useInView();

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [fetchNextPage, inView, hasNextPage, isFetchingNextPage]);

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
      <div ref={ref}>
        {!hasNextPage && (
          <p className="text-right text-sm italic">No more comments.</p>
        )}
      </div>
    </>
  );
};
export { CommentList };
