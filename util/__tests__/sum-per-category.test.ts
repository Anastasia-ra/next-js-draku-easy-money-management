// import { getSumExpensesCategory, getSharePerCategory } from '../../graph-functions/sum-per-category';

import { getSharePerCategory } from '../../graphFunctions/sumPerCategory';

test('get expenses sum per category', () => {
  const categories = [
    { id: 1, userId: 22, name: 'Food', monthlyBudget: 150 },
    { id: 2, userId: 22, name: 'Travel', monthlyBudget: 300 },
    { id: 3, userId: 22, name: 'Food', monthlyBudget: 100 },
  ];

  const expenses = [
    {
      id: 1,
      userId: 22,
      categoryId: 1,
      name: 'Sandwich',
      price: 170,
      date: '2022-03-21T00:00:00.000Z',
    },
    {
      id: 2,
      userId: 22,
      categoryId: 1,
      name: 'Restaurant',
      price: 190,
      date: '2022-03-21T00:00:00.000Z',
    },
    {
      id: 3,
      userId: 22,
      categoryId: 1,
      name: 'Plane ticket',
      price: 190,
      date: '2022-03-21T00:00:00.000Z',
    },
  ];
});
