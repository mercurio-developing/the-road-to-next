import { PrismaClient } from "@prisma/client";
import { hash } from "@node-rs/argon2";

const prisma = new PrismaClient();

const users = [
  {
    username: "admin",
    email: "admin@gmail.com",
    firstName: "Alejandro",
    lastName: "Fidanza",
    emailVerified: true,
  },
  {
    username: "orqodev",
    email: "orqodev@gmail.com",
    firstName: "Alejandro",
    lastName: "Fidanza",
    emailVerified: false,
  },
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

const comments = [
  {
    content: "NEW COMMENT 1",
  },
  {
    content: "NEW COMMENT 2",
  },
  {
    content: "NEW COMMENT 3",
  },
  {
    content: "NEW COMMENT 4",
  },
  {
    content: "NEW COMMENT 5",
  },
  {
    content: "NEW COMMENT 6",
  },
];

const getRandomNumber = (maxNumber: number): number => {
  return Math.floor(Math.random() * (maxNumber + 1));
};

const seed = async () => {
  const t0 = performance.now();
  console.log("DB Seed: Started...");
  await prisma.user.deleteMany();
  await prisma.ticket.deleteMany();
  await prisma.comment.deleteMany();
  const passwordHash = await hash("tierrapura");

  const dbUsers = await prisma.user.createManyAndReturn({
    data: users.map((user) => ({ ...user, passwordHash })),
  });

  const dbTickets = await prisma.ticket.createManyAndReturn({
    data: tickets.map((ticket) => ({
      ...ticket,
      userId: dbUsers[getRandomNumber(dbUsers.length - 1)].id,
    })),
  });

  await prisma.comment.createMany({
    data: comments.map((comment) => ({
      ...comment,
      userId: dbUsers[getRandomNumber(dbUsers.length - 1)].id,
      ticketId: dbTickets[getRandomNumber(dbTickets.length - 1)].id,
    })),
  });
  const t1 = performance.now();
  console.log(`DB Seed: Finished...(${t1 - t0}ms)`);
};

seed();
