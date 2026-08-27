import bcrypt from "bcryptjs";

import {
  prisma,
} from "../config/prisma";


export async function findUserByEmail(
  email: string
) {
  return prisma.user.findUnique({
    where: {
      email,
    },
  });
}


export async function findUserById(
  id: string
) {
  return prisma.user.findUnique({
    where: {
      id,
    },
  });
}


export async function hashPassword(
  password: string
) {
  return bcrypt.hash(
    password,
    12
  );
}


export async function comparePassword(
  password: string,
  passwordHash: string
) {
  return bcrypt.compare(
    password,
    passwordHash
  );
}


export async function createUser(
  data: {
    name: string;
    email: string;
    passwordHash: string;
  }
) {
  return prisma.user.create({
    data,

    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
      updatedAt: true,
    },
  });
}