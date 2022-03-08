import { css } from '@emotion/react';
import { GetServerSidePropsContext } from 'next';
import Head from 'next/head';
import Layout from '../../components/Layout';
import { getUserByValidSessionToken, Category } from '../../util/database';


const containerStyles = css`
  height: 20;
  width: '100%';
  background-color: "#e0e0de";
  border-radius: 50;
  margin: 50;
`;
const completed = 50;

const fillerStyles = css`
  height: '100%';
  width: `${completed}%`;
  background-color: bgcolor;
  border-radius: 'inherit';
  text-align: 'right';
`;

const labelStyles = {
  padding: 5,
  color: 'white',
  fontWeight: 'bold'
}

type Props = {
  userObject: { username: string };
  user: { id: number; username: string };
};

type Errors = { message: string }[];

type Categories = Category[];

export default function CategoriesManagement(props: Props) {
  return (
    <Layout userObject={props.userObject}>
      <Head>
        <title>Your budget</title>
        <meta name="description" content="budget" />
      </Head>
      <h1>Manage your budget</h1>
      <div>
        <div>
          <span></span>
        </div>
      </div>
    </Layout>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const sessionToken = context.req.cookies.sessionToken;
  const user = await getUserByValidSessionToken(sessionToken);

  if (user) {
    return {
      props: { user: user },
    };
  }

  return {
    redirect: {
      destination: '/login?returnTo=/users/categoriesManagement',
      permanent: false,
    },
  };
}
