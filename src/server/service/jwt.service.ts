import type { JWTPayload } from '@/types';
import * as jose from 'jose';
import { UnauthorizedException } from '../lib/error.exception';
import { env } from '@/env';

export const jwtService = {
    createToken: async (payload: JWTPayload): Promise<string> => {
        const secret = new TextEncoder().encode(env.AUTH_SECRET);

        if (!secret) throw new UnauthorizedException('Missing token or secret');

        const token = await new jose.SignJWT(payload)
            .setProtectedHeader({ alg: 'HS256' })
            .setIssuedAt()
            .setExpirationTime('2h')
            .sign(secret);

        return token;
    },

    verifyToken: async (token: string): Promise<JWTPayload> => {
        const secret = new TextEncoder().encode(env.AUTH_SECRET);

        if (!secret) throw new UnauthorizedException('Missing token or secret');

        const { payload } = await jose.jwtVerify(token, secret);

        return payload as JWTPayload;
    },

    // decodeToken: (token: string): JWTPayload => {
    //     const decoder = new jose.UnsecuredJWT();
    //     return decoder.decode(token).payload as JWTPayload;
    // },
};
