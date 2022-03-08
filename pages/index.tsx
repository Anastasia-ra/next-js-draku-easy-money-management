import { css } from '@emotion/react';
import { GetServerSidePropsContext } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import {
  DoughnutCategories,
  DoughnutProgress,
  LineChart,
  ProgressBar,
} from '../components/Chart';
import Layout from '../components/Layout';
import {
  getCategoriesList,
  getExpensesList,
} from '../graph-functions/fetchApi';
import {
  getSharePerCategory,
  getSumExpensesCategory,
} from '../graph-functions/sum-per-category';
import { getBudgetProgress } from '../graph-functions/budgetProgress';
import { getUserByValidSessionToken, Expense } from '../util/database';

const chartDoughnutStyle = css`
  width: 300px;
  height: 300px;
`;

const chartLineStyle = css`
  width: 450px;
  height: 300px;
`;

type Props =
  | { userObject: { username: string }; user: { id: number; username: string } }
  | { userObject: { username: string }; error: string };

export default function Home(props: Props) {
  const [expensesList, setExpensesList] = useState([]);
  const [categoriesList, setCategoriesList] = useState([]);

  const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'Mai',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Dec',
  ];

  async function getAllExpenses(userId: number) {
    const expensesListResponseBody = await getExpensesList(userId);

    const expensesWithMonths = expensesListResponseBody.expensesList.map(
      (e: Expense) => {
        const expenseMonth = new Date(e.date).getMonth();
        return {
          ...e,
          numericMonth: expenseMonth + 1,
          month: months[expenseMonth],
        };
      },
    );
    console.log('expensesWithMonths', expensesWithMonths);

    setExpensesList(expensesWithMonths);
  }
  async function getAllCategories(userId: number) {
    const categoriesListResponseBody = await getCategoriesList(userId);
    setCategoriesList(categoriesListResponseBody.categoriesList);
  }

  useEffect(() => {
    if (!('error' in props)) {
      const fetchExpenses = async () => await getAllExpenses(props.user.id);
      fetchExpenses().catch(console.error);
    }
  }, [props]);

  useEffect(() => {
    if (!('error' in props)) {
      const fetchCategories = async () => await getAllCategories(props.user.id);
      fetchCategories().catch(console.error);
    }
  }, [props]);

  if ('error' in props) {
    return (
      <Layout userObject={props.userObject}>
        <Head>
          <title>Draku</title>
          <meta name="description" content="Draku money management " />
        </Head>
        <h1>Welcome to draku!</h1>
        <p>Please create an account or login to start budgeting 😁</p>
        <Link href="/signup">
          <a>Sign up</a>
        </Link>
        <Link href="/login">
          <a>Login</a>
        </Link>
      </Layout>
    );
  }

  // Data for categories doughnut chart
  const categoriesWithSum = getSumExpensesCategory(
    categoriesList,
    expensesList,
  );
  const categoriesWithShares = getSharePerCategory(categoriesWithSum);
  console.log('categoriesWithShares', categoriesWithShares);

  const categoriesWithSharesFiltered = categoriesWithShares.filter(
    (e) => e.shareOfExpenses !== 0,
  );

  console.log('categoriesWithSharesFiltered', categoriesWithSharesFiltered);

  const categories = categoriesWithSharesFiltered.map((e) => e.name);

  const categoriesData = categoriesWithSharesFiltered.map(
    (e) => e.shareOfExpenses,
  );

  // function setDoughnutData() {
  //   dataDoughnutCategories.labels = categories;
  //   dataDoughnutCategories.datasets[0].data = categoriesData;
  //   return dataDoughnutCategories;
  // }

  const dataDoughnutCategories = {
    labels: categories,
    datasets: [
      {
        label: 'Expenses per category',
        data: categoriesData,
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(255, 206, 86, 0.2)',
          'rgba(75, 192, 192, 0.2)',
          'rgba(153, 102, 255, 0.2)',
          'rgba(255, 159, 64, 0.2)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  // Data for progress chart

  const budgetPercentage = getBudgetProgress(categoriesList, expensesList);

  const dataProgressCircle = {
    labels: ['Expenses', 'Budget left'],
    datasets: [
      {
        label: 'Budget',
        data: [1 - budgetPercentage, budgetPercentage],
        backgroundColor: ['white', 'grey'],
        borderColor: ['grey', 'grey'],
        borderWidth: 1,
      },
    ],
  };

  // Data for expenses overview

  console.log('expensesList', expensesList);

  return (
    <Layout userObject={props.userObject}>
      <Head>
        <title>Draku</title>
        <meta name="description" content="Draku money management" />
      </Head>
      <h1>Welcome to Draku, {props.user.username}!</h1>
      <br />
      <Link href="/users/expenses">
        <a>Start saving here</a>
      </Link>
      <br />
      <Link href="/users/categoriesManagement">
        <a>Manage your categories</a>
      </Link>
      <br />
      <Link href="/users/budgetManagement">
        <a>Manage your budget</a>
      </Link>
      <br />
      <p>Doughnut Total</p>
      <div css={chartDoughnutStyle}>
        <DoughnutCategories data={dataDoughnutCategories} />
      </div>
      <div css={chartDoughnutStyle}>
        <DoughnutProgress data={dataProgressCircle} />
      </div>
      <div css={chartLineStyle}>
        <LineChart />
      </div>
      <div css={chartLineStyle}>
        <ProgressBar />
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

  return {
    props: { user: user },
  };
}
