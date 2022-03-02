import Head from 'next/head';
import Layout from '../components/Layout';
import { css } from '@emotion/react';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { RegisterResponseBody } from './api/register';

const errorStyles = css`
  color: red;
`;

type Errors = { message: string }[];

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<Errors>([]);

  const router = useRouter();

  return (
    <Layout>
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
            }),
          }).catch((error) => console.error(error));

          const loginResponseBody =
            (await loginResponse.json()) as RegisterResponseBody;

          if ('errors' in loginResponseBody) {
            setErrors(loginResponseBody.errors);
            return;
          }
          const returnTo = router.query.returnTo;

          if (
            returnTo &&
            !Array.isArray(returnTo) &&
            /^\/[a-zA-Z0-9-?=]*$/.test(returnTo)
          ) {
            await router.push(returnTo);
            return;
          }

          const userProfileUrl = `/users-overview/${loginResponseBody.user.id}`;
          // Clear the errors when login worked
          setErrors([]);
          await router.push(userProfileUrl);
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
          <button>Sign-up</button>
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
