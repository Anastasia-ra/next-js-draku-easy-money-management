import { NextApiRequest, NextApiResponse } from 'next';
import { getExpensesPerCategory } from '../../../util/database';

// Get single expense for each category

export default async function categoriesHandler(
  request: NextApiRequest,
  response: NextApiResponse,
) {
  if (request.method === 'GET') {
    const expensesPerCategories = await getExpensesPerCategory();

    response.status(201).json({
      expensesPerCategories: expensesPerCategories,
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
