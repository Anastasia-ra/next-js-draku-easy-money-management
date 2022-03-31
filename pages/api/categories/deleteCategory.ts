import { NextApiRequest, NextApiResponse } from 'next';
import {
  deleteCategoryByIdAndUserId,
  getUserByValidSessionToken,
} from '../../../util/database';

export default async function categoriesHandler(
  request: NextApiRequest,
  response: NextApiResponse,
) {
  if (request.method === 'POST') {
    if (
      typeof request.body.category.categoryId !== 'number' ||
      !request.body.category.categoryId
    ) {
      response.status(400).json({
        errors: [
          {
            message: 'CategoryId not provided',
          },
        ],
      });
      return;
    }
    const sessionToken = request.cookies.sessionToken;
    const user = await getUserByValidSessionToken(sessionToken);

    if (!user) {
      return response.status(401).send({ message: 'Unauthorized' });
    }

    await deleteCategoryByIdAndUserId(
      request.body.category.categoryId,
      user.id,
    );

    response.status(201).json({
      message: 'Category sucessfully deleted',
    });
    return;
  }

  response.status(405).json({
    errors: [
      {
        message: 'Method not supported',
      },
    ],
  });
}
