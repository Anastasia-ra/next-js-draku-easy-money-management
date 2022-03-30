import { css } from '@emotion/react';
import Layout from '../../components/Layout';
import Head from 'next/head';
import { useState } from 'react';
import {
  getAllCategoriesbyUserId,
  getUserByValidSessionToken,
  Category,
} from '../../util/database';
import { GetServerSidePropsContext } from 'next';

type Props = {
  userObject: { username: string };
  // user: { id: number; username: string };
  // categories: Category[];
};

const breakPointsWidth = [480, 800];
const mediaQueryWidth = breakPointsWidth.map(
  (bp) => `@media (max-width: ${bp}px)`,
);

const mainStyle = css`
  background: #ffffff;
  border-radius: 10px;
  box-shadow: 0 0 8px #cccccc;
  color: #26325b;
  max-width: 480px;
  padding-bottom: 10px;
  margin: 2vh auto;
  h1 {
    font-size: 26px;
    text-align: left;
    padding: 15px 0 0px 35px;
  }
  ${mediaQueryWidth[1]} {
    box-shadow: 0 0 0 #cccccc;
    border-radius: 0;
    min-height: 85vh;
  }
  p {
    font-size: 18px;
    text-align: left;
    margin: 5px 0 3vh 35px;
  }
`;

const formStyle = css`
  background: #01aca3;
  color: white;
  width: 280px;
  height: 260px;
  margin: 10px auto 20px auto;
  padding: 10px 15px;
  border-radius: 15px;
  text-align: center;

  /* p {
    text-align: center;
  }
  a {
    color: white;
  } */
  /* input {
    margin: 10px 10px 0 10px;
    width: 200px;
    border-radius: 5px;
    border-style: none;
  } */
`;

const emailNameInput = css`
  width: 200px;
  margin: 10px 10px 10px 10px;
`;

const priceInput = css`
  width: 85px;
  margin: 10px 15px 10px 10px;
`;
const dayInput = css`
  width: 85px;
  margin: 10px 10px 10px 15px;
`;

const flexInputStyle = css`
  display: flex;
  justify-content: center;
`;

const addButtonStyle = css`
  width: 150px;
  height: 21px;
  margin: 4px auto 10px auto;
  font-size: 16px;
  background: #f4ac40;
  color: white;
  transition: color 0.3s ease-in 0s;
  :hover {
    color: #04403d;
  }
  border-radius: 10px;
  border-style: none;
`;

export default function Reminder(props: Props) {
  const [userEmail, setUserEmail] = useState('');
  const [reminderName, setReminderName] = useState('');
  const [reminderPrice, setReminderPrice] = useState('');
  const [reminderDay, setReminderDay] = useState('');

  async function sendEmail(
    email: string,
    name: string,
    price: string,
    day: string,
  ) {
    console.log('sendEmail');
    const sendEmailResponseBody = await fetch(`/api/reminderEmails`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        reminder: {
          email,
          name,
          price,
          day,
        },
      }),
    });
  }

  return (
    <Layout userObject={props.userObject}>
      <Head>
        <title>Reminders</title>
        <meta name="reminder" content="Add reminders" />
      </Head>
      <div css={mainStyle}>
        <h1>Add a reminder to pay your bills</h1>
        {/* <p>You can add an email reminder to pay your bills.</p> */}
        <form
          css={formStyle}
          onSubmit={async (event) => {
            console.log('submitted');
            event.preventDefault();
            await sendEmail(
              userEmail,
              reminderName,
              reminderPrice,
              reminderDay,
            );
            setUserEmail('');
            setReminderName('');
            setReminderPrice('');
            setReminderDay('');
          }}
        >
          <label>
            Email address
            <br />
            <input
              css={emailNameInput}
              value={userEmail}
              onChange={(event) => {
                setUserEmail(event.currentTarget.value);
              }}
            />
          </label>
          <br />
          <label>
            Which expense do you want to be reminded of? <br />
            <input
              css={emailNameInput}
              value={reminderName}
              onChange={(event) => {
                setReminderName(event.currentTarget.value);
              }}
            />
          </label>
          <br />
          <div css={flexInputStyle}>
            <label>
              Price (€)
              <br />
              <input
                css={priceInput}
                type="number"
                value={reminderPrice}
                onChange={(event) =>
                  setReminderPrice(event.currentTarget.value)
                }
              />
            </label>

            <label>
              Day
              <br />
              <input
                css={dayInput}
                type="number"
                min="1"
                max="28"
                value={reminderDay}
                onChange={(event) => setReminderDay(event.currentTarget.value)}
              />
            </label>
          </div>
          <br />
          {/* {errors.map((error) => {
          return <div key={`error-${error.message}`}>{error.message}</div>;
        })} */}
          <button css={addButtonStyle}>Add reminder</button>
        </form>
      </div>
    </Layout>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const sessionToken = context.req.cookies.sessionToken;
  const user = await getUserByValidSessionToken(sessionToken);

  if (!user) {
    return {
      redirect: {
        destination: '/login?returnTo=/users/reminder',
        permanent: false,
      },
    };
  }

  const categories = await getAllCategoriesbyUserId(user.id);
  const sortedCategories = categories.sort(
    (a: Category, b: Category) => a.id - b.id,
  );

  return {
    props: {
      user: user,
      categories: sortedCategories,
    },
  };
}
