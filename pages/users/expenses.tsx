import { GetServerSidePropsContext } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { useState } from 'react';
import Layout from '../../components/Layout';
import {
  getAllCategoriesbyUserId,
  getUserByValidSessionToken,
} from '../../util/database';

type Category = { categoryName: string; monthly_budget: number };

type Props =
  | {
      userObject: { username: string };
      // user: { id: number; username: string };
      categories: Category[];
    }
  | { userObject: { username: string }; error: string };

export default function Expenses(props: Props) {
  const [date, setDate] = useState<Date>();
  const [price, setPrice] = useState('');
  const [name, setName] = useState('');

  if ('error' in props) {
    return (
      <Layout userObject={props.userObject}>
        <Head>
          <title>Error</title>
          <meta name="description" content="Error to add expenses " />
        </Head>
        <h1>Expenses Error</h1>
        <p>Please login first to be able to add new expenses.</p>
        <Link href="/login?returnTo=/users/categoriesManagement">
          <a>Login</a>
        </Link>
      </Layout>
    );
  }

  const optionsDate = { month: 'long', year: 'numeric' };
  const currentMonth = new Intl.DateTimeFormat('en-US', optionsDate).format(
    new Date(),
  );
  console.log(currentMonth);
  console.log('props.categories', props.categories);

  return (
    <Layout userObject={props.userObject}>
      <Head>
        <title>Draku</title>
        <meta name="description" content="Draku money management" />
      </Head>
      <h1>Add an expense </h1>
      <h2>{currentMonth}</h2>
      {/* <h3>{props.user.id}</h3> */}
      <form
        onSubmit={(event) => {
          event.preventDefault();
        }}
      >
        <label>
          Date
          <input
            type="date"
            value={date}
            onChange={(event) => setDate(event.currentTarget.value)}
          />
        </label>
        <label>
          Price
          <input
            type="number"
            value={price}
            onChange={(event) => setPrice(event.currentTarget.value)}
          />
        </label>
        <label>
          Name
          <input
            value={name}
            onChange={(event) => setName(event.currentTarget.value)}
          />
        </label>
        <label>
          Category
          <select>
            <option value="">Please choose a category</option>
            {props.categories.map((category) => {
              return (
                <option key={category.categoryName}>
                  {category.categoryName}
                </option>
              );
            })}
          </select>
        </label>
        <button>Add</button>
      </form>
    </Layout>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const sessionToken = context.req.cookies.sessionToken;
  const user = await getUserByValidSessionToken(sessionToken);

  if (!user) {
    return {
      props: {
        error: 'Please login',
      },
    };
  }

  const categories = await getAllCategoriesbyUserId(user.id);

  return {
    props: { user: user, categories: categories },
  };
}
