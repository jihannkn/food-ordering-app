import { db } from '@/server/database/db';
import { UserRole, type User } from '@prisma/client';
import bcrypt from 'bcrypt';
import { v4 as uuid } from 'uuid';
import { type RegisterRequest } from '../auth/auth.model';
import { type UpdateUserRequest } from './user.model';

export const userRepository = {
    findMany: async (): Promise<User[]> => {
        const users = await db.user.findMany({ include: { store: true } });

        return users;
    },

    findUniqueEmail: async (email: string): Promise<User | null> => {
        const user = await db.user.findUnique({ where: { email } });

        return user;
    },

    findUniqueId: async (id: string): Promise<User | null> => {
        const user = await db.user.findUnique({ where: { id } });

        return user;
    },

    countByEmail: async (email: string): Promise<number> => {
        const userCount = await db.user.count({ where: { email } });

        return userCount;
    },

    countById: async (id: string): Promise<number> => {
        const userCount = await db.user.count({ where: { id } });

        return userCount;
    },

    insertOne: async (request: RegisterRequest): Promise<User> => {
        const id = uuid();

        let passwordHashed;

        if (request.password) {
            passwordHashed = await bcrypt.hash(request.password, 10);
        }

        const username = `user-${id.slice(0, 8)}`;

        const newUserData = {
            id,
            username,
            name: request.name,
            email: request.email,
            role: UserRole.USER,
            password: passwordHashed ?? null,
            provider: request.provider ?? 'credentials',
            image: request.image ?? null,
        };

        const user = await db.user.create({
            data: newUserData,
        });

        return user;
    },

    updateOne: async (
        id: string,
        request: UpdateUserRequest,
    ): Promise<User> => {
        const oldUserData = await userRepository.findUniqueId(id);

        let passwordHashed;

        if (request.password) {
            passwordHashed = await bcrypt.hash(request.password, 10);
        }

        const updateUserData = {
            username: request.username ?? oldUserData?.username,
            name: request.name ?? oldUserData?.name,
            email: request.email ?? oldUserData?.email,
            role: (request.role as UserRole) ?? oldUserData?.role,
            provider: request.provider ?? oldUserData?.provider,
            password: passwordHashed ?? oldUserData?.password,
            store_id: request.store_id ?? oldUserData?.store_id,
            image: request.image ?? oldUserData?.image,
        };

        const user = await db.user.update({
            where: { id },
            data: updateUserData,
        });

        return user;
    },

    deleteOne: async (id: string): Promise<User> => {
        const user = await db.user.delete({ where: { id } });

        return user;
    },
};
