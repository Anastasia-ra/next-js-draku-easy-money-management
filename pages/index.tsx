import { css } from '@emotion/react';
import { GetServerSidePropsContext } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import Layout from '../components/Layout';
// import {
//   getSharePerCategory,
//   getSumExpensesCategory,
// } from '../graph-functions/sum-per-category';
// import { getTotalBudgetProgress } from '../graph-functions/budgetProgress';
import {
  getUserByValidSessionToken,
  Expense,
  Category,
  getAllCategoriesbyUserId,
  getAllExpensesByUserId,
  getExpensesByMonthByUser,
} from '../util/database';
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
  // ChartOptions,
} from 'chart.js';
import { Doughnut, Line } from 'react-chartjs-2';
import ChartDataLabels from 'chartjs-plugin-datalabels';
// import { Context } from 'chartjs-plugin-datalabels';
// import Options from 'chartjs-plugin-datalabels';
import { useState } from 'react';
import { getLastMonths, sumPerMonth } from '../graph-functions/sumPerMonth';
import {
  getDoughnutCategoriesData,
  getLineData,
  getProgressChartData,
} from '../graph-functions/charts';
// import Wallet from '../public/wallet-svgrepo-com.svg';

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
    }
  | { userObject: { username: string }; error: string };

const mainStyle = css`
  color: #26325b;
  margin: 0 auto;
  text-align: center;
  max-width: 700px;
  h1 {
    /* font-size: 26px;
    margin: 40px 0; */
  }
  p {
    font-size: 18px;
    text-align: left;
    margin: 30px 5vw;
  }
`;

const welcomeHeaderStyle = css`
  font-size: 26px;
  margin: 40px 0;
`;

const imageStyle = css`
  margin: 20px auto;
`;

const signUpLink = css`
  background: #01aca3;
  margin: 20px auto;
  height: 30px;
  width: 250px;
  border-radius: 10px;

  a {
    color: white;
    font-size: 18px;
    line-height: 25px;
  }

  a:hover {
    color: #04403d;
  }
`;

const dougnhutsStyle = css`
  margin: 30px 0;
`;

const chartDoughnutProgressStyle = css`
  display: inline-block;
  width: 180px;
  height: 200px;
`;
const chartDoughnutCategoriesStyle = css`
  display: inline-block;
  width: 180px;
  height: 200px;
`;

const categoriesStyle = css`
  display: inline-flex;
  flex-direction: column;
`;

const switchButtonStyle = css`
  width: 100px;
  height: 20px;
  margin: 0 auto;
  font-size: 12px;
  background: #01aca3;
  color: white;
  border-radius: 10px;
  border-style: none;
`;

const chartLineStyle = css`
  width: 280px;
  height: 180px;
  margin: 0 auto;
`;

const linksStyle = css`
  background: #01aca3;
  width: 200px;
  margin: auto;
  text-align: left;

  a {
    color: white;
    text-align: start;
    padding-left: 15px;
  }
`;

const chartsHeaderStyle = css`
  margin: 10px 0;
`;

export default function Home(props: Props) {
  const [switchCategories, setSwitchCategories] = useState(false);

  if ('error' in props) {
    return (
      <Layout userObject={props.userObject}>
        <Head>
          <title>Draku</title>
          <meta name="description" content="Draku money management " />
        </Head>
        <div css={mainStyle}>
          <h1 css={welcomeHeaderStyle}>
            Welcome to Draku, your simple money management solution.
          </h1>
          <Image
            src="/la-finance.png"
            width="200px"
            height="200px"
            css={imageStyle}
          />
          <p>
            Draku makes managing personal finances as easy as sleeping! With
            Draku you can easily record your financial transactions, set budgets
            and review your monthly and yearly spendings.
          </p>
          <div css={signUpLink}>
            <Link href="/signup">
              <a>Sign up here to start saving</a>
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  const lastMonthsWithExpenses = sumPerMonth(props.expenses, getLastMonths());

  return (
    <Layout userObject={props.userObject} css={mainStyle}>
      <Head>
        <title>Draku</title>
        <meta name="description" content="Draku money management" />
      </Head>
      <div css={mainStyle}>
        <h1 css={chartsHeaderStyle}>Welcome {props.user.username}!</h1>

        <br />

        <div css={chartLineStyle}>
          <Line
            data={getLineData(lastMonthsWithExpenses).data}
            options={getLineData(lastMonthsWithExpenses).options}
          />
        </div>
        <div css={dougnhutsStyle}>
          <div css={chartDoughnutProgressStyle}>
            <Doughnut
              // width="150"
              // height="150"
              data={
                getProgressChartData(
                  props.categories,
                  props.expensesCurrentMonth,
                ).data
              }
              options={
                getProgressChartData(
                  props.categories,
                  props.expensesCurrentMonth,
                ).options
              }
            />
          </div>
          <div css={categoriesStyle}>
            {switchCategories ? (
              <div css={chartDoughnutCategoriesStyle}>
                <Doughnut
                  // width="150"
                  // height="150"
                  data={
                    getDoughnutCategoriesData(props.categories, props.expenses)
                      .data
                  }
                  options={
                    getDoughnutCategoriesData(props.categories, props.expenses)
                      .options
                  }
                />
              </div>
            ) : (
              <div css={chartDoughnutCategoriesStyle}>
                <Doughnut
                  // width="150"
                  // height="150"
                  data={
                    getDoughnutCategoriesData(
                      props.categories,
                      props.expensesCurrentMonth,
                    ).data
                  }
                  options={
                    getDoughnutCategoriesData(
                      props.categories,
                      props.expensesCurrentMonth,
                    ).options
                  }
                />
              </div>
            )}
            <button
              css={switchButtonStyle}
              onClick={() => setSwitchCategories(!switchCategories)}
            >
              {switchCategories ? 'See this month' : 'See all'}
            </button>
          </div>
        </div>

        {/* <Wallet /> */}

        <div css={linksStyle}>
          <Link href="/users/expenses">
            <a>Add new expenses</a>
          </Link>
          <br />
          <Link href="/users/categoriesManagement">
            <a>Manage your categories</a>
          </Link>
          <br />
          <Link href="/users/budgetManagement">
            <a>Manage your budget</a>
          </Link>
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

  const expensesDateToString = expenses.map((expense) => {
    expense.date = expense.date.toISOString();
    return expense;
  });

  const currentMonth = new Intl.DateTimeFormat('en-US', {
    month: 'numeric',
  }).format(new Date());

  const currentYear = new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
  }).format(new Date());

  const expensesCurrentMonth = await getExpensesByMonthByUser(
    Number(currentMonth),
    Number(currentYear),
    user.id,
  );

  const expensesCurrentMonthDateToString = expensesCurrentMonth.map(
    (expense) => {
      expense.date = expense.date.toISOString();
      return expense;
    },
  );

  return {
    props: {
      user: user,
      categories: categories,
      expenses: expensesDateToString,
      expensesCurrentMonth: expensesCurrentMonthDateToString,
    },
  };
}
