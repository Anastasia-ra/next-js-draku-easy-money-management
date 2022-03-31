import { NextApiRequest, NextApiResponse } from 'next';
import {
  deleteExpenseByIdAndByUserId,
  getUserByValidSessionToken,
} from '../../../util/database';

export default async function expensesHandler(
  request: NextApiRequest,
  response: NextApiResponse,
) {
  if (request.method === 'POST') {
    if (
      typeof request.body.expense.expenseId !== 'number' ||
      !request.body.expense.expenseId
    ) {
      response.status(400).json({
        errors: [
          {
            message: 'ExpenseId not provided',
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

    await deleteExpenseByIdAndByUserId(request.body.expense.expenseId, user.id);

    response.status(201).json({
      message: 'Expense sucessfully deleted',
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
