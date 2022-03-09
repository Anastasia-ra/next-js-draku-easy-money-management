import { css } from '@emotion/react';
import { GetServerSidePropsContext } from 'next';
import Head from 'next/head';
import Layout from '../../components/Layout';
import {
  getUserByValidSessionToken,
  Category,
  getAllCategoriesbyUserId,
} from '../../util/database';
import ProgressBar from '@ramonak/react-progress-bar';
import { useEffect, useState } from 'react';

type Props =
  | {
      userObject: { username: string };
      user: { id: number; username: string };
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

  useEffect(() => {
    const fetchExpenses = async () =>
      await getExpensesByMonth(Number(currentMonth), Number(currentYear));
    fetchExpenses().catch(console.error);
  }, [currentMonth, currentYear]);

  async function getExpensesByMonth(month: number, year: number) {
    const expensesResponse = await fetch(`/api/expenses/getExpensesByMonth`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        month: month,
        year: year,
      }),
    });

    const expensesResponseBody = await expensesResponse.json();
    console.log('expensesResponseBody', expensesResponseBody);

    if ('errors' in expensesResponseBody) {
      return;
    }
  }

  return (
    <Layout userObject={props.userObject}>
      <Head>
        <title>Your budget</title>
        <meta name="description" content="budget" />
      </Head>
      <h1>Manage your budget</h1>
      <div>
        <ProgressBar completed={60} />
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
        destination: '/login?returnTo=/users/categoriesManagement',
        permanent: false,
      },
    };
  }

  const categories = await getAllCategoriesbyUserId(user.id);
  console.log('categories', categories);
  return {
    props: { user: user, categories: categories },
  };
}
