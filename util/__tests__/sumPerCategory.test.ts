// import { getSumExpensesCategory, getSharePerCategory } from '../../graph-functions/sum-per-category';

import {
  getSharePerCategory,
  getSumExpensesCategory,
} from '../../graphFunctions/sumPerCategory';

test('get expenses sum per category', () => {
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

  expect(getSumExpensesCategory(categories, expenses)).toStrictEqual([
    { expensesSum: 360, id: 1, userId: 22, name: 'Food', monthlyBudget: 150 },
    {
      expensesSum: 190,
      id: 2,
      userId: 22,
      name: 'Travel',
      monthlyBudget: 300,
    },
    { expensesSum: 0, id: 3, userId: 22, name: 'Sports', monthlyBudget: 100 },
  ]);
});

test('get expenses shares per category', () => {
  const categoriesWithSum = [
    { expensesSum: 360, id: 1, userId: 22, name: 'Food', monthlyBudget: 150 },
    {
      expensesSum: 190,
      id: 2,
      userId: 22,
      name: 'Travel',
      monthlyBudget: 300,
    },
    { expensesSum: 0, id: 3, userId: 22, name: 'Sports', monthlyBudget: 100 },
  ];

  expect(getSharePerCategory(categoriesWithSum)).toStrictEqual([
    {
      expensesSum: 360,
      id: 1,
      userId: 22,
      name: 'Food',
      monthlyBudget: 150,
      shareOfExpenses: 360 / 550,
    },
    {
      expensesSum: 190,
      id: 2,
      userId: 22,
      name: 'Travel',
      monthlyBudget: 300,
      shareOfExpenses: 190 / 550,
    },
    {
      expensesSum: 0,
      id: 3,
      userId: 22,
      name: 'Sports',
      monthlyBudget: 100,
      shareOfExpenses: 0,
    },
  ]);
});
