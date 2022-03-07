import { GetServerSidePropsContext } from 'next';
import Head from 'next/head';
import { useEffect, useState } from 'react';
import Layout from '../../components/Layout';
import { getCategoriesList } from '../../graph-functions/fetchApi';
import { getUserByValidSessionToken, Category } from '../../util/database';

type Props = {
  userObject: { username: string };
  user: { id: number; username: string };
};

type Errors = { message: string }[];

type Categories = Category[];

export default function CategoriesManagement(props: Props) {
  const [newCategory, setNewCategory] = useState('');
  const [monthlyBudget, setMonthlyBudget] = useState('');
  const [errors, setErrors] = useState<Errors>([]);
  const [categories, setCategories] = useState<Categories>([]);

  // Display all categories on first render or when userId changes
  useEffect(() => {
    const fetchCategories = async () => await getAllCategories(props.user.id);
    fetchCategories().catch(console.error);
  }, [props.user.id]);

  async function getAllCategories(userId: number) {
    const categoriesListResponseBody = await getCategoriesList(userId);
    setCategories(categoriesListResponseBody.categoriesList);
  }

  // Add category to database
  async function addCategory(userId: number, category: string, budget: string) {
    const categoryResponse = await fetch(`/api/categories/addCategories`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        category: {
          userId: userId,
          name: category.toLowerCase(),
          monthlyBudget: Number(budget),
        },
      }),
    });
    console.log(categoryResponse);

    const categoryResponseBody = await categoryResponse.json();

    if ('errors' in categoryResponseBody) {
      setErrors(categoryResponseBody.errors);
      return;
    }

    console.log(categoryResponseBody);
    setErrors([]);
    await getAllCategories(userId);
  }

  return (
    <Layout userObject={props.userObject}>
      <Head>
        <title>Your categories</title>
        <meta name="description" content="categories management" />
      </Head>
      <h1>Your categories</h1>
      <form
        onSubmit={async (event) => {
          event.preventDefault();
          await addCategory(props.user.id, newCategory, monthlyBudget);
        }}
      >
        <label>
          Category
          <input
            value={newCategory}
            onChange={(event) => setNewCategory(event.currentTarget.value)}
          />
        </label>
        <label>
          Monthly budget
          <input
            value={monthlyBudget}
            onChange={(event) => setMonthlyBudget(event.currentTarget.value)}
          />
        </label>
        <button>Add a new category</button>
      </form>
      <div>
        {errors.map((error) => {
          return <div key={`error-${error.message}`}>{error.message}</div>;
        })}
      </div>
      <div>
        {categories.map((category) => {
          return (
            <div key={`category-${category.name}`}>
              {category.name} {category.monthlyBudget}
            </div>
          );
        })}
      </div>
    </Layout>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const sessionToken = context.req.cookies.sessionToken;
  const user = await getUserByValidSessionToken(sessionToken);

  if (user) {
    return {
      props: { user: user },
    };
  }

  return {
    redirect: {
      destination: '/login?returnTo=/users/categoriesManagement',
      permanent: false,
    },
  };
}
