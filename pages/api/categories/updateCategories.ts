import { NextApiRequest, NextApiResponse } from 'next';
import {
  getCategorybyUserId,
  getUserByValidSessionToken,
  updateCategoryBudgetByUserId,
  updateCategoryNameByUserId,
  updateCategoryNameAndBudgetByUserId,
} from '../../../util/database';

export default async function categoriesHandler(
  request: NextApiRequest,
  response: NextApiResponse,
) {
  if (request.method === 'PUT') {
    const sessionToken = request.cookies.sessionToken;
    const user = await getUserByValidSessionToken(sessionToken);

    if (!user) {
      return response.status(401).send({ message: 'Unauthorized' });
    }

    if (
      typeof request.body.category.categoryId !== 'number' ||
      !request.body.category.categoryId
    ) {
      response.status(400).json({
        errors: [
          {
            message: 'CategoryId not provided',
            categoryId: undefined,
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
            message: 'Please provide a new name or budget',
            categoryId: request.body.category.categoryId,
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
      if (categoryExists) {
        response.status(409).json({
          errors: [
            {
              message: 'Category already exists',
              categoryId: request.body.category.categoryId,
            },
          ],
        });
        return;
      }

      const updatedCategory = await updateCategoryNameByUserId(
        request.body.category.categoryId,
        request.body.category.newCategoryName,
        user.id,
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
      const updatedCategory = await updateCategoryBudgetByUserId(
        request.body.category.categoryId,
        request.body.category.newCategoryBudget,
        user.id,
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
            categoryId: request.body.category.categoryId,
          },
        ],
      });
      return;
    }

    const updatedCategory = await updateCategoryNameAndBudgetByUserId(
      request.body.category.categoryId,
      request.body.category.newCategoryName,
      request.body.category.newCategoryBudget,
      user.id,
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
        categoryId: request.body.category.categoryId,
      },
    ],
  });
}
