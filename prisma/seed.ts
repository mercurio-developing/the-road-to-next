import { PrismaClient } from "@prisma/client";
import { hash } from "@node-rs/argon2";

const prisma = new PrismaClient();

const users = [
  { username: "admin", email: "admin@gmail.com" },
  { username: "orqodev", email: "orqodev@gmail.com" },
];

const tickets = [
  {
    title: "Ticket 1",
    content: "This is ticket 1",
    status: "DONE" as const,
    bounty: 499,
    deadline: "2024-12-31",
  },
  {
    title: "Ticket 2",
    content: "This is ticket 2",
    status: "OPEN" as const,
    deadline: new Date().toISOString().split("T")[0],
    bounty: 499,
  },
  {
    title: "Ticket 3",
    content: "This is ticket 3",
    status: "IN_PROGRESS" as const,
    deadline: new Date().toISOString().split("T")[0],
    bounty: 399,
  },
  {
    title: "Ticket 4",
    content: "This is ticket 4",
    status: "DONE" as const,
    deadline: new Date().toISOString().split("T")[0],
    bounty: 599,
  },
];

const seed = async () => {
  const t0 = performance.now();
  console.log("DB Seed: Started...");
  await prisma.user.deleteMany();
  await prisma.ticket.deleteMany();
  const passwordHash = await hash("tierrapura");
  const dbUsers = await prisma.user.createManyAndReturn({
    data: users.map((user) => ({ ...user, passwordHash })),
  });
  await prisma.ticket.createMany({
    data: tickets.map((ticket) => ({
      ...ticket,
      userId: dbUsers[0].id,
    })),
  });
  const t1 = performance.now();
  console.log(`DB Seed: Finished...(${t1 - t0}ms)`);
};

seed();
