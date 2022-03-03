import { GetServerSidePropsContext, GetServerSidePropsResult } from 'next';
import Head from 'next/head';
import Layout from '../../components/Layout';
import { getUserById, User } from '../../util/database';

type Props = {
  user?: User;
};

export default function UserOverview(props: Props) {
  if (!props.user) {
    return (
      <Layout>
        <Head>
          <title>User not found</title>
          <meta name="description" content="User not found" />
        </Head>
        <h1>User not found</h1>
      </Layout>
    );
  }

  return (
    <Layout>
      <Head>
        <title>
          User # {props.user.id} (username: {props.user.username})
        </title>
        <meta
          name="description"
          content={`User #${props.user.id} has a username of ${props.user.username}`}
        />
      </Head>
      <h1>
        User: # {props.user.id} ({props.user.username})
      </h1>

      <div>id: {props.user.id}</div>
      <div>name: {props.user.username}</div>
    </Layout>
  );
}

export async function getServerSideProps(
  context: GetServerSidePropsContext,
): Promise<GetServerSidePropsResult<{ user?: User }>> {
  const userId = context.query.userId;

  if (!userId || Array.isArray(userId)) {
    return { props: {} };
  }

  const user = await getUserById(parseInt(userId));

  if (!user) {
    context.res.statusCode = 404;
    return {
      // notFound: true, // also works, but generates a generic error page
      props: {},
    };
  }

  return {
    props: {
      user: user,
    },
  };
}
