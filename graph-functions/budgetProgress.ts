import { Category, Expense } from '../util/database';

export function getBudgetProgress(categories: Category[], expenses: Expense[]) {
  const totalBudget = categories.reduce(
    (previous, current) => previous + current.monthlyBudget,
    0,
  );

  const currentTotal = expenses.reduce(
    (previous, current) => previous + current.price,
    0,
  );

  const budgetProgress = currentTotal / totalBudget;

  return budgetProgress;
}
