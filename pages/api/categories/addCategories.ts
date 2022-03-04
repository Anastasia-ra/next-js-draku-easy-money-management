import { NextApiRequest, NextApiResponse } from 'next';
import { createCategory, getCategorybyUserId } from '../../../util/database';

export default async function categoriesHandler(
  request: NextApiRequest,
  response: NextApiResponse,
) {
  if (request.method === 'POST') {
    if (
      typeof request.body.category.categoryName !== 'string' ||
      !request.body.category.categoryName ||
      typeof request.body.category.monthlyBudget !== 'number' ||
      !request.body.category.monthlyBudget ||
      Number.isNaN(request.body.category.budget)
    ) {
      response.status(400).json({
        errors: [
          {
            message: 'Category or budget not provided',
          },
        ],
      });
      return;
    }

    const categoryFromRequest = request.body.category;

    // Checks if category already exists in database
    const categoryExists = await getCategorybyUserId(
      categoryFromRequest.userId,
      categoryFromRequest.categoryName,
    );
    if (categoryExists) {
      response.status(409).json({
        errors: [
          {
            message: 'Category already exists',
          },
        ],
      });
      return;
    }

    const newCategory = await createCategory(
      categoryFromRequest.userId,
      categoryFromRequest.categoryName,
      categoryFromRequest.monthlyBudget,
    );

    response.status(201).json({
      category: newCategory,
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
