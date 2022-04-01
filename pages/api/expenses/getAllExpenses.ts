import { NextApiRequest, NextApiResponse } from 'next';
import {
  getAllExpensesByUserId,
  getUserByValidSessionToken,
} from '../../../util/database';

export default async function expensesHandler(
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
      return;
    }
    const sessionToken = request.cookies.sessionToken;
    const user = await getUserByValidSessionToken(sessionToken);

    if (!user) {
      return response.status(401).send({ message: 'Unauthorized' });
    }

    const expensesList = await getAllExpensesByUserId(request.body.userId);

    console.log('expensesList', expensesList);

    response.status(201).json({
      expensesList: expensesList,
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
