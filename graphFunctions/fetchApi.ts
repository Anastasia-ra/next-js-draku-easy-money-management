export async function getExpensesList(userId: number) {
  const expensesListResponse = await fetch(`/api/expenses/getAllExpenses`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      userId,
    }),
  });
  const expensesListResponseBody = await expensesListResponse.json();
  return expensesListResponseBody;
}

export async function getCategoriesList(userId: number) {
  const categoriesListResponse = await fetch(
    `/api/categories/getAllCategories`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId: userId,
      }),
    },
  );
  const categoriesListResponseBody = await categoriesListResponse.json();
  return categoriesListResponseBody;
}
