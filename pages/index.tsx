import { css } from '@emotion/react';
import { GetServerSidePropsContext } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import Layout from '../components/Layout';
import Switch from 'react-switch';
import {
  getUserByValidSessionToken,
  Expense,
  Category,
  getAllCategoriesbyUserId,
  getAllExpensesByUserId,
  getExpensesByMonthByUser,
  getExpensesByYearByUser,
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
import { getLastMonths, sumPerMonth } from '../graphFunctions/sumPerMonth';
import {
  getDoughnutCategories,
  getLineData,
  getLineDataByDay,
  getProgressChartData,
} from '../graphFunctions/charts';
import { getTotalBudgetProgress } from '../graphFunctions/budgetProgress';

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
      expensesCurrentYear: Expense[];
    }
  | { error: string };

const breakPointsWidth = [480, 800, 725];
const mediaQueryWidth = breakPointsWidth.map(
  (bp) => `@media (max-width: ${bp}px)`,
);

const breakPointsHeight = [900];
const mediaQueryHeight = breakPointsHeight.map(
  (bp) => `@media (max-height: ${bp}px)`,
);

const mainStyle = css`
  background: #ffffff;
  border-radius: 10px;
  /* padding: 20px; */
  /* border-style: solid; */
  color: #26325b;
  margin: 2vh auto;
  text-align: left;
  max-width: 800px;
  /* height: 70vh; */
  box-shadow: 0 0 8px #cccccc;
  padding-bottom: 10px;
  /* ${mediaQueryHeight[0]} {
    height: 95vh;
  } */

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
  p {
    font-size: 18px;
    text-align: left;
    margin: 5px 0 5vh 20px;
    ${mediaQueryHeight[0]} {
      margin: 5px 0 2vh 20px;
    }
  }
  ${mediaQueryWidth[1]} {
    box-shadow: 0 0 0 #cccccc;
    border-radius: 0;
    min-height: 85vh;
  }
`;

const welcomeHeaderStyle = css`
  font-size: 26px;
  margin: 40px 0;
`;

const imageStyleAfterSignUp = css`
  margin: 30px auto;
`;

const signUpLink = css`
  background: #01aca3;
  margin: 20px auto;
  height: 25px;
  width: 200px;
  border-radius: 5px;
  text-align: center;

  a {
    color: white;
    font-size: 16px;
    line-height: 21px;
    transition: color 0.3s ease-in 0s;
  }

  a:hover {
    color: #04403d;
  }
`;

const lowerPartStyle = css`
  margin: 5vh 0;
  ${mediaQueryHeight[0]} {
    margin: 5px 0;
  }
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 2vw;
`;

const chartDoughnutProgressStyle = css`
  display: inline-block;
  width: 180px;
  height: 185px;
  position: relative;
  /* bottom: 60px; */
`;

const percentageStyle = css`
  position: absolute;
  margin: auto;
  z-index: 2;
  top: 90px;
  left: 70px;
  height: 40px;
  font-size: 21px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const progressTextStyle = css`
  position: relative;
  /* right: 20px; */
  left: 60px;
  /* bottom: 10px; */
  /* padding-top: 10px; */
  font-size: 16px;
  /* color: #26325b; */
  span {
    font-size: 14px;
  }
`;

const chartDoughnutCategoriesStyle = css`
  display: inline-block;
  width: 220px;
  height: 245px;
  ${mediaQueryWidth[0]} {
    margin: 30px 0 5px 0;
  }
`;

// const categoriesStyle = css`
//   display: inline-flex;
//   flex-direction: column;
// `;

const chartLineStyle = css`
  position: relative;
  width: 70%;
  /* width: 300px; */
  height: 200px;
  margin: 0 auto;

  ${mediaQueryWidth[0]} {
    width: 90%;
  }

  ${mediaQueryHeight[0]} {
    height: 160px;
  }
`;

const linksStyle = css`
  background: #01aca3;
  width: 220px;
  height: 160px;
  text-align: left;
  border-radius: 8px;
  margin-top: 30px;
  padding: 10px;
  margin-bottom: 20px;
`;

const singleLinkStyle2 = css`
  font-size: 18px;
  /* padding-left: 10px; */
  margin: 0 auto;
  color: white;
  display: flex;
  /* padding: 10px; */
  transition: color 0.3s ease-in 0s;
  :hover {
    color: #04403d;
  }
  span {
    text-align: start;
    padding-left: 10px;
    align-self: flex-end;
  }
`;

// const iconStyle = css`
//   background: url('/expense2.png') no-repeat;
//   width: 25px;
//   height: 25px;

//   :hover {
//     background: url('/expense2-hover.png') no-repeat;
//   }
// `;

const singleLinkStyle = css`
  font-size: 18px;
  /* padding-left: 10px; */
  margin: 0 auto;
  color: white;
  display: flex;
  /* padding: 10px; */
  transition: color 0.3s ease-in 0s;
  :hover {
    color: #04403d;
  }
  span {
    text-align: start;
    padding-left: 10px;
    align-self: flex-end;
  }
`;

const spanTextStyle = css`
  text-align: start;
  padding-left: 10px;
  align-self: flex-end;
`;

