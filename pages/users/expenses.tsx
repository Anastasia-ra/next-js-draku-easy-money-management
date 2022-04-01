import { css } from '@emotion/react';
import { GetServerSidePropsContext } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import Layout from '../../components/Layout';
import { getExpensesList } from '../../graphFunctions/fetchApi';
import {
  getAllCategoriesbyUserId,
  getUserByValidSessionToken,
  Category,
  Expense,
  getAllExpensesByUserId,
  getExpensesByMonthByUser,
} from '../../util/database';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  BarElement,
} from 'chart.js';
import { Doughnut, Line } from 'react-chartjs-2';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import {
  colors,
  getDoughnutCategoriesAndExpensesData,
} from '../../graphFunctions/charts';

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  BarElement,
  ChartDataLabels,
);

type Props =
  | {
      userObject: { username: string };
      user: { id: number; username: string };
      categories: Category[];
      expenses: Expense[];
      expensesCurrentMonth: Expense[];
      currentMonth: string;
      currentYear: string;
    }
  | {
      userObject: { username: string };
      error: string;
    };

type Errors = { message: string }[];

type Currency = { name: string; exchangeRate: number };

const breakPointsWidth = [480, 800];
const mediaQueryWidth = breakPointsWidth.map(
  (bp) => `@media (max-width: ${bp}px)`,
);

const breakPointsHeight = [900];
const mediaQueryHeight = breakPointsHeight.map(
  (bp) => `@media (max-height: ${bp}px)`,
);

const mainStyle = css`
  color: #26325b;
  background: #ffffff;
  border-radius: 10px;
  margin: 2vh auto;
  text-align: left;
  max-width: 800px;
  height: 780px;
  box-shadow: 0 0 8px #cccccc;
  ${mediaQueryHeight[0]} {
    height: 780px;
  }
  ${mediaQueryWidth[1]} {
    box-shadow: 0 0 0 white;
    border-radius: 0;
    /* min-height: 85vh; */
  }
  h1 {
    /* font-size: 26px; */
    text-align: left;
    padding: 3vh 0 2vh 20px;
    /* margin: 15px 0 5px 20px; */
    ${mediaQueryHeight[0]} {
      padding: 2vh 0 1vh 20px;
    }
    ${mediaQueryWidth[0]} {
      padding: 0vh 0 1vh 20px;
    }
  }
  h2 {
    text-align: center;
    font-size: 18px;
  }
  p {
    font-size: 18px;
    text-align: left;
    margin: 5px 0 5vh 20px;
    ${mediaQueryHeight[0]} {
      margin: 5px 0 2vh 20px;
    }
  }
`;

const addExpenseStyle = css`
  background: #01aca3;
  color: white;
  width: 220px;
  height: 270px;
  margin: auto;
  padding: 10px 15px;
  border-radius: 10px;
  text-align: center;
`;

const dateInputStyle = css`
  width: 150px;
  margin: 10px 10px 0 10px;
`;

const priceInputStyle = css`
  width: 70px;
  margin: 5px 10px 2px 0;
`;

const currencyInputStyle = css`
  width: 60px;
  margin: 5px 0 5px 10px;
`;

const nameInputStyle = css`
  width: 150px;
  margin: 5px;
`;

const categoryInputStyle = css`
  width: 150px;
  margin: 5px;
`;

const flexPriceStyle = css`
  display: flex;
  justify-content: center;
  width: 150px;
  margin: auto;
`;

const addButtonStyle = css`
  width: 100px;
  height: 25px;
  margin: 15px auto;
  font-size: 16px;
  background: #f4ac40;
  color: white;
  transition: color 0.3s ease-in 0s;
  border-radius: 10px;
  border-style: none;
  :hover {
    color: #04403d;
  }
`;

const deleteExpenseStyle = css`
  background: #01aca3;
  color: white;
  width: 220px;
  height: 270px;
  /* margin: auto; */
  padding: 10px 15px;
  border-radius: 10px;
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
    margin: 5px;
    width: 150px;
  }
`;

const deleteListStyle = css`
  width: 220px;
  margin: auto;
`;

const anotherSearchButtonStyle = css`
  width: 210px;
  height: 25px;
  font-size: 16px;
  margin: 20px auto;
  background: #f4ac40;
  color: white;
  transition: color 0.3s ease-in 0s;
  border-radius: 5px;
  border-style: none;
  :hover {
    color: #04403d;
  }
`;

// const deleteButtonStyle = css`
//   width: 80px;
//   height: 15px;
//   font-size: 12px;
//   margin-left: 20px;
//   background: #eb584476;
//   border: solid #e4361f76;
//   color: white;
//   /* border-radius: 10px; */
//   border-style: none;
// `;

