import { NextApiRequest, NextApiResponse } from 'next';
import { getAllCategoriesbyUserId } from '../../../util/database';

export default async function categoriesHandler(
  request: NextApiRequest,
  response: NextApiResponse,
) {
  if (request.method === 'POST') {
    if (typeof request.body.userId !== 'number' || !request.body.userId) {
      response.status(400).json({
        errors: [
          {
            message: 'UserId not provided',
          },
        ],
      });
    }

    const categoriesList = await getAllCategoriesbyUserId(request.body.userId);

    console.log('categoriesList', categoriesList);

    response.status(201).json({
      categoriesList: categoriesList,
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
