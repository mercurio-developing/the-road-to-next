import {initialTickets} from "@/app/data";
import {ticketPath } from "@/app/paths"
import Link from "next/link";


const TicketsPage = () => {
    return (
        <div>
            {initialTickets.map((ticket) => (
                <div key={ticket.id}>
                    <h2 className="text-lg">{ticket.title}</h2>
                    <Link href={ticketPath(ticket.id.toString())} className="text-sm underline">view</Link>
                </div>
            ))}
        </div>
    )
};

export default TicketsPage;