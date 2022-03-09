import { NextApiRequest, NextApiResponse } from 'next';
import { deleteExpenseById } from '../../../util/database';

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

    await deleteExpenseById(request.body.expense.expenseId);

    // if (!deletedCategory) {
    //   response.status(404).json({ error: 'Category not found' });
    //   return;
    // }

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
