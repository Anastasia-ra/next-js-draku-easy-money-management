import { NextApiRequest, NextApiResponse } from 'next';
import {
  createCategory,
  getCategorybyUserId,
  getUserByValidSessionToken,
} from '../../../util/database';

export default async function categoriesHandler(
  request: NextApiRequest,
  response: NextApiResponse,
) {
  if (request.method === 'POST') {
    if (
      typeof request.body.category.name !== 'string' ||
      !request.body.category.name ||
      typeof request.body.category.monthlyBudget !== 'number' ||
      !request.body.category.monthlyBudget ||
      Number.isNaN(request.body.category.monthlyBudget)
    ) {
      response.status(400).json({
        errors: [
          {
            message: 'Category or budget not provided',
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

    const categoryFromRequest = request.body.category;

    const categoryExists = await getCategorybyUserId(
      categoryFromRequest.userId,
      categoryFromRequest.name,
    );
    if (categoryExists) {
      response.status(409).json({
        errors: [
          {
            message: 'Category already exists',
          },
        ],
      });
      return;
    }

    const newCategory = await createCategory(
      categoryFromRequest.userId,
      categoryFromRequest.name,
      categoryFromRequest.monthlyBudget,
    );

    response.status(201).json({
      category: newCategory,
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