// const imageNonHoverStyle = css``;

// const imageHoverStyle = css``;

const chartsHeaderStyle = css`
  margin: 10px 0;
`;

const lineChartSwitchStyle = css`
  display: flex;
  justify-content: center;
  span {
    margin: 0 5px;
  }
`;

// const doughnutSwitchStyle = css`
//   display: flex;
//   justify-content: center;
//   span {
//     margin: 0 5px;
//   }
// `;

const imageStyle = css`
  margin: 20px auto;
`;

const imageFlexStyle = css`
  position: relative;
  height: 350px;
  top: 80px;

  ${mediaQueryWidth[2]} {
    top: 0px;
  }
`;

const textLoggedOutStyle = css`
  margin: 20px;
`;

const textPartLoggedOutStyle = css`
  max-width: 400px;
  height: 350px;
`;

const mainLoggedOutStyle = css`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  background: #ffffff;
  border-radius: 10px;
  color: #26325b;
  margin: 10vh auto 0 auto;
  padding: 10px 0px 40px 15px;
  text-align: left;
  max-width: 800px;

  box-shadow: 0 0 8px #cccccc;
  ${mediaQueryWidth[1]} {
    box-shadow: 0 0 0 #cccccc;
    border-radius: 0;
    min-height: 85vh;
  }
  ${mediaQueryWidth[2]} {
    padding: 0px;
  }

  h1 {
    /* font-size: 26px; */
    text-align: left;
    padding: 3vh 0 2vh 20px;
    /* margin: 15px 0 5px 20px; */
    ${mediaQueryWidth[0]} {
      padding: 0vh 0 1vh 20px;
    }
  }
`;

