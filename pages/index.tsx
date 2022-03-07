import { css } from '@emotion/react';
import { GetServerSidePropsContext } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import {
  // DoughnutCategories,
  DoughnutProgress,
  LineChart,
  ProgressBar,
} from '../components/Chart';
import { DoughnutCategories } from '../components/charts/doughnutChart';
import Layout from '../components/Layout';
import { getUserByValidSessionToken } from '../util/database';

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
      <div css={chartDoughnutStyle}>
        <DoughnutCategories />
      </div>
      <div css={chartDoughnutStyle}>
        <DoughnutProgress />
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
