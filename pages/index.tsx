import { css } from '@emotion/react';
import { GetServerSidePropsContext } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import Layout from '../components/Layout';
import {
  getSharePerCategory,
  getSumExpensesCategory,
} from '../graph-functions/sum-per-category';
import { getTotalBudgetProgress } from '../graph-functions/budgetProgress';
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
} from 'chart.js';
import { Doughnut, Line } from 'react-chartjs-2';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { useState } from 'react';
import { getLastMonths, sumPerMonth } from '../graph-functions/sumPerMonth';

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
);
ChartJS.register(ChartDataLabels);

const chartDoughnutStyle = css`
  width: 300px;
  height: 300px;
`;

const chartLineStyle = css`
  width: 300px;
  height: 300px;
`;

const test = css`
  background-color: red;
`;

type Props =
  | {
      userObject: { username: string };
      user: { id: number; username: string };
      categories: Category[];
      expenses: Expense[];
      expensesCurrentMonth: Expense[];
    }
  | { userObject: { username: string }; error: string };

export default function Home(props: Props) {
  const [switchCategories, setSwitchCategories] = useState(false);

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

  function getDoughnutCategoriesData(
    categoriesArray: Category[],
    expensesArray: Expense[],
  ) {
    const categoriesWithSum = getSumExpensesCategory(
      categoriesArray,
      expensesArray,
    );
    const categoriesWithShares = getSharePerCategory(categoriesWithSum);
    const categoriesWithSharesFiltered = categoriesWithShares.filter(
      (e) => e.shareOfExpenses !== 0,
    );

    const categories = categoriesWithSharesFiltered.map((e) => e.name);

    const categoriesData = categoriesWithSharesFiltered.map(
      (e) => e.shareOfExpenses,
    );

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

    const optionsDoughnutCategories = {
      cutout: '60%',
      // radius: 800,
      // spacing: '5%',
      maintainAspectRatio: false,
      elements: {
        arc: {
          hoverBackgroundColor: [
            'rgba(255, 99, 132, 0.7)',
            'rgba(54, 162, 235, 0.7)',
            'rgba(255, 206, 86, 0.7)',
            'rgba(75, 192, 192, 0.7)',
            'rgba(153, 102, 255,0.7)',
            'rgba(255, 159, 64, 0.7)',
          ],
          hoverOffset: 3,
        },
      },
      layout: {
        padding: 50,
      },
      plugins: {
        tooltip: {
          enabled: false,
        },
        legend: {
          // position: 'left',
          // align: 'end',
          display: false,
        },
        datalabels: {
          color: '#36A2EB',
          formatter: function (value: number, context) {
            return (
              categories[context.dataIndex] +
              '\n' +
              Math.round(value * 100) +
              '%'
            );
          },
          align: 'end',
          offset: 20,
          textAlign: 'center',
        },
      },
    };
    return { data: dataDoughnutCategories, options: optionsDoughnutCategories };
  }

  // Data for progress chart

  function getProgressChartData(
    categoriesArray: Category[],
    expensesArray: Expense[],
  ) {
    const budgetProgress = getTotalBudgetProgress(
      categoriesArray,
      expensesArray,
    );

    let bgColorProgress = '#07b335';
    if (0.7 < budgetProgress && budgetProgress < 0.9) {
      bgColorProgress = '#eb8305';
    }
    if (budgetProgress >= 0.9) {
      bgColorProgress = '#a81b0c';
    }

    const dataProgressCircle = {
      labels: ['Expenses', 'Budget left'],
      datasets: [
        {
          label: 'Budget',
          data: [1 - budgetProgress, budgetProgress],
          backgroundColor: ['white', bgColorProgress],
          borderColor: [bgColorProgress, bgColorProgress],
          borderWidth: 1,
        },
      ],
    };

    const optionsProgressCircle = {
      cutout: '85%',
      rotation: 0,
      maintainAspectRatio: false,
      elements: {
        // arc: {
        //   hoverBackgroundColor: [
        //     'rgba(255, 99, 132, 0.7)',
        //     'rgba(54, 162, 235, 0.7)',
        //   ],
        // },
      },
      layout: {
        padding: 50,
      },
      plugins: {
        tooltip: {
          enabled: false,
        },
        legend: {
          display: false,
        },
        datalabels: {
          color: '#36A2EB',
          formatter: function (value: number) {
            return Math.round(value * 100) + '%';
          },
          display: [false, true],
          align: 'start',
          offset: 70,
          textAlign: 'center',
        },
      },
    };

    return { data: dataProgressCircle, options: optionsProgressCircle };
  }

  // Data for line chart expenses overview

  const lastMonthsWithExpenses = sumPerMonth(props.expenses, getLastMonths());

  function getLineData(
    monthsWithExpenses: Array<{
      totalExpenses: number;
      monthExpenses: Array<number>;
      monthId: number;
      month: string;
      year: number;
    }>,
  ) {
    console.log(
      'labels',
      monthsWithExpenses.map((month) => `${month.month} ${month.year}`),
    );
    console.log(
      'data',
      monthsWithExpenses.map((month) => month.totalExpenses),
    );

    const dataLine = {
      labels: monthsWithExpenses
        .map((month) => `${month.month} ${month.year}`)
        .reverse(),
      datasets: [
        {
          label: 'Months',
          data: monthsWithExpenses
            .map((month) => month.totalExpenses)
            .reverse(),
          borderColor: 'rgb(255, 99, 132)',
          backgroundColor: 'rgba(255, 99, 132, 0.5)',
        },
      ],
    };

    const optionsLine = {
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false,
        },
        datalabels: {
          display: false,
        },
      },
      elements: {
        point: {
          radius: 0,
        },
        line: {
          tension: 0.3,
        },
      },
      scales: {
        xAxis: {
          grid: {
            display: false,
          },
        },
        yAxis: {
          grid: {
            display: false,
          },
        },
      },
      // layout: {
      //   padding: 30,
      // },
    };
    return { data: dataLine, options: optionsLine };
  }

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
      <button onClick={() => setSwitchCategories(!switchCategories)}>
        {switchCategories ? 'See this month' : 'See all'}
      </button>

      {switchCategories ? (
        <div css={chartDoughnutStyle}>
          <Doughnut
            data={
              getDoughnutCategoriesData(props.categories, props.expenses).data
            }
            options={
              getDoughnutCategoriesData(props.categories, props.expenses)
                .options
            }
          />
        </div>
      ) : (
        <div css={chartDoughnutStyle}>
          <Doughnut
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

      <div css={chartDoughnutStyle}>
        <Doughnut
          data={
            getProgressChartData(props.categories, props.expensesCurrentMonth)
              .data
          }
          options={
            getProgressChartData(props.categories, props.expensesCurrentMonth)
              .options
          }
        />
      </div>

      <div css={chartLineStyle}>
        <Line
          data={getLineData(lastMonthsWithExpenses).data}
          options={getLineData(lastMonthsWithExpenses).options}
        />
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
