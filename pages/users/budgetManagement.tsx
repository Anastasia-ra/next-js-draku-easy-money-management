import { css } from '@emotion/react';
import { GetServerSidePropsContext } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import Layout from '../../components/Layout';
import {
  getUserByValidSessionToken,
  Category,
  Expense,
  getAllCategoriesbyUserId,
  getExpensesByMonthByUser,
} from '../../util/database';
import ProgressBar from '@ramonak/react-progress-bar';
import {
  getBudgetProgressByCategoryPerMonth,
  getTotalBudgetProgress,
} from '../../graphFunctions/budgetProgress';

type Props =
  | {
      userObject: { username: string };
      user: { id: number; username: string };
      categories: Category[];
      expensesCurrentMonth: Expense[];
    }
  | {
      userObject: { username: string };
      error: string;
    };

const breakPointsWidth = [480, 800];
const mediaQueryWidth = breakPointsWidth.map(
  (bp) => `@media (max-width: ${bp}px)`,
);

const mainStyle = css`
  background: #ffffff;
  border-radius: 10px;
  box-shadow: 0 0 8px #cccccc;
  color: #26325b;
  max-width: 480px;
  padding-bottom: 10px;
  margin: 2vh auto;
  h1 {
    font-size: 26px;
    text-align: left;
    padding: 15px 0 0px 35px;
  }
  ${mediaQueryWidth[1]} {
    box-shadow: 0 0 0 #cccccc;
    border-radius: 0;
    min-height: 85vh;
  }
`;

const progressDivStyle = css`
  width: 280px;
  margin: 10px auto;
`;

const progressBarStyle = css`
  margin: 5px 0;
`;

const totalProgressDivStyle = css`
  width: 280px;
  margin: 20px auto;
`;

const progressInfosStyle = css`
  width: 100px;
  text-align: end;
  font-size: 18px;
  span {
    font-size: 14px;
  }
`;

const flexStyle = css`
  display: flex;
  justify-content: space-between;
  font-size: 18px;
`;

const totalFlexStyle = css`
  display: flex;
  justify-content: space-between;
  font-size: 21px;
  font-weight: bolder;
`;

const totalInfosStyle = css`
  width: 100px;
  text-align: end;
  span {
    font-size: 18px;
  }
`;

export default function CategoriesManagement(props: Props) {
  if ('error' in props) {
    return <div>Please log-in first</div>;
  }

  if (props.categories.length === 0) {
    return (
      <Layout userObject={props.userObject}>
        <Head>
          <title>Your budget</title>
          <meta name="description" content="Your budget " />
        </Head>
        <div css={mainStyle}>
          <h1>First add a category to check you budget</h1>
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

  const totalBudgetProgress = getTotalBudgetProgress(
    props.categories,
    props.expensesCurrentMonth,
  ).progress;

  let bgColorTotal = '#01aca3';
  if (0.7 < totalBudgetProgress && totalBudgetProgress < 0.9) {
    bgColorTotal = '#f4ac40';
  }
  if (totalBudgetProgress >= 0.9) {
    bgColorTotal = '#a81b0c';
  }

  return (
    <Layout userObject={props.userObject}>
      <Head>
        <title>Your budget</title>
        <meta name="description" content="budget" />
      </Head>
      <div css={mainStyle}>
        <h1>Check your budget</h1>
        <div>
          <div css={totalProgressDivStyle}>
            <div css={totalFlexStyle}>
              Total
              <div css={totalInfosStyle}>
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
            <ProgressBar
              completed={Math.round(totalBudgetProgress * 100)}
              bgColor={bgColorTotal}
              isLabelVisible={false}
            />
          </div>

          {props.categories.map((category) => {
            const budgetProgress = Math.round(
              getBudgetProgressByCategoryPerMonth(
                category.monthlyBudget,
                category.id,
                props.expensesCurrentMonth,
              ).progress * 100,
            );

            let bgColor = '#01aca3';
            if (70 < budgetProgress && budgetProgress < 90) {
              bgColor = '#f4ac40';
            }
            if (budgetProgress >= 90) {
              bgColor = '#a81b0c';
            }

            return (
              <div css={progressDivStyle} key={`category-${category.id}`}>
                <div css={flexStyle}>
                  {category.name}
                  <div css={progressInfosStyle}>
                    {' '}
                    {getBudgetProgressByCategoryPerMonth(
                      category.monthlyBudget,
                      category.id,
                      props.expensesCurrentMonth,
                    ).expensesSum / 100}
                    € <br />
                    <span>from {category.monthlyBudget / 100}€ </span>
                  </div>
                </div>
                <ProgressBar
                  css={progressBarStyle}
                  completed={budgetProgress}
                  bgColor={bgColor}
                  isLabelVisible={false}
                />
              </div>
            );
          })}
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
      redirect: {
        destination: '/login?returnTo=/users/budgetManagement',
        permanent: false,
      },
    };
  }

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
  console.log('expenses this motnh GSSP', expensesCurrentMonth);

  const expensesDateToString = JSON.parse(JSON.stringify(expensesCurrentMonth));

  const categories = await getAllCategoriesbyUserId(user.id);
  console.log('categories', categories);
  return {
    props: {
      user: user,
      categories: categories,
      expensesCurrentMonth: expensesDateToString,
    },
  };
}