const deleteButtonStyle = css`
  width: 25px;
  height: 20px;
  font-size: 12px;
  margin: 2px 2px 2px 5px;
  background: #e0415e;
  /* border: solid #e4361f76; */
  color: white;
  border-radius: 10%;
  border-style: none;
  align-self: center;
  :disabled {
    background: #8b8889;
  }
`;

const deleteItemFlexStyle = css`
  display: flex;
  align-items: center;
  font-size: 14px;
`;

const singleItemtoDeleteStyle = css`
  display: flex;
`;

const deleteNameStyle = css`
  width: 100px;
`;

const deleteDateStyle = css`
  padding: 0 5px;
`;

const deletePriceStyle = css`
  width: 60px;
`;

const singleExpenseStyle = css`
  display: flex;
  flex-wrap: nowrap;
`;

const expenseNameStyle = css`
  padding: 0 2px;
  text-align: start;
  width: 130px;
`;

const expenseDateStyle = css`
  text-align: start;
  width: 65px;
`;

const expensePriceStyle = css`
  text-align: start;
  width: 60px;
`;

const mainFlexStyle = css`
  margin: auto;
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
  max-width: 600px;
  align-items: center;
`;

const addErrorStyle = css`
  /* color: #26325b;
 width: 2 */
`;

const mainStyleError = css`
  color: #26325b;
  background: #ffffff;
  border-radius: 10px;
  margin: 2vh auto;
  text-align: left;
  max-width: 800px;
  box-shadow: 0 0 8px #cccccc;
  padding: 1px 5px 5px 10px;
  ${mediaQueryWidth[1]} {
    box-shadow: 0 0 0 white;
    border-radius: 0;
  }
  h1 {
    text-align: left;
    padding: 3vh 0 2vh 20px;
    ${mediaQueryWidth[0]} {
      padding: 0vh 0 1vh 20px;
    }
  }
  p {
    font-size: 18px;
    text-align: left;
    margin: 5px 0 5vh 20px;
  }
`;

const chartDoughnutCategoriesStyle = css`
  display: inline-block;
  width: 220px;
  height: 250px;
  /* ${mediaQueryWidth[0]} {
    margin: 30px 0 5px 0;
  } */
`;

const chartStyle = css`
  background-color: #fbf9f9;
  border-radius: 5px;
  box-shadow: 0 0 8px #ccc;
  /* display: block; */
  /* margin: auto; */
`;

const latestExpensesListStyle = css`
  width: 250px;
  height: 270px;
  /* margin: auto; */
  background-color: #fbf9f9;
  border-radius: 5px;
  box-shadow: 0 0 8px #ccc;
  h2 {
    margin-top: 10px;
  }
`;

const flexChartStyle = css`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
  /* column-gap: 20px; */
  margin: auto;
  max-width: 600px;
`;

function getColorDot(index: number) {
  const colorDotStyle = css`
    border-radius: 50%;
    width: 15px;
    height: 15px;
    flex-shrink: 0;
    background: ${colors[index]};
  `;
  return colorDotStyle;
}

const addExpenseFlexStyle = css``;

const deleteExpenseFlexStyle = css``;

const listExpensesFlexStyle = css``;

