import Head from 'next/head';
import Layout from '../../components/Layout';
import AddExpense from '../../components/AddExpense';
import { GetServerSidePropsContext } from 'next';
import { getUserByValidSessionToken } from '../../util/database';

type Props = {
  userObject: { username: string };
  user: { id: number; username: string };
};

export default function Expenses(props: Props) {
  const date = new Date();
  const optionsDate = { month: 'long', year: 'numeric' };
  const currentMonth = new Intl.DateTimeFormat('en-US', optionsDate).format(
    date,
  );
  console.log(currentMonth);

  return (
    <Layout userObject={props.userObject}>
      <Head>
        <title>Draku</title>
        <meta name="description" content="Draku money management" />
      </Head>
      <h1>Add an expense </h1>
      <h2>{currentMonth}</h2>
      <h3>{props.user.id}</h3>

      <AddExpense />
    </Layout>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const token = context.req.cookies.sessionToken;
  const user = await getUserByValidSessionToken(token);

  if (user) {
    return {
      props: { user: user },
    };
  }

  return {
    redirect: {
      destination: '/login?returnTo=/users/expenses',
      permanent: false,
    },
  };
}
