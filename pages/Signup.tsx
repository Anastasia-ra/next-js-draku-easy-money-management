import Head from 'next/head';
import Layout from '../components/Layout';
import { css } from '@emotion/react';
import { useRouter } from 'next/router';
import { useState } from 'react';

const errorStyles = css`
  color: red;
`;

type Errors = { message: string }[];

export default function Signup() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<Errors>([]);

  const router = useRouter();

  return (
    <Layout>
      <Head>
        <title>Sign up at Draku</title>
        <meta name="description" content="Draku sign up" />
      </Head>
      <h1>Sign Up</h1>
      <form
        onSubmit={async (event) => {
          event.preventDefault();
          const createUserResponse = await fetch('/api/register', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              email: email,
              username: username,
              password: password,
            }),
          }).catch((error) => console.error(error));

          const createUserResponseBody = await createUserResponse.json();

          if ('errors' in createUserResponseBody) {
            setErrors(createUserResponseBody.errors);
            return;
          }

          await router.push('/');
        }}
      >
        <div>
          <label>
            Email
            <input
              type="Email"
              value={email}
              onChange={(event) => setEmail(event.currentTarget.value)}
            />
          </label>
          <br />
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
