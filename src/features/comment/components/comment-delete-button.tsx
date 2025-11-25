"use client";

import { UseConfirmDialog } from "@/components/confirm-dialog";
import { LucideTrash } from "lucide-react";
import { deleteComment } from "@/features/comment/actions/delete-comment";
import { Button } from "@/components/ui/button";

type CommentDeleteButtonProps = {
  commentId: string;
  ticketId: string;
};

const CommentDeleteButton = ({
  commentId,
  ticketId,
}: CommentDeleteButtonProps) => {
  const [deleteButton, deleteDialog] = UseConfirmDialog({
    action: deleteComment.bind(null, commentId, ticketId),
    trigger: (
      <Button asChild variant="outline" size="icon">
        <LucideTrash className="w-9 h-9 p-2"/>
      </Button>
    ),
  });
  return (
    <>
      {deleteDialog}
      {deleteButton}
    </>
  );
};

export { CommentDeleteButton };
