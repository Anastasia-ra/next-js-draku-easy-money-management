import { css } from '@emotion/react';
import Layout from '../../components/Layout';
import Head from 'next/head';
import { useState } from 'react';
import {
  getAllCategoriesbyUserId,
  getUserByValidSessionToken,
  Category,
  EmailReminder,
  getAllRemindersByUserId,
} from '../../util/database';
import { GetServerSidePropsContext } from 'next';
import Link from 'next/link';

type Props = {
  userObject: { username: string };
  user: { id: number; username: string };
  reminders: EmailReminder[];
  // categories: Category[];
};

type Errors = { message: string }[];

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
    margin: 5px 35px 3vh 35px;
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

const singleReminderStyle = css`
  display: flex;
  flex-direction: row;
  padding-left: 10px;
`;

const titleReminderStyle = css`
  display: flex;
  flex-direction: row;
  padding-left: 10px;
  font-weight: bold;
`;

const remindersListStyle = css`
  margin: 5px auto 25px auto;
  width: 270px;

  h2 {
    font-size: 18px;
  }
`;

const reminderNameStyle = css`
  width: 130px;
`;

const reminderPriceStyle = css`
  width: 60px;
  text-align: center;
`;

const reminderDayStyle = css`
  width: 110px;
  text-align: center;
`;

export default function Reminder(props: Props) {
  const [userEmail, setUserEmail] = useState('');
  const [reminderName, setReminderName] = useState('');
  const [reminderPrice, setReminderPrice] = useState('');
  const [reminderDay, setReminderDay] = useState('');
  const [reminders, setReminders] = useState<EmailReminder[]>(props.reminders);
  const [confirmation, setConfirmation] = useState(false);
  const [errors, setErrors] = useState<Errors>([]);

  if ('error' in props) {
    return (
      <Layout userObject={props.userObject}>
        <Head>
          <title>Error</title>
          <meta name="description" content="Reminder error" />
        </Head>
        <h1>Error</h1>
        <p>Please login first to be able to add new reminders.</p>
        <Link href="/login?returnTo=/users/expenses">
          <a>Login</a>
        </Link>
      </Layout>
    );
  }

  async function sendEmail(
    email: string,
    name: string,
    price: string,
    day: string,
    user: { id: number; username: string },
  ) {
    console.log('sendEmail');
    const sendEmailResponse = await fetch(`/api/reminderEmails`, {
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
          user,
        },
      }),
    });

    const sendEmailResponseBody = await sendEmailResponse.json();

    console.log('sendEmailResponseBody', sendEmailResponseBody);

    if (!('errors' in sendEmailResponseBody)) {
      setErrors([]);
      setConfirmation(true);
    } else {
      setConfirmation(false);
      setErrors(sendEmailResponseBody.errors);
    }
  }

  async function getAllReminders() {
    const allRemindersResponse = await fetch(`/api/getAllReminders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId: props.user.id,
      }),
    });

    const allRemindersResponseBody = await allRemindersResponse.json();

    console.log('allRemindersResponseBody', allRemindersResponseBody);

    setReminders(allRemindersResponseBody.remindersList);

    return allRemindersResponseBody;
  }

  return (
    <Layout userObject={props.userObject}>
      <Head>
        <title>Reminders</title>
        <meta name="reminder" content="Add reminders" />
      </Head>
      <div css={mainStyle}>
        <h1>Reminders to pay your bills</h1>
        <p>
          Set up email reminders. Draku will send you an email once a month to
          remind you to pay this expense.
        </p>
        <div css={remindersListStyle}>
          {reminders.length > 0 && (
            <>
              <h2>Your current reminders are: </h2>{' '}
              <div css={titleReminderStyle}>
                <div css={reminderNameStyle}>Name</div>{' '}
                <div css={reminderPriceStyle}>Price</div>{' '}
                <div css={reminderDayStyle}>Reminder day</div>
              </div>
            </>
          )}

          {reminders.map((emailReminder) => {
            return (
              <div
                css={singleReminderStyle}
                key={`reminder-${emailReminder.id}-${emailReminder.name}`}
              >
                <div css={reminderNameStyle}>{emailReminder.name}</div>
                <div css={reminderPriceStyle}>{emailReminder.price}</div>
                <div css={reminderDayStyle}>{emailReminder.day}</div>
              </div>
            );
          })}
        </div>

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
              props.user,
            );
            setUserEmail('');
            setReminderName('');
            setReminderPrice('');
            setReminderDay('');
            await getAllReminders();
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
              Reminder Day
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
          {confirmation && (
            <div>
              Your reminder has been added! You will soon receive a confirmation
              email.{' '}
            </div>
          )}
          {errors.map((error) => {
            return <div key={`error-${error.message}`}>{error.message}</div>;
          })}
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

  const reminders = await getAllRemindersByUserId(user.id);
  console.log('reminders', reminders);

  return {
    props: {
      user: user,
      categories: sortedCategories,
      reminders: reminders,
    },
  };
}
