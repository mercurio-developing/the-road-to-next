"use client";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Ticket } from ".prisma/client";
import { upsertTicket } from "@/features/ticket/actions/upsert-ticket";
import { SubmitButton } from "@/components/form/submit-button";
import { useActionState } from "react";
import { FieldError } from "@/components/form/field-error";

type TicketUpsertFormProps = {
  ticket?: Ticket;
};

const TicketUpsertForm = ({ ticket }: TicketUpsertFormProps) => {
  const [actionState, action] = useActionState(
    upsertTicket.bind(null, ticket?.id),
    {
      message: "",
      fieldErrors: {},
      payload: undefined,
    },
  );

  console.log(actionState);

  return (
    <form action={action} className="flex flex-col gap-y-2">
      <Label htmlFor="title">Title</Label>
      <Input
        id="title"
        name="title"
        type="text"
        defaultValue={
          (actionState.payload?.get("title") as string) ?? ticket?.title
        }
      />
      <FieldError name="title" actionState={actionState} />
      <Label htmlFor="content">Content</Label>
      <Textarea
        id="content"
        name="content"
        defaultValue={
          (actionState.payload?.get("content") as string) ?? ticket?.content
        }
      />
      <FieldError name="content" actionState={actionState} />
      <SubmitButton label={ticket ? "Edit" : "Create"} />
      {actionState.message}
    </form>
  );
};

export { TicketUpsertForm };
