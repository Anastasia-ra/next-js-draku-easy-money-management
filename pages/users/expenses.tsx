import { GetServerSidePropsContext } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import Layout from '../../components/Layout';
import { getExpensesList } from '../../graph-functions/fetchApi';
import {
  getAllCategoriesbyUserId,
  getUserByValidSessionToken,
  Category,
  Expense,
} from '../../util/database';

type Props =
  | {
      userObject: { username: string };
      categories: Category[];
      user: { id: number; username: string };
    }
  | {
      userObject: { username: string };
      error: string;
      user: { id: number; username: string };
    };

type Errors = { message: string }[];

export default function Expenses(props: Props) {
  const [inputDate, setInputDate] = useState('');
  const [inputPrice, setInputPrice] = useState('');
  const [inputName, setInputName] = useState('');
  const [inputCategoryId, setInputCategoryId] = useState('');
  const [errors, setErrors] = useState<Errors>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [deleteName, setDeleteName] = useState('');
  const [deleteDate, setDeleteDate] = useState('');
  const [filteredExpenses, setFilteredExpenses] = useState<Expense[]>([]);

  // Display all expenses on first render or when userId changes
  useEffect(() => {
    if (!('error' in props)) {
      const fetchExpenses = async () => await getAllExpenses(props.user.id);
      fetchExpenses().catch(console.error);
    }
  }, [props]);

  // Display in case user is not logged in
  if ('error' in props) {
    return (
      <Layout userObject={props.userObject}>
        <Head>
          <title>Error</title>
          <meta name="description" content="Error to add expenses " />
        </Head>
        <h1>Expenses Error</h1>
        <p>Please login first to be able to add new expenses.</p>
        <Link href="/login?returnTo=/users/expenses">
          <a>Login</a>
        </Link>
      </Layout>
    );
  }

  // Get current month
  const optionsDate = { month: 'long', year: 'numeric' } as const;
  const currentMonth = new Intl.DateTimeFormat('en-US', optionsDate).format(
    new Date(),
  );
  console.log(currentMonth, typeof currentMonth);

  // Get all expenses
  async function getAllExpenses(userId: number) {
    const expensesListResponseBody = await getExpensesList(userId);

    const splitted = expensesListResponseBody.expensesList.map((e: Expense) => {
      const split = e.date.split('T');
      return split[0];
    });
    console.log('splitted', splitted);

    const expensesSortedByDate = expensesListResponseBody.expensesList.sort(
      (a: Expense, b: Expense) => {
        return a.date.localeCompare(b.date);
      },
    );
    console.log('expensesSortedByDate', expensesSortedByDate);
    setExpenses(expensesSortedByDate.reverse());
  }

  // Add expense in database
  async function addExpense(
    userId: number,
    categoryId: number,
    name: string,
    price: number,
    date: string,
  ) {
    const expenseResponse = await fetch(`/api/expenses/addExpenses`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        expense: {
          userId,
          categoryId,
          name,
          price,
          date,
        },
      }),
    });
    console.log(expenseResponse);

    const expenseResponseBody = await expenseResponse.json();

    if ('errors' in expenseResponseBody) {
      setErrors(expenseResponseBody.errors);
      setInputDate('');
      setInputPrice('');
      setInputName('');
      setInputCategoryId('');
      return;
    }

    setErrors([]);
    setInputDate('');
    setInputPrice('');
    setInputName('');
    setInputCategoryId('');
    await getAllExpenses(props.user.id);
  }

  // Search through expenses

  function findExpense(expenseName: string, expenseDate: string) {
    if (expenseName !== '' && expenseDate === '') {
      const filteredArray = expenses.filter((expense) =>
        expense.name.toLowerCase().includes(expenseName.toLowerCase()),
      );
      setFilteredExpenses(filteredArray);
      return filteredArray;
    } else if (expenseName === '' && expenseDate !== '') {
      const filteredArray = expenses.filter((expense) =>
        expense.date.split('T')[0].split('-').join('-').includes(expenseDate),
      );
      setFilteredExpenses(filteredArray);
      return filteredArray;
    } else if (expenseName === '' && expenseDate === '') {
      setFilteredExpenses([]);
      return [];
    }
    const filteredArray = expenses.filter((expense) => {
      return (
        expense.name.toLowerCase().includes(expenseName.toLowerCase()) &&
        expense.date.split('T')[0].split('-').join('-').includes(expenseDate)
      );
    });
    setFilteredExpenses(filteredArray);
    return filteredArray;
  }

  async function deleteExpense(expenseId: number) {
    const deleteResponse = await fetch(`/api/expenses/deleteExpense`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        expense: {
          expenseId: expenseId,
        },
      }),
    });

    const deleteResponseBody = await deleteResponse.json();

    if ('errors' in deleteResponseBody) {
      setErrors(deleteResponseBody.errors);
      return;
    }
    setErrors([]);

    await getAllExpenses(props.user.id);
  }

  return (
    <Layout userObject={props.userObject}>
      <Head>
        <title>Draku</title>
        <meta name="description" content="Draku money management" />
      </Head>
      <h1>Add an expense </h1>
      <h2>{currentMonth}</h2>
      <form
        onSubmit={async (event) => {
          event.preventDefault();
          await getAllExpenses(props.user.id);
          await addExpense(
            props.user.id,
            Number(inputCategoryId),
            inputName,
            Number(inputPrice),
            inputDate,
          );
        }}
      >
        <label>
          Date
          <input
            type="date"
            value={inputDate}
            min={
              new Date(new Date().setFullYear(new Date().getFullYear() - 1))
                .toISOString()
                .split('T')[0]
            }
            max={new Date().toISOString().split('T')[0]}
            onChange={(event) => {
              setInputDate(event.currentTarget.value);
              console.log('date', event.currentTarget.value);
            }}
          />
        </label>
        <label>
          Price
          <input
            type="number"
            value={inputPrice}
            onChange={(event) => setInputPrice(event.currentTarget.value)}
          />
        </label>
        <label>
          Name
          <input
            value={inputName}
            onChange={(event) => setInputName(event.currentTarget.value)}
          />
        </label>
        <label>
          Category
          <select
            value={inputCategoryId}
            onChange={(event) => {
              setInputCategoryId(event.currentTarget.value);
              console.log(
                'categoryId',
                inputCategoryId,
                typeof inputCategoryId,
              );
            }}
          >
            <option value="">Please choose a category</option>
            {props.categories.map((category) => {
              return (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              );
            })}
          </select>
        </label>
        <button>Add</button>
      </form>
      <div>
        {errors.map((error) => {
          return <div key={`error-${error.message}`}>{error.message}</div>;
        })}
      </div>
      <h2>Delete an expense</h2>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          const filteredArray = findExpense(deleteName, deleteDate);
          console.log(filteredArray);
          // setFilteredExpenses(filteredArray);
        }}
      >
        <label>
          Name
          <input
            value={deleteName}
            onChange={(event) => setDeleteName(event.currentTarget.value)}
          />
        </label>
        <label>
          Date
          <input
            type="date"
            max={new Date().toISOString().split('T')[0]}
            value={deleteDate}
            onChange={(event) => setDeleteDate(event.currentTarget.value)}
          />
        </label>
        <button>Search</button>
      </form>
      {filteredExpenses.map((expense) => {
        return (
          <div key={`delete-${expense.id}`}>
            <div>
              {' '}
              {expense.date} {expense.name} {expense.price}{' '}
            </div>
            <button
              onClick={async () => {
                await deleteExpense(expense.id);
                setFilteredExpenses(
                  filteredExpenses.filter((e) => e.id !== expense.id),
                );
              }}
            >
              {' '}
              Delete
            </button>
          </div>
        );
      })}

      <h3>Latest expenses </h3>
      <div>
        {expenses.map((expense, index) => {
          if (index < 5) {
            return (
              <div key={`expense-${expense.id}`}>
                {expense.id} {expense.name} {expense.price} {expense.date}
              </div>
            );
          }
          return null;
        })}
      </div>
    </Layout>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const sessionToken = context.req.cookies.sessionToken;
  const user = await getUserByValidSessionToken(sessionToken);

  if (!user) {
    return {
      props: {
        error: 'Please login',
      },
    };
  }

  const categories = await getAllCategoriesbyUserId(user.id);

  return {
    props: { user: user, categories: categories },
  };
}
