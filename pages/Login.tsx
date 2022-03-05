import { css } from '@emotion/react';
import { GetServerSidePropsContext } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useState } from 'react';
import Layout from '../components/Layout';
import { createCsrfToken } from '../util/auth';
import { getValidSessionByToken } from '../util/database';
import { RegisterResponseBody } from './api/register';

const errorStyles = css`
  color: red;
`;

type Errors = { message: string }[];

type Props = {
  refreshUserProfile: () => void;
  userObject: { username: string };
  csrfToken: string;
};

export default function Login(props: Props) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<Errors>([]);

  const router = useRouter();

  return (
    <Layout userObject={props.userObject}>
      <Head>
        <title>Login at Draku</title>
        <meta name="description" content="Draku log in" />
      </Head>
      <h1>Log in</h1>
      <form
        onSubmit={async (event) => {
          event.preventDefault();
          const loginResponse = await fetch('/api/login', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              username: username,
              password: password,
              csrfToken: props.csrfToken,
            }),
          });

          const loginResponseBody =
            (await loginResponse.json()) as RegisterResponseBody;

          if ('errors' in loginResponseBody) {
            setErrors(loginResponseBody.errors);
            return;
          }
          const returnTo = router.query.returnTo;
          console.log('returnTo', returnTo, typeof returnTo);

          if (
            returnTo &&
            !Array.isArray(returnTo) &&
            // Security: Validate returnTo parameter against valid path
            // (because this is untrusted user input)
            /^\/[a-zA-Z0-9-?=/]*$/.test(returnTo)
          ) {
            props.refreshUserProfile();
            await router.push(returnTo);
            return;
          }

          // if (returnTo) {
          //   await router.push(returnTo);
          //   return;
          // }

          // const userProfileUrl = `/users/${loginResponseBody.user.id}`;

          // Clear the errors when login worked
          // setErrors([]);  not necessary with redirect
          props.refreshUserProfile();
          await router.push(`/`);
        }}
      >
        <div>
          <label>
            Username
            <input
              value={username}
              onChange={(event) => setUsername(event.currentTarget.value)}
            />
          </label>
          <br />
          <label>
            Password
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.currentTarget.value)}
            />
          </label>
          <button>Log-in</button>
        </div>
      </form>
      <div css={errorStyles}>
        {errors.map((error) => {
          return <div key={`error-${error.message}`}>{error.message}</div>;
        })}
      </div>
    </Layout>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  // Redirect from HTTP to HTTPS on Heroku
  if (
    context.req.headers.host &&
    context.req.headers['x-forwarded-proto'] &&
    context.req.headers['x-forwarded-proto'] !== 'https'
  ) {
    return {
      redirect: {
        destination: `https://${context.req.headers.host}/login`,
        permanent: true,
      },
    };
  }

  const sesionToken = context.req.cookies.sessionToken;

  if (sesionToken) {
    const session = await getValidSessionByToken(sesionToken);
    if (session) {
      return {
        redirect: {
          destination: '/',
          permanent: false,
        },
      };
    }
  }

  // If no valid token: generate CSRF token

  return {
    props: {
      csrfToken: createCsrfToken(),
    },
  };
}
