import { NextApiRequest, NextApiResponse } from 'next';
import { createExpense } from '../../../util/database';

export default async function expensesHandler(
  request: NextApiRequest,
  response: NextApiResponse,
) {
  if (request.method === 'POST') {
    if (
      // typeof request.body.expense.date !== 'string' ||
      // !request.body.expense.date ||
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
            message: 'Date, price, name or category not provided',
          },
        ],
      });
      return;
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
