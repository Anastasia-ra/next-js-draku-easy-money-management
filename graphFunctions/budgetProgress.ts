import { Category, Expense } from '../util/database';

export function getTotalBudgetProgress(
  categories: Category[],
  expenses: Expense[],
) {
  const totalBudget = categories.reduce(
    (previous, current) => previous + current.monthlyBudget,
    0,
  );

  const currentTotal = expenses.reduce(
    (previous, current) => previous + current.price,
    0,
  );

  return {
    totalBudget: totalBudget,
    currentTotal: currentTotal,
    progress: currentTotal / totalBudget,
  };
}

export function getBudgetProgressByCategoryPerMonth(
  monthlyBudget: number,
  categoryId: number,
  expenses: Expense[],
) {
  const expensesByCategory = expenses.filter(
    (expense) => categoryId === expense.categoryId,
  );
  console.log('expensesByCategory', expensesByCategory);
  const expensesSum = expensesByCategory.reduce(
    (previous, current) => previous + current.price,
    0,
  );
  console.log('expensesSum', expensesSum);

  return { expensesSum: expensesSum, progress: expensesSum / monthlyBudget };
}
