import { NextApiRequest, NextApiResponse } from 'next';
import {
  getCategorybyUserId,
  updateCategoryBudget,
  updateCategoryName,
  updateCategoryNameAndBudget,
} from '../../../util/database';

export default async function categoriesHandler(
  request: NextApiRequest,
  response: NextApiResponse,
) {
  if (request.method === 'PUT') {
    if (
      typeof request.body.category.categoryId !== 'number' ||
      !request.body.category.categoryId
    ) {
      response.status(400).json({
        errors: [
          {
            message: 'CategoryId not provided',
          },
        ],
      });
      return;
    }
    if (
      (typeof request.body.category.newCategoryName !== 'string' ||
        !request.body.category.newCategoryName) &&
      (typeof request.body.category.newCategoryBudget !== 'number' ||
        !request.body.category.newCategoryBudget)
    ) {
      response.status(400).json({
        errors: [
          {
            message:
              'Category name and budget not provided. Please provide at least a new category name or new category budget.',
          },
        ],
      });
      return;
    }

    if (
      typeof request.body.category.newCategoryBudget !== 'number' ||
      !request.body.category.newCategoryBudget
    ) {
      const categoryExists = await getCategorybyUserId(
        request.body.category.userId,
        request.body.category.newCategoryName,
      );
      console.log('should be here');
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

      const updatedCategory = await updateCategoryName(
        request.body.category.categoryId,
        request.body.category.newCategoryName,
      );

      response.status(201).json({
        category: updatedCategory,
      });
      return;
    }

    if (
      typeof request.body.category.newCategoryName !== 'string' ||
      !request.body.category.newCategoryName
    ) {
      const updatedCategory = await updateCategoryBudget(
        request.body.category.categoryId,
        request.body.category.newCategoryBudget,
      );

      response.status(201).json({
        category: updatedCategory,
      });
      return;
    }

    const categoryExists = await getCategorybyUserId(
      request.body.category.userId,
      request.body.category.newCategoryName,
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

    const updatedCategory = await updateCategoryNameAndBudget(
      request.body.category.categoryId,
      request.body.category.newCategoryName,
      request.body.category.newCategoryBudget,
    );

    response.status(201).json({
      category: updatedCategory,
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
