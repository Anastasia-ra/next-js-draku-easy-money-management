import { GetServerSidePropsContext } from 'next';
import Head from 'next/head';
import { useEffect, useState } from 'react';
import Layout from '../../components/Layout';
import { getCategoriesList } from '../../graph-functions/fetchApi';
import {
  getUserByValidSessionToken,
  Category,
  getAllCategoriesbyUserId,
} from '../../util/database';

type Props = {
  userObject: { username: string };
  user: { id: number; username: string };
  // categories: Category[];
};

type Errors = { message: string }[];

type Categories = Category[];

export default function CategoriesManagement(props: Props) {
  const [newCategory, setNewCategory] = useState('');
  const [monthlyBudget, setMonthlyBudget] = useState('');
  const [errors, setErrors] = useState<Errors>([]);
  const [categories, setCategories] = useState<Categories>([]);
  const [maxCategory, setMaxCategory] = useState(false);
  const [categoriesWithExpense, setCategoriesWithExpense] = useState<number[]>(
    [],
  );

  // Display all categories on first render or when userId changes
  useEffect(() => {
    const fetchCategories = async () => await getAllCategories(props.user.id);
    fetchCategories().catch(console.error);
  }, [props.user.id]);

  useEffect(() => {
    setMaxCategory(categories.length > 9);
  }, [categories.length]);

  useEffect(() => {
    const fetchCategoriesWithExpense = async () =>
      await getCategoriesWithExpensesList();
    fetchCategoriesWithExpense().catch(console.error);
  }, []);

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
          name: category[0].toUpperCase() + category.slice(1).toLowerCase(),
          monthlyBudget: Number(budget) * 100,
        },
      }),
    });
    console.log(categoryResponse);

    const categoryResponseBody = await categoryResponse.json();

    if ('errors' in categoryResponseBody) {
      setErrors(categoryResponseBody.errors);
      setNewCategory('');
      setMonthlyBudget('');
      return;
    }

    console.log(categoryResponseBody);
    setErrors([]);
    await getAllCategories(userId);

    console.log('categories', categories.length, categories);
    setNewCategory('');
    setMonthlyBudget('');
  }

  // Check if there is an expense in this category

  async function checkIfExpenseInCategory(categoryId: Number) {
    const categoryResponse = await fetch(`/api/categories/checkCategory`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        category: {
          categoryId: categoryId,
        },
      }),
    });

    const categoryResponseBody = await categoryResponse.json();
    if ('errors' in categoryResponseBody) {
      setErrors(categoryResponseBody.errors);
      return;
    }

    setErrors([]);
    console.log('categoryResponseBody.category', categoryResponseBody.category);
    return categoryResponseBody.category;
  }

  // Delete category

  async function deleteCategory(categoryId: number, userId: number) {
    const deleteResponse = await fetch(`/api/categories/deleteCategory`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        category: {
          categoryId: categoryId,
        },
      }),
    });

    const deleteResponseBody = await deleteResponse.json();

    if ('errors' in deleteResponseBody) {
      setErrors(deleteResponseBody.errors);
      return;
    }
    setErrors([]);
    await getAllCategories(userId);
  }

  async function getCategoriesWithExpensesList() {
    const response = await fetch(`/api/categories/checkAllCategories`);
    const data = await response.json();
    console.log('data', data);
    const categoryList = data.expensesPerCategories.map(
      (expense: { categoryId: number }) => expense.categoryId,
    );
    console.log('categoryList', categoryList);
    setCategoriesWithExpense(categoryList);
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
        <button disabled={maxCategory}>Add a new category</button>
      </form>
      {maxCategory ? (
        <div>You've reached the maximum number of categories.</div>
      ) : null}
      <div>
        {errors.map((error) => {
          return <div key={`error-${error.message}`}>{error.message}</div>;
        })}
      </div>
      <div>
        {categories.map((category) => {
          const hasExpense = categoriesWithExpense.includes(category.id);
          console.log('Category with expense', categoriesWithExpense);
          return (
            <div key={`category-${category.name}`}>
              <div>
                {category.name} {category.monthlyBudget / 100}€
              </div>
              <button
                disabled={hasExpense}
                onClick={async () => {
                  const categoryWithExpense = await checkIfExpenseInCategory(
                    category.id,
                  );
                  await getCategoriesWithExpensesList();
                  if (!categoryWithExpense) {
                    await deleteCategory(category.id, props.user.id);
                    setMaxCategory(false);
                    return;
                  }
                }}
              >
                {' '}
                Delete category{' '}
              </button>
              {hasExpense ? (
                <p>You can only delete categories without expenses</p>
              ) : null}
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

  if (!user) {
    return {
      redirect: {
        destination: '/login?returnTo=/users/categoriesManagement',
        permanent: false,
      },
    };
  }

  const categories = await getAllCategoriesbyUserId(user.id);

  return {
    props: { user: user, categories: categories },
  };
}
