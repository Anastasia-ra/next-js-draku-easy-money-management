import { Category, Expense } from '../util/database';

export function getLastMonths() {
  const lastMonths = [];
  const monthName = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  const date = new Date();
  date.setDate(1);
  for (let i = 0; i <= 11; i++) {
    const month = monthName[date.getMonth()];
    const year = date.getFullYear();
    lastMonths.push({ monthId: date.getMonth(), month: month, year: year });
    date.setMonth(date.getMonth() - 1);
  }
  return lastMonths;
}

export function sumPerMonth(
  expenses: Expense[],
  lastMonths: Array<{ monthId: number; month: string; year: number }>,
) {
  console.log('expenses', expenses);
  console.log('lastMonths', lastMonths);

  const expensesWithMonthId = expenses.map((expense) => {
    const month = new Date(expense.date).getMonth();
    return { ...expense, month };
  });

  // const monthExpenses: Array<number> = [];

  const lastMonthsWithExpenses = lastMonths.map((month) => {
    return { ...month, monthExpenses: [] };
  });

  for (const month of lastMonthsWithExpenses) {
    for (const expense of expensesWithMonthId) {
      if (expense.month === month.monthId) {
        console.log('month expenses check', month.monthId, month.monthExpenses);
        month.monthExpenses.push(expense.price);
      }
    }
  }

  console.log('lastMonthsWithExpense', lastMonthsWithExpenses);

  const lastMonthsWithTotalExpenses = lastMonthsWithExpenses.map((month) => {
    console.log('check month total', month.monthId, month.monthExpenses);
    const total = month.monthExpenses.reduce(
      (previous, current) => previous + current,
      0,
    );
    return { ...month, totalExpenses: total };
  });
  console.log('lastMonthWithTotalExpenses', lastMonthsWithTotalExpenses);

  return lastMonthsWithTotalExpenses;
}
