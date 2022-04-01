export function getSumPerDay(
  expensesCurrentMonth: Array<{
    id: number;
    userId: number;
    categoryId: number;
    name: string;
    price: number;
    date: string;
  }>,
  currentDay: number,
) {
  // const expensesSorted = expensesCurrentMonth.sort((a, b) => {
  //   return a.date.localeCompare(b.date);
  // });

  // for (let i = 1; i <= numberDays; i++) {}

  // for (const expense of expensesCurrentMonth) {
  // }

  const expensesWithDay = expensesCurrentMonth.map((expense) => {
    const day = new Date(expense.date).getDate();
    return { ...expense, day };
  });

  const daysInMonth = [];

  for (let i = 0; i <= currentDay; i++) {
    daysInMonth.push({ dayId: i, dayExpenses: [0] });
  }

  for (const day of daysInMonth) {
    for (const expense of expensesWithDay) {
      if (expense.day === day.dayId) {
        day.dayExpenses.push(expense.price);
      }
    }
  }

  const daysWithTotalExpenses = daysInMonth.map((day) => {
    const total = day.dayExpenses.reduce(
      (previous, current) => previous + current,
      0,
    );
    return { ...day, totalExpenses: total };
  });

  return daysWithTotalExpenses;
}
