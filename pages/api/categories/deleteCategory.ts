import { NextApiRequest, NextApiResponse } from 'next';
import { deleteCategoryById } from '../../../util/database';

export default async function categoriesHandler(
  request: NextApiRequest,
  response: NextApiResponse,
) {
  console.log('here?');
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

    console.log('is it here?');
    await deleteCategoryById(request.body.category.categoryId);

    // if (!deletedCategory) {
    //   response.status(404).json({ error: 'Category not found' });
    //   return;
    // }

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
