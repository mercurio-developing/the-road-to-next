"use client";

import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { FieldError } from "@/components/form/field-error";
import { SubmitButton } from "@/components/form/submit-button";
import { Form } from "@/components/form/form";
import { useActionState } from "react";
import { EMPTY_ACTION_STATE } from "@/components/form/utils/to-action-state";
import { Comment } from ".prisma/client";
import { upsertComment } from "@/features/comment/actions/upsert-comment";

type CommentUpsertProps = {
  comment?: Comment;
  ticketId: string;
};

const CommentUpsertForm = ({ comment, ticketId }: CommentUpsertProps) => {
  const [actionState, action] = useActionState(
    upsertComment.bind(null, comment?.id),
    EMPTY_ACTION_STATE,
  );

  return (
    <Form action={action} actionState={actionState}>
      <Label htmlFor="content">Content</Label>
      <Textarea
        id="content"
        name="content"
        defaultValue={
          (actionState.payload?.get("content") as string) ?? comment?.content
        }
      />
      <FieldError name="content" actionState={actionState} />
      <input hidden name="ticketId" defaultValue={ticketId} />
      <SubmitButton label={comment ? "Edit" : "Create"} />
    </Form>
  );
};

export { CommentUpsertForm };
