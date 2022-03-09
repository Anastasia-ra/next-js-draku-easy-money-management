import { NextApiRequest, NextApiResponse } from 'next';
import { getExpensesByMonth } from '../../../util/database';

export default async function expensesHandler(
  request: NextApiRequest,
  response: NextApiResponse,
) {
  if (request.method === 'POST') {
    if (
      typeof request.body.month !== 'number' ||
      !request.body.month ||
      typeof request.body.year !== 'number' ||
      !request.body.year
    ) {
      response.status(400).json({
        errors: [
          {
            message: 'Month or year not provided',
          },
        ],
      });
      return;
    }
    const expensesList = await getExpensesByMonth(
      request.body.month,
      request.body.year,
    );

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
