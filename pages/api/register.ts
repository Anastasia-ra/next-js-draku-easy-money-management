import { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcrypt';
import { createUser, getUserByUsername, User } from '../../util/database';

type RegisterRequestBody = {
  username: string;
  password: string;
  email: string;
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
      !request.body.password
    ) {
      response.status(400).json({
        errors: [
          {
            message: 'Email, username or password not provided',
          },
        ],
      });
      return;
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
    response.status(201).json({ user: user });
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