export default function Home(props: Props) {
  const [isCheckedLineChart, setIsCheckedLineChart] = useState(true);
  // const [isCheckedDoughnut, setIsCheckedDoughnut] = useState(true);

  if ('error' in props) {
    return (
      <Layout css={mainStyle}>
        <Head>
          <title>Draku</title>
          <meta name="description" content="Draku money management " />
        </Head>
        <div css={mainLoggedOutStyle}>
          <div css={textPartLoggedOutStyle}>
            <h1 css={welcomeHeaderStyle}>
              Welcome to Draku, your simple money management solution.
            </h1>
            <div css={textLoggedOutStyle}>
              Draku makes managing personal finances as easy as sleeping! With
              Draku you can easily record your financial transactions, set
              budgets and review your monthly and yearly spendings.
            </div>
            <div css={signUpLink}>
              <Link href="/signup">
                <a>Sign up here to start saving</a>
              </Link>
            </div>
          </div>
          <div css={imageFlexStyle}>
            <Image
              src="/draku_logo.png"
              width="310px"
              height="208px"
              css={imageStyle}
            />
          </div>
        </div>
      </Layout>
    );
  }
  // console.log('props.userObject', props.userObject);

  if (props.categories.length === 0) {
    return (
      <Layout userObject={props.userObject} css={mainStyle}>
        <Head>
          <title>Draku</title>
          <meta name="description" content="Draku money management " />
        </Head>
        <div css={mainLoggedOutStyle}>
          <div css={textPartLoggedOutStyle}>
            <h1 css={welcomeHeaderStyle}>
              Welcome to Draku, {props.user.username}!
            </h1>
            <p>
              {' '}
              To start budgeting, start by creating your first expense
              categories here:
            </p>
            <div css={signUpLink}>
              <Link href="/users/categoriesManagement">
                <a data-test-id="category-link">Manage your catagories</a>
              </Link>
            </div>
            <p> Then you can add your expenses here:</p>
            <div css={signUpLink}>
              <Link href="/users/expenses">
                <a>Manage your expenses</a>
              </Link>
            </div>
          </div>
          <div css={imageFlexStyle}>
            <Image
              src="/draku_logo.png"
              width="295px"
              height="200px"
              css={imageStyleAfterSignUp}
            />
          </div>
        </div>
      </Layout>
    );
  }

  const lastMonthsWithExpenses = sumPerMonth(props.expenses, getLastMonths());

  return (
    <Layout userObject={props.userObject}>
      <Head>
        <title>Draku</title>
        <meta name="description" content="Draku money management" />
      </Head>
      <div css={mainStyle}>
        <h1 css={chartsHeaderStyle}>Welcome back {props.user.username}!</h1>
        <p>We are glad that you're here. Here's your overview.</p>
        {isCheckedLineChart ? (
          <div css={chartLineStyle}>
            <Line
              data={getLineDataByDay(props.expensesCurrentMonth).data}
              options={getLineDataByDay(props.expensesCurrentMonth).options}
            />
          </div>
        ) : (
          <div css={chartLineStyle}>
            <Line
              data={getLineData(lastMonthsWithExpenses).data}
              options={getLineData(lastMonthsWithExpenses).options}
            />
          </div>
        )}
        <div css={lineChartSwitchStyle}>
          <span>This year</span>
          <Switch
            onChange={() => setIsCheckedLineChart(!isCheckedLineChart)}
            checked={isCheckedLineChart}
            uncheckedIcon={false}
            checkedIcon={false}
            onColor="#01aca3"
            offColor="#f4ac40"
            handleDiameter={0}
            height={15}
            width={30}
          />
          <span>This month</span>
        </div>

        <div css={lowerPartStyle}>
          <div css={chartDoughnutProgressStyle}>
            <div
              css={css`
                ${percentageStyle} color: ${getProgressChartData(
                  props.categories,
                  props.expensesCurrentMonth,
                ).bgColor}
              `}
            >
              {`${Math.round(
                getProgressChartData(
                  props.categories,
                  props.expensesCurrentMonth,
                ).budgetProgress * 100,
              )}%`}{' '}
            </div>
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
            <div css={progressTextStyle}>
              {getTotalBudgetProgress(
                props.categories,
                props.expensesCurrentMonth,
              ).currentTotal / 100}
              € <br />{' '}
              <span>
                {' '}
                from{' '}
                {getTotalBudgetProgress(
                  props.categories,
                  props.expensesCurrentMonth,
                ).totalBudget / 100}
                €{' '}
              </span>
            </div>
          </div>
          {/* <div css={categoriesStyle}>
            {isCheckedDoughnut ? ( */}
          {props.expensesCurrentMonth.length > 0 && (
            <div css={chartDoughnutCategoriesStyle}>
              <Doughnut
                // width="150"
                // height="150"
                data={
                  getDoughnutCategories(
                    props.categories,
                    props.expensesCurrentMonth,
                  ).data
                }
                options={
                  getDoughnutCategories(
                    props.categories,
                    props.expensesCurrentMonth,
                  ).options
                }
              />
            </div>
          )}

          {/* ) : (
              <div css={chartDoughnutCategoriesStyle}>
                <Doughnut
                  // width="150"
                  // height="150"
                  data={
                    getDoughnutCategoriesData(
                      props.categories,
                      props.expensesCurrentYear,
                    ).data
                  }
                  options={
                    getDoughnutCategoriesData(
                      props.categories,
                      props.expensesCurrentYear,
                    ).options
                  }
                />
              </div>
            )} */}
          {/* <div css={doughnutSwitchStyle}>
              <span>This year</span>
              <Switch
                onChange={() => setIsCheckedDoughnut(!isCheckedDoughnut)}
                checked={isCheckedDoughnut}
                uncheckedIcon={false}
                checkedIcon={false}
                onColor="#01aca3"
                offColor="#f4ac40"
                handleDiameter={0}
                height={15}
                width={30}
              />
              <span>This month</span>
            </div> */}
          {/* </div> */}
          <div css={linksStyle}>
            <Link href="/users/expenses">
              <a css={singleLinkStyle2}>
                <Image
                  src="/expense2.png"
                  width="25px"
                  height="25px"
                  alt="wallet"
                />{' '}
                <span css={spanTextStyle}> Manage your expenses </span>
              </a>
            </Link>
            <br />
            <Link href="/users/categoriesManagement">
              <a data-test-id="category-link" css={singleLinkStyle}>
                {' '}
                <Image
                  src="/wallet.png"
                  width="25px"
                  height="25px"
                  alt="wallet"
                />{' '}
                <span> Manage your categories </span>
              </a>
            </Link>
            <br />
            <Link href="/users/budgetManagement">
              <a css={singleLinkStyle}>
                {' '}
                <Image
                  src="/piggy.png"
                  width="25px"
                  height="25px"
                  alt="piggy"
                />{' '}
                <span> Check your budget </span>
              </a>
            </Link>
            <br />
            <Link href="/users/reminder">
              <a css={singleLinkStyle}>
                {' '}
                <Image
                  src="/bell.png"
                  width="22px"
                  height="22px"
                  alt="piggy"
                />{' '}
                <span> Set up a reminder </span>
              </a>
            </Link>
          </div>
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
      props: {
        error: 'Please login',
      },
    };
  }

  const categories = await getAllCategoriesbyUserId(user.id);

  const expenses = await getAllExpensesByUserId(user.id);

  const expensesDateToString = JSON.parse(JSON.stringify(expenses));

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

  const expensesCurrentMonthDateToString = JSON.parse(
    JSON.stringify(expensesCurrentMonth),
  );

  const expensesCurrentYear = await getExpensesByYearByUser(
    Number(currentYear),
    user.id,
  );

  const expensesCurrentYearDateToString = JSON.parse(
    JSON.stringify(expensesCurrentYear),
  );

  /*
  const expensesLastYear = [];

  const lastMonths = getLastMonths();
  lastMonths.forEach(async (month) => {
    const monthExpense = await getExpensesByMonthByUser(
      month.monthId,
      month.year,
      user.id,
    );
    expensesLastYear.push(monthExpense);
    console.log('expensesLastYear', expensesLastYear);
  }); */
  console.log(
    'props in gssp',
    'user',
    user,
    'categories',
    categories,
    'expenses',
    expenses,
  );

  return {
    props: {
      user: user,
      categories: categories,
      expenses: expensesDateToString,
      expensesCurrentMonth: expensesCurrentMonthDateToString,
      expensesCurrentYear: expensesCurrentYearDateToString,
    },
  };
}
