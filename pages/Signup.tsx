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
const signUpStyle = css`
  position: relative;
  top: 65px;
  background: #01aca3;
  color: white;
  width: 280px;
  height: 400px;
  margin: auto;
  padding: 10px 15px;
  border-radius: 10px;
  text-align: center;
  font-size: 18px;
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

export default function Signup(props: Props) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<Errors>([]);

  const router = useRouter();

  return (
    <Layout userObject={props.userObject}>
      <Head>
        <title>Sign up at Draku</title>
        <meta name="description" content="Draku sign up" />
      </Head>
      <div css={signUpStyle}>
        <h1>Sign Up</h1>
        <p>
          Already have an account?{'  '}
          <Link href="/users/login">
            <a> Log-in here</a>
          </Link>{' '}
        </p>
        <form
          onSubmit={async (event) => {
            event.preventDefault();
            const registerResponse = await fetch('/api/register', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                email: email,
                username: username,
                password: password,
                csrfToken: props.csrfToken,
              }),
            });

            const registerResponseBody =
              (await registerResponse.json()) as RegisterResponseBody;

            if ('errors' in registerResponseBody) {
              setErrors(registerResponseBody.errors);
              return;
            }
            props.refreshUserProfile();
            await router.push('/');
          }}
        >
          <div>
            <label>
              Email
              <br />
              <input
                maxLength={50}
                type="Email"
                value={email}
                onChange={(event) => setEmail(event.currentTarget.value)}
              />
            </label>
            <br />
            <label>
              Username
              <br />
              <input
                maxLength={15}
                value={username}
                onChange={(event) => setUsername(event.currentTarget.value)}
              />
            </label>
            <br />
            <label>
              Password
              <br />
              <input
                maxLength={15}
                type="password"
                value={password}
                onChange={(event) => setPassword(event.currentTarget.value)}
              />
            </label>
            <div css={errorStyles}>
              {errors.map((error) => {
                return (
                  <div key={`error-${error.message}`}>{error.message}</div>
                );
              })}
            </div>
            <button css={buttonStyle}>Sign-up</button>
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
        destination: `https://${context.req.headers.host}/signup`,
        permanent: true,
      },
    };
  }

  const token = context.req.cookies.sessionToken;

  if (token) {
    const session = await getValidSessionByToken(token);
    if (session) {
      return {
        redirect: {
          destination: '/',
          permanent: false,
        },
      };
    }
  }

  return {
    props: {
      csrfToken: createCsrfToken(),
    },
  };
}
