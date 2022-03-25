import {
  getTotalBudgetProgress,
  getBudgetProgressByCategoryPerMonth,
} from '../../graphFunctions/budgetProgress';

test('calculate total budget progress', () => {
  const categories = [
    { id: 1, userId: 22, name: 'Food', monthlyBudget: 150 },
    { id: 2, userId: 22, name: 'Travel', monthlyBudget: 300 },
    { id: 3, userId: 22, name: 'Sports', monthlyBudget: 100 },
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
      categoryId: 2,
      name: 'Plane ticket',
      price: 190,
      date: '2022-03-21T00:00:00.000Z',
    },
  ];

  expect(getTotalBudgetProgress(categories, expenses)).toStrictEqual({
    totalBudget: 550,
    currentTotal: 550,
    progress: 1,
  });
});

test('calculate budget progress for a category per month', () => {

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
      categoryId: 2,
      name: 'Plane ticket',
      price: 190,
      date: '2022-03-21T00:00:00.000Z',
    },
  ];

expect(getBudgetProgressByCategoryPerMonth(150, 1, expenses)).toStrictEqual({
  expensesSum: 360,
  progress: 360/150
})
})
