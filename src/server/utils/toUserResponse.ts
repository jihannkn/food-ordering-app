import { type User } from "@prisma/client";

export const toUserResponse = (user: User) => {
    return {
        id: user.id,
        username: user.username,
        name: user.name,
        email: user.email,
        role: user.role,
    };
}