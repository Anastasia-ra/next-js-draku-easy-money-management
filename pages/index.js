import Head from 'next/head';
import Layout from '../components/Layout';
import Link from 'next/link';

import { css } from '@emotion/react';
import {
  DoughnutCategories,
  DoughnutProgress,
  LineChart,
  ProgressBar,
} from '../components/Chart';

const chartDoughnutStyle = css`
  width: 300px;
  height: 300px;
`;

const chartLineStyle = css`
  width: 450px;
  height: 300px;
`;

export default function Home() {
  return (
    <div>
      <Layout>
        <Head>
          <title>Draku</title>
          <meta name="description" content="Draku money management" />
        </Head>
        <h1>Welcome to Draku!</h1>
        <br />
        <Link href="/users/expenses">
          <a>Start saving here</a>
        </Link>
        <br />
        <Link href="signup">
          <a>Sign up here</a>
        </Link>
        <br />
        <Link href="login">
          <a>Log in here</a>
        </Link>
        <br />
        <Link href="logout">
          <a>Log out here</a>
        </Link>
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
    </div>
  );
}
