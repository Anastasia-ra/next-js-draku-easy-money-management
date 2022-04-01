import { NextApiRequest, NextApiResponse } from 'next';
import {
  getExpensesPerCategory,
  getUserByValidSessionToken,
} from '../../../util/database';

// Get single expense for each category

export default async function categoriesHandler(
  request: NextApiRequest,
  response: NextApiResponse,
) {
  if (request.method === 'GET') {
    const sessionToken = request.cookies.sessionToken;
    const user = await getUserByValidSessionToken(sessionToken);

    if (!user) {
      return response.status(401).send({ message: 'Unauthorized' });
    }

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
