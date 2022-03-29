import { css } from '@emotion/react';
import { GetServerSidePropsContext } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useState } from 'react';
import Layout from '../components/Layout';
import Link from 'next/link';
import { createCsrfToken } from '../util/auth';
import { getValidSessionByToken } from '../util/database';
import { RegisterResponseBody } from './api/register';

type Errors = { message: string }[];

type Props = {
  refreshUserProfile: () => void;
  userObject: { username: string };
  csrfToken: string;
};

const errorStyles = css`
  color: #8a1010;
  width: 200px;
  text-align: center;
  margin: 15px auto;
`;
const loginStyle = css`
  position: relative;
  top: 65px;
  background: #01aca3;
  color: white;
  width: 280px;
  height: 350px;
  margin: auto;
  padding: 10px 15px;
  border-radius: 10px;
  text-align: center;
  /* h1 {
    text-align: center;
  } */
  p {
    text-align: center;
  }
  a {
    color: white;
  }
  input {
    margin: 10px;
  }
`;

const buttonStyle = css`
  width: 100px;
  height: 25px;
  margin: 0 auto;
  font-size: 16px;
  background: #f4ac40;
  color: white;
  border-radius: 10px;
  border-style: none;
  transition: color 0.3s ease-in 0s;
  :hover {
    color: #04403d;
  }
`;

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
      <div css={loginStyle}>
        <h1>Log in</h1>
        <p>
          No account yet?{'  '}
          <Link href="/users/signup">
            <a> Sign-up here</a>
          </Link>{' '}
        </p>
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
            props.refreshUserProfile();
            await router.push(`/`);
          }}
        >
          <div>
            <label>
              <span> Username {'  '} </span>
              <br />
              <input
                data-test-id="username"
                maxLength={15}
                value={username}
                onChange={(event) => setUsername(event.currentTarget.value)}
              />
            </label>
            <br />
            <br />
            <label>
              <span> Password {'  '} </span>
              <br />
              <input
                data-test-id="password"
                type="password"
                maxLength={15}
                value={password}
                onChange={(event) => setPassword(event.currentTarget.value)}
              />
            </label>
            <br />
            <div css={errorStyles}>
              {errors.map((error) => {
                return (
                  <div key={`error-${error.message}`}>{error.message}</div>
                );
              })}
            </div>

            <button data-test-id="login-button" css={buttonStyle}>
              Log-in
            </button>
          </div>
        </form>
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
