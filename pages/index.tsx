import { css } from '@emotion/react';
import { GetServerSidePropsContext } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
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
  ChartOptions,
} from 'chart.js';
import { Doughnut, Line } from 'react-chartjs-2';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { Context } from 'chartjs-plugin-datalabels';
// import Options from 'chartjs-plugin-datalabels';
import { useState } from 'react';
import { getLastMonths, sumPerMonth } from '../graph-functions/sumPerMonth';
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
            'rgba(255, 99, 164, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 206, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(153, 102, 255, 0.2)',
            'rgba(255, 159, 64, 0.2)',
            'rgba(86, 255, 86, 0.2)',
            'rgba(68, 7, 97, 0.2)',
            'rgba(224, 240, 10, 0.2)',
            'rgba(44, 46, 46, 0.2)',
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)',
            ' rgba(86, 255, 86, 1)',
            'rgba(68, 7, 97, 1)',
            'rgba(224, 240, 10, 1)',
            'rgba(44, 46, 46, 1)',
          ],
          borderWidth: 1,
        },
      ],
    };

    const optionsDoughnutCategories: ChartJS.ChartOptions = {
      cutout: '60%',
      radius: 60,
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
          color: '#26325b',
          formatter: function (value: number, context: Context) {
            return (
              categories[context.dataIndex] +
              '\n' +
              Math.round(value * 100) +
              '%'
            );
          },
          align: 'end',
          offset: 8,
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
      radius: 60,
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
          display: [false, false],
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
      year: string;
    }>,
  ) {
    const dataLine = {
      labels: monthsWithExpenses
        .map((month) => `${month.month} ${month.year}`)
        .reverse(),
      datasets: [
        {
          label: 'Months',
          data: monthsWithExpenses
            .map((month) => month.totalExpenses / 100)
            .reverse(),
          borderColor: '#01aca3',
          backgroundColor: '#01aca3',
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
          ticks: {
            color: '#26325b',
            font: {
              size: 12,
            },
          },
          grid: {
            display: false,
          },
        },
        yAxis: {
          ticks: {
            color: '#26325b',
            font: {
              size: 12,
            },
            callback: (value: number) => {
              return value + ' €';
            },
          },
          grid: {
            display: false,
          },
        },
      },
    };
    return { data: dataLine, options: optionsLine };
  }

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
            plugins={[ChartDataLabels]}
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
