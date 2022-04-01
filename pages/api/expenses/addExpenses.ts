import { NextApiRequest, NextApiResponse } from 'next';
import {
  createExpense,
  getUserByValidSessionToken,
} from '../../../util/database';

export default async function expensesHandler(
  request: NextApiRequest,
  response: NextApiResponse,
) {
  if (request.method === 'POST') {
    if (
      typeof request.body.expense.price !== 'number' ||
      !request.body.expense.price ||
      typeof request.body.expense.name !== 'string' ||
      !request.body.expense.name ||
      typeof request.body.expense.categoryId !== 'number' ||
      !request.body.expense.categoryId
    ) {
      response.status(400).json({
        errors: [
          {
            message: 'Missing information. Please, fill in all fields',
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

    const expenseFromRequest = request.body.expense;
    console.log('expenseFromRequest', expenseFromRequest);

    const newExpense = await createExpense(
      expenseFromRequest.userId,
      expenseFromRequest.categoryId,
      expenseFromRequest.name,
      expenseFromRequest.price,
      expenseFromRequest.date,
    );

    response.status(201).json({
      category: newExpense,
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
