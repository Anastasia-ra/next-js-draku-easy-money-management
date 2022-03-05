import { GetServerSidePropsContext } from 'next';
import Head from 'next/head';
import { useEffect, useState } from 'react';
import Layout from '../../components/Layout';
import { getUserByValidSessionToken } from '../../util/database';

type Props = {
  userObject: { username: string };
  user: { id: number; username: string };
};

type Errors = { message: string }[];

type Categories = {
  categoryName: string;
  monthlyBudget: number;
};

export default function CategoriesManagement(props: Props) {
  const [newCategory, setNewCategory] = useState('');
  const [monthlyBudget, setMonthlyBudget] = useState('');
  const [errors, setErrors] = useState<Errors>([]);
  const [categories, setCategories] = useState<Categories[]>([]);

  async function getAllCategories() {
    const categoriesListResponse = await fetch(
      `/api/categories/getAllCategories`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: props.user.id,
        }),
      },
    );
    const categoriesListResponseBody = await categoriesListResponse.json();

    setCategories(categoriesListResponseBody.categoriesList);
  }

  async function addCategory(userId: number, category: string, budget: string) {
    const categoryResponse = await fetch(`/api/categories/addCategories`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        category: {
          userId: userId,
          categoryName: category.toLowerCase(),
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
    await getAllCategories();

    // Update categories
    // const newCategoriesList: ResponseBody[] = [
    //   ...categories,
    //   categoryResponseBody,
    // ];
    // setCategories(newCategoriesList);
  }

  useEffect(() => getAllCategories(), []);

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
        <button
        // onClick={() => addCategory(props.user.id, newCategory, monthlyBudget)}
        >
          Add a new category
        </button>
      </form>
      <div>
        {errors.map((error) => {
          return <div key={`error-${error.message}`}>{error.message}</div>;
        })}
      </div>
      {/* <div>
        {categories.map((e) => {
          return (
            <div key={`category-${e.category.categoryName}`}>
              {e.category.categoryName}
            </div>
          );
        })}
      </div> */}
      {/* <button onClick={() => getAllCategories()}>Display all categories</button> */}
      <div>
        {categories.map((e) => {
          return (
            <div key={`category-${e.categoryName}`}>
              {e.categoryName} {e.monthlyBudget}
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
