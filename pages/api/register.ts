import crypto from 'node:crypto';
import bcrypt from 'bcrypt';
import { NextApiRequest, NextApiResponse } from 'next';
import { verifyCsrfToken } from '../../util/auth';
import { createSerializedRegisterSessionTokenCookie } from '../../util/cookies';
import {
  createSession,
  createUser,
  getUserByUsername,
  User,
} from '../../util/database';

type RegisterRequestBody = {
  username: string;
  password: string;
  email: string;
  csrfToken: string;
};

type RegisterNextApiRequest = Omit<NextApiRequest, 'body'> & {
  body: RegisterRequestBody;
};

export type RegisterResponseBody =
  | { errors: { message: string }[] }
  | { user: User };

export default async function registerHandler(
  request: RegisterNextApiRequest,
  response: NextApiResponse<RegisterResponseBody>,
) {
  if (request.method === 'POST') {
    if (
      typeof request.body.email !== 'string' ||
      !request.body.email ||
      typeof request.body.username !== 'string' ||
      !request.body.username ||
      typeof request.body.password !== 'string' ||
      !request.body.password ||
      typeof request.body.csrfToken !== 'string' ||
      !request.body.csrfToken
    ) {
      response.status(400).json({
        errors: [
          {
            message: 'Email, username, password or CSRF token not provided',
          },
        ],
      });
      return;
    }

    // Verify CSRF token
    const csrfTokenMatches = verifyCsrfToken(request.body.csrfToken);

    if (!csrfTokenMatches) {
      response.status(403).json({
        errors: [
          {
            message: 'Invalid CSRF token',
          },
        ],
      });
    }

    if (await getUserByUsername(request.body.username)) {
      response.status(409).json({
        errors: [
          {
            message: 'Username already taken',
          },
        ],
      });
      return;
    }
    const passwordHash = await bcrypt.hash(request.body.password, 12);

    const user = await createUser(
      request.body.email,
      request.body.username,
      passwordHash,
    );

    const token = crypto.randomBytes(64).toString('base64');

    const session = await createSession(token, user.id);

    const serializedCookie = await createSerializedRegisterSessionTokenCookie(
      session.token,
    );

    response.status(201).setHeader('Set-Cookie', serializedCookie).json({
      user: user,
    });
    return;
  }
  response.status(405).json({
    errors: [
      {
        message: 'Method not supported, try POST',
      },
    ],
  });
}
