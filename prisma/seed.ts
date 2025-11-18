import {PrismaClient} from "@prisma/client"

const prisma = new PrismaClient();

const tickets = [
  {
    title:"Ticket 1",
    content:"This is ticket 1",
    status:"DONE" as const ,
    bounty:499,
    deadline:"2024-12-31"

  },
  {
    title:"Ticket 2",
    content:"This is ticket 2",
    status:"OPEN" as const,
    deadline:new Date().toISOString().split("T")[0],
    bounty:499,
  },
  {
    title:"Ticket 3",
    content:"This is ticket 3",
    status:"IN_PROGRESS" as const,
    deadline:new Date().toISOString().split("T")[0],
    bounty:399,
  },
  {
    title:"Ticket 4",
    content:"This is ticket 4",
    status:"DONE" as const,
    deadline:new Date().toISOString().split("T")[0],
    bounty:599,
  }
]

const seed = async()=>{
  const t0 = performance.now()
  console.log('DB Seed: Started...')
  const result = await prisma.ticket.deleteMany();
  console.log("🧹 Deleted tickets:", result); // { count: 0 } or { count: N }

  await prisma.ticket.createMany({
    data:tickets,
  })
  const t1 = performance.now()
  console.log(`DB Seed: Finished...(${t1-t0}ms)`)

}

seed();