export default function Expenses(props: Props) {
  const [inputDate, setInputDate] = useState('');
  const [inputPrice, setInputPrice] = useState('');
  const [inputName, setInputName] = useState('');
  const [inputCategoryId, setInputCategoryId] = useState('');
  const [errors, setErrors] = useState<Errors>([]);
  const [expenses, setExpenses] = useState<Expense[]>(
    'error' in props ? [] : props.expenses,
  );
  const [deleteName, setDeleteName] = useState('');
  const [deleteCategoryId, setDeleteCategoryId] = useState('');
  const [deleteDate, setDeleteDate] = useState('');
  const [filteredExpenses, setFilteredExpenses] = useState<Expense[]>([]);
  const [exchangeRate, setExchangeRate] = useState('1');
  const [currencyList, setCurrencyList] = useState<Currency[]>([]);
  const [displayList, setDisplayList] = useState(false);
  const [deleteError, setDeleteError] = useState(false);

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

  if (props.categories.length === 0) {
    return (
      <Layout userObject={props.userObject}>
        <Head>
          <title>Expenses</title>
          <meta name="description" content="Your expenses " />
        </Head>
        <div css={mainStyleError}>
          <h1>To add expenses, you first have to add a category</h1>
          <p>
            You can add your first categories in the{' '}
            <Link href="/users/categoriesManagement">
              <a>categories management</a>
            </Link>{' '}
            section.
          </p>
        </div>
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

    // if (!('error' in props)) {
    //   setCurrentMonthExpenses(
    //     expenses.filter((expense) => {
    //       const year = expense.date.split('-')[0];
    //       if (props.currentYear === year) {
    //         console.log('true');
    //         const month = expense.date.split('-')[1];
    //         return parseInt(props.currentMonth, 10) === parseInt(month, 10);
    //       }
    //       return false;
    //     }),
    //   );
    // }
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
    if (!('error' in props)) {
      await getAllExpenses(props.user.id);
      // setCurrentMonthExpenses(
      //   expenses.filter((expense) => {
      //     const year = expense.date.split('-')[0];
      //     if (props.currentYear === year) {
      //       console.log('true');
      //       const month = expense.date.split('-')[1];
      //       return parseInt(props.currentMonth, 10) === parseInt(month, 10);
      //     }
      //     return false;
      //   }),
      // );
    }
  }

  function findExpense(
    expenseName: string,
    expenseDate: string,
    categoryId: number,
  ) {
    let filteredArray;

    if (!('error' in props)) {
      if (expenseDate !== '') {
        filteredArray = expenses.filter((expense) =>
          expense.date.split('T')[0].split('-').join('-').includes(expenseDate),
        );

        if (expenseName !== '') {
          filteredArray = filteredArray.filter((expense) =>
            expense.name.toLowerCase().includes(expenseName.toLowerCase()),
          );

          if (categoryId) {
            filteredArray = filteredArray.filter(
              (expense) => expense.categoryId === categoryId,
            );
            setFilteredExpenses(filteredArray);
            return filteredArray;
          }
          setFilteredExpenses(filteredArray);
          return filteredArray;
        }
        setFilteredExpenses(filteredArray);
        return filteredArray;
      } else if (expenseName !== '') {
        filteredArray = expenses.filter((expense) =>
          expense.name.toLowerCase().includes(expenseName.toLowerCase()),
        );

        if (categoryId) {
          filteredArray = filteredArray.filter(
            (expense) => expense.categoryId === categoryId,
          );
          setFilteredExpenses(filteredArray);
          return filteredArray;
        }
        setFilteredExpenses(filteredArray);
        return filteredArray;
      }
      if (categoryId) {
        filteredArray = expenses.filter(
          (expense) => expense.categoryId === categoryId,
        );
        setFilteredExpenses(filteredArray);
        return filteredArray;
      }
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
    const exchangeRatesResponse = await fetch('/api/getExchangeRates');
    const exchangeRatesResponseBody = await exchangeRatesResponse.json();

    const currencyObject = exchangeRatesResponseBody.data.conversion_rates;
    const currencyArray: Currency[] = [];

    for (const currency in currencyObject) {
      currencyArray.push({
        name: currency,
        exchangeRate: currencyObject[currency],
      });
    }

    setCurrencyList(currencyArray);
    console.log('currencyArray', currencyArray);
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
        <p>Here you can enter, delete or review your latest expenses. </p>
        {/* <h2>{currentMonth}</h2> */}
        {expenses.length > 0 && (
          <div css={flexChartStyle}>
            <div css={chartStyle}>
              <div css={chartDoughnutCategoriesStyle}>
                <Doughnut
                  // width="150"
                  // height="150"
                  data={
                    getDoughnutCategoriesAndExpensesData(
                      props.categories,
                      expenses.filter((expense) => {
                        const year = expense.date.split('-')[0];
                        if (props.currentYear === year) {
                          const month = expense.date.split('-')[1];
                          return (
                            parseInt(props.currentMonth, 10) ===
                            parseInt(month, 10)
                          );
                        }
                        return false;
                      }),
                    ).data
                  }
                  options={
                    getDoughnutCategoriesAndExpensesData(
                      props.categories,
                      expenses.filter((expense) => {
                        const year = expense.date.split('-')[0];
                        if (props.currentYear === year) {
                          const month = expense.date.split('-')[1];
                          return (
                            parseInt(props.currentMonth, 10) ===
                            parseInt(month, 10)
                          );
                        }
                        return false;
                      }),
                    ).options
                  }
                />
              </div>
            </div>
            <div css={latestExpensesListStyle}>
              <h2>Latest expenses </h2>
              {expenses.reverse().map((expense, index) => {
                if (index < 10) {
                  return (
                    <div css={singleExpenseStyle} key={`expense-${expense.id}`}>
                      <div css={expenseNameStyle}>{expense.name}</div>{' '}
                      <div css={expensePriceStyle}>{expense.price / 100}€</div>
                      <div css={expenseDateStyle}>
                        {new Intl.DateTimeFormat('en-GB', {
                          day: '2-digit',
                          month: 'short',
                        }).format(new Date(expense.date))}{' '}
                      </div>{' '}
                    </div>
                  );
                }
                return null;
              })}
            </div>
          </div>
        )}

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
                      (Number(inputPrice) * 100) / Number(exchangeRate),
                    ),
                    inputDate,
                  );
                  console.log('expenses in form', expenses);
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
                    maxLength={30}
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
                <div css={addErrorStyle}>
                  {errors.map((error) => {
                    return (
                      <div key={`error-${error.message}`}>{error.message}</div>
                    );
                  })}
                </div>
                <button css={addButtonStyle}>Add</button>
              </form>
            </div>
          </div>
          {expenses.length > 0 && (
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
                  {filteredExpenses.length === 0 && (
                    <div>No expenses found</div>
                  )}
                  {filteredExpenses.map((expense) => {
                    return (
                      <div
                        css={deleteItemFlexStyle}
                        key={`delete-${expense.id}`}
                      >
                        <div css={singleItemtoDeleteStyle}>
                          {' '}
                          <div css={deleteDateStyle}>
                            {new Intl.DateTimeFormat('en-GB', {
                              day: '2-digit',
                              month: 'short',
                            }).format(new Date(expense.date))}{' '}
                          </div>{' '}
                          <div css={deleteNameStyle}>{expense.name}</div>{' '}
                          <div css={deletePriceStyle}>
                            {expense.price / 100}€
                          </div>
                        </div>
                        <button
                          css={deleteButtonStyle}
                          onClick={async () => {
                            await deleteExpense(expense.id);
                            setFilteredExpenses(
                              filteredExpenses.filter(
                                (e) => e.id !== expense.id,
                              ),
                            );
                          }}
                        >
                          <Image
                            src="/delete.png"
                            width="20px"
                            height="20px"
                            alt="garbage can"
                          />
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
                      if (!deleteName && !deleteDate && !deleteCategoryId) {
                        setDeleteError(true);
                        return;
                      }
                      setDeleteError(false);
                      const filteredArray = findExpense(
                        deleteName,
                        deleteDate,
                        Number(deleteCategoryId),
                      );
                      console.log(filteredArray);
                      setDeleteName('');
                      setDeleteDate('');
                      setDeleteCategoryId('');
                      setDisplayList(true);
                    }}
                  >
                    <label>
                      Name
                      <br />
                      <input
                        maxLength={30}
                        value={deleteName}
                        onChange={(event) =>
                          setDeleteName(event.currentTarget.value)
                        }
                      />
                    </label>
                    <br />
                    <label>
                      Category
                      <br />
                      <select
                        css={categoryInputStyle}
                        value={deleteCategoryId}
                        onChange={(event) => {
                          setDeleteCategoryId(event.currentTarget.value);
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

                    <button css={addButtonStyle}>Search</button>
                  </form>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const sessionToken = context.req.cookies.sessionToken;
  const user = await getUserByValidSessionToken(sessionToken);

  console.log('sessionToken', sessionToken);
  console.log('user GSSP', user);

  if (!user) {
    return {
      redirect: {
        destination: `/login?returnTo=/users/expenses`,
        permanent: false,
      },
    };
  }

  const categories = await getAllCategoriesbyUserId(user.id);

  const expenses = await getAllExpensesByUserId(user.id);
  const expensesDateToString = JSON.parse(JSON.stringify(expenses));

  const expensesSortedByDate = expensesDateToString.sort(
    (a: Expense, b: Expense) => {
      return a.date.localeCompare(b.date);
    },
  );

  const currentMonth = new Intl.DateTimeFormat('en-US', {
    month: 'numeric',
  }).format(new Date());

  const currentYear = new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
  }).format(new Date());

  console.log('year, month', currentMonth, currentYear);

  const expensesCurrentMonth = await getExpensesByMonthByUser(
    Number(currentMonth),
    Number(currentYear),
    user.id,
  );

  const expensesCurrentMonthDateToString = JSON.parse(
    JSON.stringify(expensesCurrentMonth),
  );

  return {
    props: {
      user: user,
      categories: categories,
      expenses: expensesSortedByDate.reverse(),
      expensesCurrentMonth: expensesCurrentMonthDateToString,
      currentMonth: currentMonth,
      currentYear: currentYear,
    },
  };
}
