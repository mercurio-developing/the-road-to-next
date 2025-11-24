import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Placeholder } from "@/components/placeholder";
import { ticketsPath } from "@/app/paths";

export default function NotFound() {
  return (
    <Placeholder
      label="Ticket not found"
      button={
        <Button asChild variant="outline">
          <Link href={ticketsPath()}>Go back to tickets</Link>
        </Button>
      }
    />
  );
}
