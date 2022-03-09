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
  const [maxCategory, setMaxCategory] = useState(false);
  const [categoryHasExpense, setCategoryHasExpense] = useState(false);
  const [isClicked, setIsClicked] = useState(false);

  // Display all categories on first render or when userId changes
  useEffect(() => {
    const fetchCategories = async () => await getAllCategories(props.user.id);
    fetchCategories().catch(console.error);
  }, [props.user.id]);

  useEffect(() => {
    setMaxCategory(categories.length > 9);
  }, [categories.length]);

  async function getAllCategories(userId: number) {
    const categoriesListResponseBody = await getCategoriesList(userId);
    setCategories(categoriesListResponseBody.categoriesList);
  }

  // Add category to database
  async function addCategory(userId: number, category: string, budget: string) {
    // if (categories.length >= 10) {
    //   console.log('categories', categories.length, categories);
    //   setErrors([
    //     {
    //       message:
    //         'You can have a maximum of 10 categories. Please delete a category if you want to add another one.',
    //     },
    //   ]);
    //   return;
    // }

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

    console.log('categories', categories.length, categories);
    // if (categories.length === 10) {
    //   setMaxCategory(true);
    // }
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

  // Check for the whole array

  // const categoryWithExpense = await checkIfExpenseInCategory(categories.map());

  //   async function checkCategoryList() {
  // for

  //   }

  // const filteredCategories = categories.filter(async (e) => {
  //   const categoryWithExpense = await checkIfExpenseInCategory(e.id);
  //   console.log('categoryWithExpense in filter', e.id, categoryWithExpense);
  //   return categoryWithExpense;
  // });
  // console.log('filteredCategories', filteredCategories);

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
          return (
            <div key={`category-${category.name}`}>
              <div>
                {category.name} {category.monthlyBudget}
              </div>
              <button
                onClick={async () => {
                  const categoryWithExpense = await checkIfExpenseInCategory(
                    category.id,
                  );
                  if (!categoryWithExpense) {
                    await deleteCategory(category.id, props.user.id);
                    setMaxCategory(false);
                    return;
                  }
                  // setIsClicked(true);
                }}
                // disabled={async () => {
                //   const categoryWithExpense = await checkIfExpenseInCategory(
                //     category.id,
                //   );

                //   return categoryWithExpense;
                // }}
              >
                {' '}
                Delete category{' '}
              </button>
              {/* {isClicked && category.id ? (
                <p>You can only delete categoires without expenses</p>
              ) : null} */}
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
