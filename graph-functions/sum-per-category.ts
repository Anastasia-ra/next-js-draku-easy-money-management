import { Category, Expense } from '../util/database';

export function getSumExpensesCategory(
  categories: Category[],
  expenses: Expense[],
) {
  const sumPerCategory = categories.map((category) => {
    const categorySum = [];
    for (const expense of expenses) {
      if (expense.categoryId === category.id) {
        categorySum.push(expense.price);
      }
    }
    const expensesSum = categorySum.reduce(
      (previous, current) => previous + current,
      0,
    );

    return {
      ...category,
      expensesSum: expensesSum,
    };
  });
  console.log('sumPerCategory', sumPerCategory);
  return sumPerCategory;
}

type CategoryWithSum = {
  id: number;
  userId: number;
  name: string;
  monthlyBudget: number;
  expensesSum: number;
};

export function getSharePerCategory(categoryWithSum: CategoryWithSum[]) {
  const totalSum = categoryWithSum.reduce(
    (previous, current) => previous + current.expensesSum,
    0,
  );

  const categoriesWithShare = categoryWithSum.map((category) => {
    if (totalSum === 0) {
      return {
        ...category,
        percentageOfExpenses: 0,
      };
    }
    const proportion = category.expensesSum / totalSum;
    return {
      ...category,
      shareOfExpenses: proportion,
    };
  });
  console.log('categoriesWithPercentage', categoriesWithShare);
  return categoriesWithShare;
}
