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
  // userObject: { username: string };
  // user: { id: number; username: string };
  // categories: Category[];
};

export default function Reminder(props: Props) {
  const [userEmail, setUserEmail] = useState('');
  const [reminderName, setReminderName] = useState('');
  const [reminderPrice, setReminderPrice] = useState('');
  const [reminderDay, setReminderDay] = useState('');
  const [reminderCategory, setReminderCategory] = useState('');

  return (
    <Layout>
      {/* <Head>
        <title>Reminders</title>
        <meta name="reminder" content="Add reminders" />
      </Head>
      <form
        onSubmit={(event) => {
          event.preventDefault();
        }}
      >
        <label>
          Email
          <br />
          <input
            value={userEmail}
            onChange={(event) => {
              setUserEmail(event.currentTarget.value);
            }}
          />
        </label>
        <br />
        <label>
          Name
          <br />
          <input
            value={reminderName}
            onChange={(event) => {
              setReminderName(event.currentTarget.value);
              console.log('name', event.currentTarget.value);
            }}
          />
        </label>
        <br />
        <label>
          Price (€)
          <br />
          <input
            type="number"
            value={reminderPrice}
            onChange={(event) => setReminderPrice(event.currentTarget.value)}
          />
        </label>
        <br />
        <label>
          Name
          <br />
          <input
            type="number"
            value={reminderDay}
            onChange={(event) => setReminderDay(event.currentTarget.value)}
          />
        </label>
        <br />
        <label>
          Category
          <br />
          <select
            value={reminderCategory}
            onChange={(event) => {
              setReminderCategory(event.currentTarget.value);
            }}
          >
            <option value="">Choose a category</option>

            {props.categories.map((category) => {
              return (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              );
            })}
          </select>
        </label>
        {/* {errors.map((error) => {
          return <div key={`error-${error.message}`}>{error.message}</div>;
        })} */}
      {/* <button>Add</button>
      </form> */}
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
