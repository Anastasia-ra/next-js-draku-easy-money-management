import { Expense } from '../util/database';

export function getLastMonths() {
  const lastMonths = [];
  const monthName = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];

  const date = new Date();
  date.setDate(1);
  for (let i = 0; i <= 11; i++) {
    const month = monthName[date.getMonth()];
    const year = date.getFullYear();
    lastMonths.push({
      monthId: date.getMonth(),
      month: month,
      year: year.toString().slice(2),
    });
    date.setMonth(date.getMonth() - 1);
  }
  return lastMonths;
}

export function sumPerMonth(
  expenses: Expense[],
  lastMonths: Array<{ monthId: number; month: string; year: string }>,
) {
  const expensesWithMonthId = expenses.map((expense) => {
    const month = new Date(expense.date).getMonth();
    return { ...expense, month };
  });

  // const monthExpenses: Array<number> = [];

  const lastMonthsWithExpenses = lastMonths.map((month) => {
    return { ...month, monthExpenses: [0] };
  });

  for (const month of lastMonthsWithExpenses) {
    for (const expense of expensesWithMonthId) {
      if (expense.month === month.monthId) {
        console.log('month expenses check', month.monthId, month.monthExpenses);
        month.monthExpenses.push(expense.price);
      }
    }
  }

  const lastMonthsWithTotalExpenses = lastMonthsWithExpenses.map((month) => {
    const total = month.monthExpenses.reduce(
      (previous, current) => previous + current,
      0,
    );
    return { ...month, totalExpenses: total };
  });

  return lastMonthsWithTotalExpenses;
}
