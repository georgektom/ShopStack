import { prisma } from "../db/prisma.js";

export function createSession(data: { token: string; userId: string }) {
  return prisma.session.create({
    data,
    include: {
      user: true
    }
  });
}

export function findSessionByToken(token: string) {
  return prisma.session.findUnique({
    where: { token },
    include: {
      user: true
    }
  });
}

export function deleteSessionByToken(token: string) {
  return prisma.session.deleteMany({
    where: { token }
  });
}
