import { css } from '@emotion/react';
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
  getAllExpensesByUserId,
} from '../../util/database';

type Props =
  | {
      userObject: { username: string };
      user: { id: number; username: string };
      categories: Category[];
      expenses: Expense[];
    }
  | {
      userObject: { username: string };
      error: string;
    };

type Errors = { message: string }[];

type Currency = { name: string; exchangeRate: number };

const mainStyle = css`
  color: #26325b;

  h2 {
    text-align: center;
  }
`;

const addExpenseStyle = css`
  background: #01aca3;
  color: white;
  width: 250px;
  height: 300px;
  margin: auto;
  padding: 10px 15px;
  border-radius: 15%;
  text-align: center;
  /* h1 {
    text-align: center;
  } */
  p {
    text-align: center;
  }
  a {
    color: white;
  }
  input {
    /* margin: 10px; */
  }
`;

const dateInputStyle = css`
  width: 150px;
  margin: 10px;
`;

const priceInputStyle = css`
  width: 70px;
  margin: 10px 10px 10px 0;
`;

const currencyInputStyle = css`
  margin: 10px 0 10px 10px;
`;

const nameInputStyle = css`
  width: 150px;
  margin: 10px;
`;

const categoryInputStyle = css`
  width: 150px;
  margin: 10px;
`;

const flexPriceStyle = css`
  display: flex;
  justify-content: center;
  width: 150px;
  margin: auto;
`;

const buttonStyle = css`
  width: 100px;
  height: 25px;
  margin: 25px auto;
  font-size: 16px;
  background: #f4ac40;
  color: white;
  border-radius: 10px;
  border-style: none;
`;

const deleteExpenseStyle = css`
  background: #01aca3;
  color: white;
  width: 250px;
  height: 200px;
  margin: auto;
  padding: 10px 15px;
  border-radius: 15%;
  text-align: center;
  /* h1 {
    text-align: center;
  } */
  p {
    text-align: center;
  }
  a {
    color: white;
  }
  input {
    margin: 10px;
    width: 150px;
  }
`;

const deleteListStyle = css`
  width: 250px;
  margin: auto;
`;

const deleteItemFlexStyle = css`
  display: flex;
`;

const anotherSearchButtonStyle = css`
  width: 210px;
  height: 25px;
  font-size: 16px;
  margin: 20px auto;
  background: #f4ac40;
  color: white;
  border-radius: 10px;
  border-style: none;
`;

const deleteButtonStyle = css`
  width: 80px;
  height: 15px;
  font-size: 12px;
  margin-left: 20px;
  background: #eb584476;
  border: solid #e4361f76;
  color: white;
  /* border-radius: 10px; */
  border-style: none;
`;

const latestExpensesListStyle = css`
  width: 210px;
  margin: auto;
`;

const mainFlexStyle = css`
  display: flex;
  flex-wrap: wrap;
`;

const addExpenseFlexStyle = css``;

const deleteExpenseFlexStyle = css``;

