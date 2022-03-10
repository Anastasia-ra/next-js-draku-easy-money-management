import { css } from '@emotion/react';
import { GetServerSidePropsContext } from 'next';
import Head from 'next/head';
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
} from '../../graph-functions/budgetProgress';

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

export default function CategoriesManagement(props: Props) {
  const currentMonth = new Intl.DateTimeFormat('en-US', {
    month: 'numeric',
  }).format(new Date());

  const currentYear = new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
  }).format(new Date());

  if ('error' in props) {
    return <div>Please log-in first</div>;
  }

  const totalBudgetProgress = getTotalBudgetProgress(
    props.categories,
    props.expensesCurrentMonth,
  );

  let bgColorTotal = '#07b335';
  if (0.7 < totalBudgetProgress && totalBudgetProgress < 0.9) {
    bgColorTotal = '#eb8305';
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
      <h1>Manage your budget</h1>
      <div>
        {props.categories.map((category) => {
          const budgetProgress = Math.round(
            getBudgetProgressByCategoryPerMonth(
              props.user.id,
              category.id,
              props.expensesCurrentMonth,
            ) * 100,
          );
          let bgColor = '#07b335';
          if (0.7 < budgetProgress && budgetProgress < 0.9) {
            bgColor = '#eb8305';
          }
          if (budgetProgress >= 0.9) {
            bgColor = '#a81b0c';
          }
          // if (budgetProgress > 100) {
          //   return (
          //     <div key={`category-${category.id}`}>
          //       <ProgressBar completed={100} bgColor={bgColor} />
          //       <span>{`You're category ${category.name}  is over budget!`}</span>
          //     </div>
          //   );
          // }
          return (
            <div key={`category-${category.id}`}>
              <ProgressBar completed={budgetProgress} bgColor={bgColor} />
            </div>
          );
        })}
      </div>
      <h2>Total</h2>
      <div>
        <ProgressBar
          completed={Math.round(totalBudgetProgress * 100)}
          bgColor={bgColorTotal}
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

  const expensesDateToString = expensesCurrentMonth.map((expense) => {
    expense.date = expense.date.toISOString();
    return expense;
    // return { ...expense, dateToString };
  });

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
