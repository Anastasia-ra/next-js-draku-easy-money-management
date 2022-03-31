import { NextApiRequest, NextApiResponse } from 'next';
import { getAllRemindersByUserId } from '../../util/database';

export default async function remindersHandler(
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
    const remindersList = await getAllRemindersByUserId(request.body.userId);

    response.status(201).json({
      remindersList: remindersList,
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