const listExpensesFlexStyle = css``;

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
  const [exchangeRate, setExchangeRate] = useState('1');
  const [currencyList, setCurrencyList] = useState<Currency[]>([]);
  const [displayList, setDisplayList] = useState(false);
  const [deleteError, setDeleteError] = useState(false);

  // Display all expenses on first render or when userId changes
  useEffect(() => {
    if (!('error' in props)) {
      const fetchExpenses = async () => await getAllExpenses(props.user.id);
      fetchExpenses().catch(console.error);
    }
  }, [props]);

  // Get current exchange rates

  useEffect(() => {
    const fetchExchangeRates = async () => await getExchangeRates();
    fetchExchangeRates().catch(console.error);
  }, []);

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

    if ('error' in expenseResponseBody) {
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
    if (!('error' in props)) {
      await getAllExpenses(props.user.id);
    }
  }

  // Search through expenses

  function findExpense(expenseName: string, expenseDate: string) {
    if (!('error' in props)) {
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
    if (!('error' in props)) {
      await getAllExpenses(props.user.id);
    }
  }

  async function getExchangeRates() {
    // const exchangeRatesResponse = await fetch('/api/getExchangeRates');
    // const exchangeRatesResponseBody = await exchangeRatesResponse.json();

    // const currencyObject = exchangeRatesResponseBody.data.conversion_rates;
    // const currencyArray: Currency[] = [];

    // for (const currency in currencyObject) {
    //   currencyArray.push({
    //     name: currency,
    //     exchangeRate: currencyObject[currency],
    //   });
    // }

    // setCurrencyList(currencyArray);
    // console.log('currencyArray', currencyArray);
    return exchangeRatesResponseBody;
  }

  return (
    <Layout userObject={props.userObject}>
      <Head>
        <title>Draku</title>
        <meta name="description" content="Draku money management" />
      </Head>
      <div css={mainStyle}>
        <h1>Manage your expenses </h1>
        {/* <h2>{currentMonth}</h2> */}
        <div css={mainFlexStyle}>
          <div css={addExpenseFlexStyle}>
            <h2>Add an expense</h2>
            <div css={addExpenseStyle}>
              <form
                onSubmit={async (event) => {
                  event.preventDefault();
                  await getAllExpenses(props.user.id);
                  console.log('inputPrice', inputPrice);
                  await addExpense(
                    props.user.id,
                    Number(inputCategoryId),
                    inputName,
                    Math.round(
                      ((Number(inputPrice) * 100) / Number(exchangeRate)) * 100,
                    ) / 100,
                    inputDate,
                  );
                  console.log('currency', typeof exchangeRate, exchangeRate);
                }}
              >
                <label>
                  Date
                  <br />
                  <input
                    css={dateInputStyle}
                    type="date"
                    value={inputDate}
                    min={
                      new Date(
                        new Date().setFullYear(new Date().getFullYear() - 1),
                      )
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
                <br />
                <div css={flexPriceStyle}>
                  <label>
                    Price
                    <br />
                    <input
                      css={priceInputStyle}
                      type="number"
                      value={inputPrice}
                      onChange={(event) =>
                        setInputPrice(event.currentTarget.value)
                      }
                    />
                  </label>
                  <br />
                  <label>
                    Currency
                    <br />
                    <select
                      css={currencyInputStyle}
                      value={exchangeRate}
                      onChange={(event) =>
                        setExchangeRate(event.currentTarget.value)
                      }
                    >
                      {/* <option value="EUR">EUR</option> */}
                      {currencyList.map((curr) => {
                        return (
                          <option key={curr.name} value={curr.exchangeRate}>
                            {curr.name}
                          </option>
                        );
                      })}
                    </select>
                  </label>
                </div>
                <label>
                  Name
                  <br />
                  <input
                    css={nameInputStyle}
                    value={inputName}
                    onChange={(event) =>
                      setInputName(event.currentTarget.value)
                    }
                  />
                </label>
                <br />
                <label>
                  Category
                  <br />
                  <select
                    css={categoryInputStyle}
                    value={inputCategoryId}
                    onChange={(event) => {
                      setInputCategoryId(event.currentTarget.value);
                    }}
                  >
                    <option value="">Choose a category</option>

                    {props.categories.map((category) => {
                      return (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      );
                    })}
                  </select>
                </label>
                <br />
                <button css={buttonStyle}>Add</button>
              </form>
            </div>
            <div>
              {errors.map((error) => {
                return (
                  <div key={`error-${error.message}`}>{error.message}</div>
                );
              })}
            </div>
          </div>
          <div css={deleteExpenseFlexStyle}>
            <h2>Delete an expense</h2>
            {displayList ? (
              <div css={deleteListStyle}>
                <button
                  css={anotherSearchButtonStyle}
                  onClick={() => setDisplayList(false)}
                >
                  Search another expense
                </button>
                {filteredExpenses.length === 0 && <div>No expenses found</div>}
                {filteredExpenses.map((expense) => {
                  return (
                    <div css={deleteItemFlexStyle} key={`delete-${expense.id}`}>
                      <div>
                        {' '}
                        {new Intl.DateTimeFormat('en-GB', {
                          day: '2-digit',
                          month: 'short',
                        }).format(new Date(expense.date))}{' '}
                        {expense.name} {expense.price / 100}€{' '}
                      </div>
                      <button
                        css={deleteButtonStyle}
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
              </div>
            ) : (
              <div css={deleteExpenseStyle}>
                <form
                  onSubmit={(event) => {
                    event.preventDefault();
                    if (!deleteName && !deleteDate) {
                      setDeleteError(true);
                      return;
                    }
                    setDeleteError(false);
                    const filteredArray = findExpense(deleteName, deleteDate);
                    console.log(filteredArray);
                    setDeleteName('');
                    setDeleteDate('');
                    setDisplayList(true);
                  }}
                >
                  <label>
                    Name
                    <br />
                    <input
                      value={deleteName}
                      onChange={(event) =>
                        setDeleteName(event.currentTarget.value)
                      }
                    />
                  </label>
                  <br />
                  <label>
                    Date
                    <br />
                    <input
                      type="date"
                      max={new Date().toISOString().split('T')[0]}
                      value={deleteDate}
                      onChange={(event) =>
                        setDeleteDate(event.currentTarget.value)
                      }
                    />
                  </label>
                  <br />
                  {deleteError && <div> Add an expense name or a date</div>}
                  <br />
                  <button css={buttonStyle}>Search</button>
                </form>
              </div>
            )}
          </div>
          <div css={listExpensesFlexStyle}>
            <h2>Latest expenses </h2>
            <div>
              {expenses.length === 0 && <div>No expenses yet</div>}
              <div css={latestExpensesListStyle}>
                {expenses.reverse().map((expense, index) => {
                  if (index < 5) {
                    return (
                      <div key={`expense-${expense.id}`}>
                        {new Intl.DateTimeFormat('en-GB', {
                          day: '2-digit',
                          month: 'short',
                        }).format(new Date(expense.date))}{' '}
                        {expense.name} {expense.price / 100}€
                      </div>
                    );
                  }
                  return null;
                })}
              </div>
            </div>
          </div>
        </div>
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

  const expenses = await getAllExpensesByUserId(user.id);
  // console.log('expenses', expenses, typeof expenses[1].date);
  const expensesDateToString = expenses.map((expense) => {
    expense.date = expense.date.toISOString();
    // expense.date = new Date(expense.date);
    return expense;
  });

  console.log('expensesDateToString', expensesDateToString);

  const expensesSortedByDate = expensesDateToString.sort(
    (a: Expense, b: Expense) => {
      return a.date.localeCompare(b.date);
    },
  );

  console.log('expensesSortedByDate', expensesSortedByDate);

  return {
    props: {
      user: user,
      categories: categories,
      expenses: expensesSortedByDate,
      // expenses: expenses,
    },
  };
}
