"use client";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  LucideLoaderCircle,
  LucidePencil,
  LucideTrash,
  LucideX,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useState } from "react";
import { CardCompact } from "@/components/card-compact";
import { CommentUpsertForm } from "@/features/comment/components/coment-upsert-form";
import { UseConfirmDialog } from "@/components/confirm-dialog";
import { deleteComment } from "@/features/comment/actions/delete-comment";
import { CommentWithMetadata } from "@/features/comment/types";

type CommentItemProps = {
  comment: CommentWithMetadata;
  handleDeleteComment: () => void;
  handleUpsertComment: () => void;
};

const CommentItem = ({
  comment,
  handleDeleteComment,
  handleUpsertComment,
}: CommentItemProps) => {
  const [isEdit, setEdit] = useState(false);

  const handleSetEdit = () => {
    setEdit(!isEdit);
  };

  const editButton = (
    <Button variant="outline" size="icon" onClick={handleSetEdit}>
      {!isEdit ? (
        <LucidePencil className="w-4 h-4" />
      ) : (
        <LucideX className="w-4 h-4" />
      )}
    </Button>
  );

  const [deleteButton, deleteDialog] = UseConfirmDialog({
    action: deleteComment.bind(null, comment.id, comment.ticketId),
    trigger: (isPending) => (
      <Button variant="outline" size="icon" disabled={isPending}>
        {isPending ? (
          <LucideLoaderCircle className="w-4 h-4 animate-spin" />
        ) : (
          <LucideTrash className="w-4 h-4" />
        )}
      </Button>
    ),
    onSuccess: () => {
      handleDeleteComment();
    },
  });

  const handleOnSuccess = () => {
    handleUpsertComment();
    setEdit(false);
  };

  return (
    <div className={"w-full flex gap-x-1  max-w-[580px]"}>
      {isEdit ? (
        <CardCompact
          title="Edit Comment"
          description="Edit an existing comment"
          classname="w-full max-w-[535px] animate-fade-from-top"
          content={
            <CommentUpsertForm
              comment={comment}
              ticketId={comment.ticketId}
              onSuccess={handleOnSuccess}
            />
          }
        />
      ) : (
        <Card
          key={comment.id}
          className="w-full gap-y-2 bg-input overflow-hidden ml-8"
        >
          <CardHeader>
            <CardTitle className="flex gap-x-1 items-center">
              <Avatar>
                <AvatarFallback>
                  {comment.user?.username[0].toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <span className="ml-1 a">
                {comment.user?.firstName} {comment.user?.lastName}
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="ml-2">
            <p className="bg-transparent text-sm">{comment.content}</p>
          </CardContent>
          <CardFooter>
            <p className="text-sm text-muted-foreground ml-auto">
              {comment.createdAt.toLocaleString()}
            </p>
          </CardFooter>
        </Card>
      )}
      {comment.isOwner && (
        <div className="flex flex-col gap-y-1 ml-1">
          {editButton}
          {deleteDialog}
          {deleteButton}
        </div>
      )}
    </div>
  );
};

export { CommentItem };
